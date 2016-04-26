SGE.Error = new function(){
    var _log = [];
    var _errors = {
        0xE00000: ["Error code not registered", "error", false],
        0xE00001: ["Error code already registered, not overwritten", "warning", false],
    }

    var _raise = function(code, args){
        if(!_errors[code]) code = 0xE00000;

        _log.push([code,args]);
        var e = _errors[code];
        console[e[1]](e[0]);
        if(e[2]) e[2](args);
    }

    var _register = function(code, msg, type, cb){
        if(_errors[code].length) code = 0xE00001;
    
        _errors[code] = [msg, type, cb];
    }

    this.Raise = _raise;
    this.Register = _register;
}
