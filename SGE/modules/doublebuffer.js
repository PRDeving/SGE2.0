SGE.NewModule('DoubleBuffer', function(drawfunctions){
    var dfs = drawfunctions || [];

    var backbuffer_c = document.createElement("canvas");
    var backbuffer_ctx = backbuffer_c.getContext("2d");

    var frontbuffer_c;
    var frontbuffer_ctx;

    var SGERaster = SGE.hasModule("rasterizer");
    var _depthBuffer = 1000 |0;



    var _bindTo = function(c){
        frontbuffer_c = c.canvas;
        backbuffer_c.width = c.canvas.width;
        backbuffer_c.height = c.canvas.height;

        if(SGERaster){
            SGE.Rasterizer.setUp(backbuffer_ctx, _depthBuffer);
        }

        frontbuffer_ctx = c
        c.swapBuffer = _swap;
    }

    var _prerender = function(){
        if(SGERaster) SGE.Rasterizer.init();

        for(var df of dfs) df(backbuffer_ctx);

        if(SGERaster) SGE.Rasterizer.present();
    }

    //var _depthBuffer

    var _swap = function(){
        frontbuffer_ctx.clearRect(0,0,frontbuffer_c.width,frontbuffer_c.height);
        frontbuffer_ctx.drawImage(backbuffer_c, 0, 0);
        _prerender();
    }

    this.bindTo = _bindTo;
    this.depthBuffer = function(b){_depthBufferEnabled = b;};
    this.swapBuffer = _swap;
    this.setDepthBuffer = function(db){_depthBuffer = db |0};

    return this;
});
