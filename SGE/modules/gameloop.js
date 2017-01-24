SGE.NewModule('GameLoop', new function(){
    var priorize = [];
    var toExecute = [];
    var loop = null;

    var _Suscribe = function(fn,pr){
        if(pr){
            priorize.push(fn);
        }else{
            toExecute.push(fn);
        }
    };

    var _Run = function(fps){
        loop = setInterval(function(){
            for(var x = 0; x < priorize.length; x++){
                priorize[x]();
            }
            for(var x = 0; x < toExecute.length; x++){
                toExecute[x]();
            }

        },1000/fps);
    };

    var _Stop = function(){
        clearInterval(loop);
        loop = null;
    };

    var _Clear = function(){
        _Stop();
        priorize.length = 0;
        toExecute.length = 0;
    };

    this.Suscribe = _Suscribe;
    this.Run = _Run;
    this.Stop = _Stop;
    this.Clear = _Clear;
});
