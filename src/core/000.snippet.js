(function (ctx, factory) {
    if(!factory) return false;

    var _conf = {
        ES6: (typeof ctx.Set === "function")? true : false,
        Browser: (typeof ctx.DOMError === "function")? true : false
    }

    if(!_conf.Browser && typeof module === "object" && typeof module.exports === "object"){
        module.exports = factory(ctx, _conf);
    } else {
        factory(ctx, _conf );
    }

})((typeof window === "object")? window : ((typeof global === "object")? global : false), function(ctx, conf){

    var SGE = {
        Context: ctx,
        Conf: conf
    };
