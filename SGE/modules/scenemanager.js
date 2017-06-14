SGE.NewModule('Scene', new function(){
    var scenes = {};
    var loaded = [0,0];
    var current;
    var hasGameLoop = SGE.hasModule("gameloop");

    var _Add = function(name, callback, destructor){
        loaded[0]++;
        if(typeof callback == "function"){
            scenes[name] = {
                'callback': callback,
                'destructor': destructor || false
            };
            loaded[1]++;
        }else if(typeof callback == "string"){
            $.getScript(callback)
                .done(function(script){
                    scenes[name] = {
                        'callback': (typeof SceneConstructor != "undefined")? SceneConstructor : function(){console.log("SceneConstructor not defined in "+callback)},
                        'destructor': (typeof SceneDestructor != "undefined")? SceneDestructor : function(){console.log("SceneDestructor not defined in "+callback)}
                    }
                    delete SceneConstructor;
                    delete SceneDestructor;

                    console.log("Scene "+name+" loaded from "+callback);
                    loaded[1]++;
                })
                .fail(function(xhr, settings, exception){
                    console.warn("%c Scene "+name+" couldn't be loaded from "+callback, settings);
                });

        }
    };

    var _scdel = 0;
    var _LoadScene = function(name){
      if (!_isLoaded()) {
        console.warn('Scene loading delayed');
        _scdel++;
        if (_scdel++ > 5) return console.error('5 attempts, theres an error fetching ' + name);
        return setTimeout(function() {
          _LoadScene(name);
        }, 300)
      }

      var args = [];
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
      if(current && scenes[current].destructor) scenes[current].destructor.apply(this, args);
      current = name;
      if(hasGameLoop){
        SGE.GameLoop.Clear();
      }
      scenes[name].callback.apply(this, args);
    };

    var _isLoaded = function(){
        return loaded[0] === loaded[1];
    }

    this.Add = _Add;
    this.Load = _LoadScene;
    this.isLoaded = _isLoaded;
    this.__defineGetter__("current",function(){return current});
});  // SCENE
