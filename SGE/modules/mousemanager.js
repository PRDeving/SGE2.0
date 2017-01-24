SGE.NewModule('Mouse', new function(){
    var X;
    var Y;

    $(window).on("mousemove",function(e){
        X = e.pageX;
        Y = e.pageY;
    });

    var _position = function(){
        return {X:X,Y:Y};
    }

    this.Position = _position;
});
