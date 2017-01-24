SGE.NewModule('CanvasManager', new function(){
    var _canvas;
    var _ctx;

    var _init = function(cid){
        if(cid && typeof cid != "number"){
            _canvas = document.getElementById(cid);
        }else{
            _canvas = document.createElement("canvas");
            document.getElementsByTagName("body")[0].appendChild(_canvas);
        }
        _ctx = _canvas.getContext("2d");

        _canvas.width = arguments[arguments.length - 2] || innerWidth || $(window).width();
        _canvas.height = arguments[arguments.length - 1] || innerHeight || $(window).height()
        window.canvas = _canvas;
        window.ctx = _ctx;

        if(typeof window.canvas != "undefined" && typeof window.ctx != "undefined"){
            
            if(SGE.Config.Debug)
                console.log("canvas initialized");

            return true;
        }

        if(SGE.Config.Debug)
            console.log("error initializing canvas");
        
        return false;
    }

    this.Init = _init;
});
