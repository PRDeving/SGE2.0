# SGE2.0
SGE is a modular, adaptative, multipurpose Javascript engine created from scratch to build from websites to webapps or videogames easily.
This second version is more efficient and secure, running code in sandbox and ensuring module avaiability and framework stability.

## WHAT SGE DOES? ##
SGE does exactly what you want it to do.
Load a scenes module to build a web app or make it load your custom WebGL manager on loadtime, it's easy and customizable.

## HOW DOES IT WORK? ##
SGE injects the dependences needed, the modules you tell it to load and the custom assets that you want to use in order, once everything is loaded, the Main function is fired.

SGE needs two files to work, the config.json file that includes all SGE configurations and the application js.

- #config.json
    config file has all the configurations of SGE, here you can disable the console debugger or add modules, dependencies or packages to load.

- #application.js
    this file can be named as you want to, the path has to be specified in the html `<script>` tag using the attribute "app".
    This file has the core of the application, it defines the boostrap functions.

    - ##Init (optional)
        it has modules definitions and configurations.
        if you want to use custom modules or configure scenes or default modules, this is your function.

    - ##Main
        it has the core code.
        application code is write here, you can use it or not, remember, you can load your custom modules, controllers, etc.

# SAMPLE CODE

- config.json
```
{
    "Debug":true,
    "modules":[
        "scenemanager"
    ]
}
```

- application.js
```

SGE.bootstrap(Init, Main);
function Init(){
    //this function fires on the first load, here should be all modules configuration.
    console.log("Initializing");

    //We are using the scenemanager module, so lets define a scene called "hello_world"
    SGE.Scene.Add("hello_world", function(){
        $("body").html("Hello world!");
        console.log("Hello world!")
    });
}
function Main(){
    //this function is trigged when all modules are loaded
    console.log("it works");

    //Now lets fire the "hello_world" scene
    SGE.Scene.Load("hello_world");
}
```

- index.html
```
<head>
    <script app="application.js" src="SGE/engine.js"></script>
</head>
<body>
</body>
```

#MODULES
SGE modules are prebuilt pieces of code stored in SGE/modules/. All modules has the same structure that allows SGE to load them in a memory efficent way (i guess), all of them are ready to work

SGE has some prebuilt modules that you can activate in the config.json

- ###bootstrap
    it defines the app entry points (init and main), should be defined in the application file

    SGE.bootstrap(function init (optional), function main);

- ###loader (inbuilt)
    it allows you to load your own modules. Also, since SGE2.0, loader can pass the modules to the callback

    SGE.Loader.Add(string pathOfYourModule, function callback (optional));

    ```javascript
    SGE.Loader.Add({
      names: 'names.txt',
      func: 'mycoolfunction.js',
      dict: 'dictionary.json'
    }, function(data) {
      // data.names => 'somerandomtext'
      // data.func();
      // data.dict => {[..], [..]}
    }

    SGE.Loader.Add([
      'names.txt',
      'mycoolfunction.js',
      'dictionary.json'
    ], function(data) {
      // data[0] => 'somerandomtext'
      // data[1]();
      // data[2] => {[..], [..]}
    }

    SGE.Loader.Add([
      'names.txt',
      'mycoolfunction.js',
      'dictionary.json'
    ]};
    ```

- ###scenemanager
    it allows you to manage scenes, you can define them and fire them at your will.

    SGE.Scene has two functions:
    - SGE.Scene.Add(string name, function callback, function destructor)

        Defines your scene.
    - SGE.Scene.Load(string name, object arguments = null)
        
        Fires your scene, you can pass args if you want to, they have to be catched in the catcher's scene definition
        ```
            //Defines scene that catches args
            SGE.Scene.Add("getter", function(args){
                console.log("my name is ",args[0]);
            });

            //Fires the scene
            SGE.Scene.Load("getter",["Pablo"]);
        ```
    ####16 Dec 2015 Update:

    - Now you can define a destructor for each scene that will be called before changing scene

- ###gameloop
    The easiest kind of loop ever. just define the actions and subscribe them to the loop.

    SGE.GameLoop has four functions:

    - SGE.GameLoop.Suscribe(function fn, boolean priorize = false)
        you can suscribe any function and it'll be fired in every loop.
        Priorized suscriptions will be fired first, so you can control inputs or logic before draw (ex).
    - SGE.GameLoop.Run(int fps)
        This start's the loop at the fps required.
        This will clear the canvas (var ctx) if it has been defined (sounds dumb, gonna change it soon)
    - SGE.GameLoop.Stop()
        Stops the loop, you can rerun it calling SGE.GameLoop.Run() again.
    - SGE.GameLoop.Clear()
        Stops the loop and clears all the suscribed functions

- ###mousemanager
    It's not very usefull but i like it :)
    i dont think i will work more in this module, aint necessary.

    mousemanager checks the cursor position on live, it has one function to use:

    - SGE.Mouse.Position()
        returns an object with the mouse position
        ```
        {
            X: int mouse X,
            Y: int mouse Y
        }
        ```
        Yo can get positions using SGE.Mouse.Position().X or SGE.Mouse.Position().Y

- ###debugger
    Displays a logger div where you can add debug info in real time.

    The name of the logged info has to be suitable to be an DOMElement Id (no commas, spaces, etc);

    ```javascript
    SGE.Debugger.Log({
        "PositionX": pos.x,
        "PositionY": pos.y
    });
    ```

- ###fullscreen
    It fires the full screen and calls the callback if theres any, it needs user interaction.
    SGE.FullScreen(funcion callback = null)

- ###canvasmanager (Added 16 Dec 2015)
    Gets the renderer of an canvas element or creates it if it hasn't been provided

    ```javascript
        //you can create a new canvas element by calling...
        SGE.CanvasManager.Init(int width, int height);
        SGE.CanvasManager.Init(250, 250);

        //or you can initializate a context in an existing canvas calling...
        SGE.CanvasManager.Init(string querySelector);
        SGE.CanvasManager.Init("#mycanvas");
    ```

- ###doublebuffer (Added 16 Dec 2015)
    Creates an double buffering system to the canvas element.

    ```javascript
    //Define the drawfunctions
    function square1(){
        ctx.fillRect(0,0,10,10);
    }
    function square2(){
        ctx.fillRect(20,20,10,10);
    }

    //Initiate a canvas context
    SGE.CanvasManager.Init(400,400);

    //Create a buffer with the draw functions (array)    
    var buffer = SGE.DoubleBuffer([square1, square2]);

    //Bind the buffer to the render where it has to be shown (context)
    buffer.bindTo(ctx);

    //just swap buffers whenever you need
    var loop = setInterval(ctx.swapBuffer, 1000/60);
    ```

- ###structures (Added 16 Dec 2015)
    Includes some structures.

    - vec2: 2D vectors with x and y coords.

    ```javascript
        var pos = new SGE.Struct.vec2(10, 41);
    ```

    - vec3: 3D vectors with x, y and z coords.

    ```javascript
        var pos = new SGE.Struct.vec3(10,5,13);
    ```

    vec2 and vec3 includes the operate method, due Javascript doesnt allow overload operators theres an in-built method to 
    make aritmetical calculations with structures

    ```javascript
        var a = new SGE.Struct.vec2(10,2);
        var b = new SGE.Struct.vec2(1,1);

        var c = a.operate("+",b); // {x:11,y:3}
        var c = a.operate("-",b); // {x:9,y:1}
        var c = a.operate("*",b); // {x:10,y:2}
        var c = a.operate("/",b); // {x:10,y:2}
        a.operate("+=",b); // a = {x:11,y:3}
        a.operate("-=",b); // a = {x:9,y:1}
        ...
    ```

- ###mediamanager (Added 22 Jan 2017)
    Preload images and media

    - Images.Preload (Object, function)

    Preloads the images from the object and executes the function (callback) when loaded with the new object (media) as argument;

    ```javascript
      SGE.Images.Preload({
        test: 'testimage.png',
        test2: 'testimage2.png',
      }, function(media) {
        /* media = {
            test: ...
            test2: ...
          } */
          ctx.drawImage(media.test, 0, 0);
          ctx.drawImage(media.test2, 0, 0);
      });
    ```


#Another piece of code
Gonna use a custom module, the scenes module and the gameloop module

- customjs.js
```
    function printhello(n){
        console.log("hello ", n);
    }
```
- application.js
```
function Init(){
    //We load our custom printhello function
    SGE.Loader.Add("/mymodules/customjs.js");

    //And creates the main scene
    SGE.Scenes.Add("inloop",function(){
        var n = 0;
        SGE.GameLoop.Suscribe(printhello(n));
        SGE.GameLoop.Suscribe(function(){n++}, true);
        SGE.GameLoop.Run();
    });
}

function Main(){
    SGE.Scene.Load("inloop");
}

```


#Updates

- 24 Jan 2016
    Changes in the core and a rewrited Loader makes it more stable defining the SGE2.0, now SGE.bootstrap is necesary in order to run the application (not compatible with SGEv1 apps)

    Now modules are built using SGE.NewModule

    Now SGE ensures that scenes are loaded before firing Main

    Now SGE.Load can assign loaded scripts, functions, jsons or txts and return the references to the callback

    quickier bootstrap

- 23 Dec 2015:

    Some changes in the core, now the Init function is optional.

    Now the Init function return will be passed to the Main function as argument, so there's no more global vars

- 16 Dec 2015:

    canvasmanager, structures and doublebuffer modules added, added destructor on scenemanager.

    Changed the way to define modules, fixed the residual trash that it was lefting arround.
