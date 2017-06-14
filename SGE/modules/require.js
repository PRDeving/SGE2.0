(function() {
  var _modules = {};
  var define = function(name, deps, cb) {
    var cb = arguments.length > 1 ? arguments[arguments.length - 1] : false;
    if (_modules[name])
      throw new Error( 'Theres already a module defined as:', name);
    _modules[name] = [arguments.length === 3 ? deps : [], cb, false];
  }

  var _requireModule = function(n) {
    if (_modules[n] === undefined)
      throw new Error('Theres no said module: ' + n);
    if (_modules[n][2]) return _modules[n][1];
    var d = [];
    for (var i in _modules[n][0])
      d.push(_requireModule(_modules[n][0][i]));

    // _modules[n] = typeof _modules[n][1] !== 'function' ? _modules[n][1] : _modules[n][1].apply(this, d) || true;
    _modules[n][1] = _modules[n][2] || typeof _modules[n][1] != 'function' ? _modules[n][1] : _modules[n][1].apply(this, d);
    _modules[n][2] = true;
    return _modules[n][1];
  }

  var require = function(deps, fn) {
    var cb = arguments.length > 1 ? arguments[arguments.length - 1] : false;
    var d = [];
    for (var i in deps)
      d.push(_requireModule(deps[i]));
    return cb ? cb.apply(this, d) : (d.length === 1 ? d[0] : d);
  }

  SGE.NewModule('Require', require);
  SGE.NewModule('Define', define);
  SGE.NewModule('showModules', function() {
    console.log(_modules);
  });
})();
