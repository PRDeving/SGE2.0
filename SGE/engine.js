(function(){
  var csstitle = "color: #333; font-size: 18px";
  var csssubtitle = "color: #555; font-size: 14px";
  var csssuccess = "color: #0f0; font-size: 14px";
  var csswarning = "color: #f00; font-size: 14px";

  var ENGINE_PATH = "SGE/";
  var SGE = {};
  var boostrapfn = {init: false, main: false};

  function bootstrap(init, main) {
    boostrapfn.init = main ? init : false;
    boostrapfn.main = main ? main : init;
  }

  // Load the script
  var script = document.createElement("script");
  script.src = ENGINE_PATH + '/lib/jquery.js';
  script.type = 'text/javascript';
  document.getElementsByTagName("head")[0].appendChild(script);

  var checkReady = function(callback) {
    if (window.jQuery) {
      callback(jQuery);
    } else {
      setTimeout(function() { checkReady(callback); }, 100);
    }
  };

  checkReady(function($) {
    SGE.Loader = new _Loader2_();

    $.ajax({
      url: 'config.json',
      dataType: 'json',
      async: false,
      success: function(data){
        Config = data;
        SGE.Config = Config;
        noDebug();

        console.log("%c Archivo de configuracion config.json cargado", csssuccess);

        var mods = [];
        if (Config.dependencies)
          for(var x in Config.dependencies) {
            mods.push(Config.dependencies[x]);
          }
        if (Config.modules)
          for(var x in Config.modules){
            mods.push(ENGINE_PATH + "modules/" + Config.modules[x] + ".js");
          }

        if (mods.length) SGE.Loader.Add(mods, false, true);
        SGE.Loader.Run(function() {

          var applicationjs;
          $("script").each(function(){
            if($(this).attr("app")){
              applicationjs = $(this).attr("app");
            }
          });

          console.log("%c Main app: ", csstitle ,applicationjs);

          SGE.Loader.Add(applicationjs, function (d) {
            var iret = boostrapfn.init();

            SGE.Loader.Run(function() {
              console.log("%c Iniciando aplicacion",csstitle)
              boostrapfn.main(iret);
            });
          }, true, true);
          SGE.Loader.Run();
        });
      },

      error: function(xhr, ajaxOptions, thrownError){
        if(xhr.status==404){
          console.log("%c no existe archivo de configuracion config.json", csswarning);
        }else if(xhr.status==200){
          console.log("%c Error en archivo de configuracion config.json", csswarning);
          console.log(thrownError);
        }
      }
    });
  });



  function _Loader2_() {
    var loads = [];

    function _Add (scripts, callback, system, app) {
      var m = typeof scripts === 'string' ? [scripts] : scripts;
      var t = typeof scripts === 'object' ? 'object' : 'array';
      var tot = t === 'array' ? m.length : Object.keys(m).length;

      loads.push({
        modules: m,
        type: t,
        total: tot,
        loaded: 0,
        callback: callback || false,
        system: system || false,
        app: app || false,
      });
    }

    function _Run(donefn) {
      var blocks = loads.slice(0);
      loads.length = 0;
      var tot_blocks = blocks.length;
      var loaded = 0;

      for (var i = 0; i < blocks.length; i++) {
        _requireBlock(blocks[i]);
      }

      function _requireBlock(block) {
        var ret = block.type === 'object' ? {} : (block.modules.length > 1 ? [] : false);

        function toRet(d, id) {
          switch (block.type) {
            case 'object':
              ret[id] = d;
              break;
            default:
              if (block.modules.length > 1) ret.push(d);
              else ret = d;
          }
        }

        for (var m in block.modules) {
          _requireModule(block.modules[m], block, m);
        }

        function _requireModule(url, block, id) {
          _req(url, block.app, block.system, function(data) {
            block.loaded++;
            if (SGE.Config.Debug)
              console.log('Got module: ' + url, block.loaded, '/', block.total);
            if (block.app) {
              toRet((new Function(data))(), id);
            } else {
              if (/\w+.json$/.test(url)) { toRet(JSON.parse(data), id); }
              else if (/\w+.js$/.test(url)) {
                switch (data[0]) {
                  case 'S':
                    if (data.indexOf('SGE.') === 0)
                      toRet(new Function(data)(), id);
                    break;
                  default:
                    toRet(new Function('return ' + data)(), id);
                    break;
                }
              } else {
                toRet(data, id);
              }
            }

            if (block.total == block.loaded) {
              loaded++;
              if (block.callback) block.callback(ret);
              if (tot_blocks == loaded && donefn) donefn();
            }
          });
        }
      }

      function _req(url, app, system, done) {
        $.ajax({
          url: url,
          dataType: 'text',
          method: 'GET',
          cache: Config.ModuleCache || false,

          success: function(data){
            console.log('%c Cargado: ' + this.url, csssuccess);
            if (done) done(data);
          },
          error: function(xhr, ajaxOptions, thrownError){
            if(system){
              console.log('%c Error cargando Modulos de sistema', csswarning);
            }else{
              console.log('%c Error cargando dependencias de aplicacion \n', csswarning);
            }

            if(xhr.status == 404){
              console.log(url + " %c no existe", csswarning);
            }else if(xhr.status == 200){
              console.log("%c Error en "+ url, csswarning);
              console.log(thrownError);
            }
          }
        });
      }

    }

    this.Add = _Add;
    this.Run = _Run;
  }
  // SGE.Loader2 = new _Loader2_();



  // MODULO CARGADOR
  //
  // CARGA TODOS LOS ARCHIVOS PASADOS Y EJECUTA CALLBACK AL TERMINAR

  // function _Loader_() {
  //   var loads = [];
  //   var t = 0;
  //   var tc = 0;
  //
  //   function _Add (scripts, callback, system, app) {
  //     loads.push({
  //       modules: (typeof scripts === 'string') ? [scripts] : scripts,
  //       type: typeof scripts === 'object' ? 'object' : 'array',
  //       callback: callback || false,
  //       system: system || false,
  //       app: app || false,
  //     });
  //     t++;
  //   };
  //
  //   function _Run(donefn) {
  //     if (!loads.length) donefn();
  //     var lo;
  //
  //     var mdt = 0;
  //     var mdc = 0;
  //
  //     var ldt = 0;
  //     var ldc = 0;
  //
  //     while (loads.length > 0) {
  //       lo = loads[0];
  //
  //       var r = lo.type === 'object' ? {} : [];
  //       ldt = lo.type === 'object' ? Object.keys(lo.modules).length : lo.modules.length;
  //       mdt += ldt;
  //
  //       for (var m in lo.modules) {
  //         _LoadModule(lo.modules[m], m, lo.system, lo.app, lo.callback, function(idx, data, app, cb) {
  //           var ret;
  //           mdc ++;
  //           ldc ++;
  //
  //           if (app) {
  //             ret = (new Function(data))();
  //           } else if (cb) {
  //             switch (data[0]) {
  //               case 'f':
  //                 ret = new Function('return ' + data)();
  //                 break;
  //               case '[':
  //               case '{':
  //                 ret = JSON.parse(data);
  //                 break;
  //               case 'S':
  //                 if (data.indexOf('SGE.NewModule') === 0)
  //                   ret = new Function(data)();
  //                 break;
  //               default:
  //                 ret = data;
  //                 break;
  //             }
  //
  //             // if (ldt == ldc && cb) cb(ret);
  //
  //           } else {
  //             ret = (new Function(data))();
  //           }
  //
  //           if (lo.type === 'object') r[idx] = ret;
  //           else r.push(ret);
  //
  //           console.log(ldt, ldc, cb);
  //           if (ldt == ldc && cb) cb(r);
  //           // if (cb) cb(ret);
  //           if (mdt == mdc && donefn) donefn();
  //         });
  //       }
  //       loads.shift();
  //     }
  //
  //     function _LoadModule(module, idx, system, app, fn, cb) {
  //       $.ajax({
  //         url: module,
  //         dataType: 'text',
  //         method: 'GET',
  //         cache: Config.ModuleCache || false,
  //
  //         success: function(data){
  //           console.log('%c Cargado: ' + this.url, csssuccess, mdc + 1,"/", mdt);
  //           cb(idx, data, app, fn);
  //         },
  //         error: function(xhr, ajaxOptions, thrownError){
  //           if(system){
  //             console.log('%c Error cargando Modulos de sistema', csswarning);
  //           }else{
  //             console.log('%c Error cargando dependencias de aplicacion \n', csswarning);
  //           }
  //
  //           if(xhr.status==404){
  //             console.log(this.url + " %c no existe", csswarning);
  //           }else if(xhr.status==200){
  //             console.log("%c Error en "+ this.url, csswarning);
  //             console.log(thrownError);
  //           }
  //         }
  //       });
  //     }
  //   }
  //
  //   this.Add = _Add;
  //   this.Run = _Run;
  // }


  //// CORE TOOLS

  function noDebug(msg){
    if(!Config.Debug ||  !console || !console.log){
      if(SGE.Debugger){
        delete SGE.Debugger;
      }
      oldConsoleLog = console.log;
      window['console']['log'] = function() {};
    }
  }

  function NewModule(name, fn){
    if(hasModule(name)) {
      console.log("SGE already has an module called "+name);
      return false;
    } 
    SGE.Config.modules.push(name);
    SGE[name] = fn;
  }

  function hasModule(module){
    if(SGE.Config.modules.indexOf(module) >= 0){
      return true;
    }else{
      return false;
    }
  }

  SGE.hasModule = hasModule;
  SGE.NewModule = NewModule;
  SGE.bootstrap = bootstrap;

  window.SGE = SGE;
})();
