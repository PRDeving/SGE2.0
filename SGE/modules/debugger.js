SGE.NewModule('Debugger', new function(){
    var $fdebugger;

    var _Init = function(){
        if(Config.Debug){
            if($('#fdebugger').length <= 0){
                $('body').append($('<div id="fdebugger">').css({
                    "position": "fixed",
                    "top": "0px",
                    "right": "0px",
                    "padding": "5px 10px",
                    "border": "2px solid #888",
                    "background": "rgba(0,0,0,0.3)"
                }));
            }
            $fdebugger = $('#fdebugger');
        }
    };

    var _Log = function(arg){
        if(Config.Debug){
            for(var x in arg){
                if($fdebugger.find('#'+x).length > 0){
                    $fdebugger.find('#'+x).html(x + ': ' + arg[x]);
                }else{
                    $fdebugger.append(
                        $('<p id="' + x + '">').html(x + ': ' + arg[x])
                    );
                }
            }
        }
    };

    _Init();
    this.Log = _Log;
});
