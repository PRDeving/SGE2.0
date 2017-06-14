SGE.NewModule('Template', new function() {
  const keyReg = /\{\{([^\\}]*(?:\\.[^\\}]*)*)\}\}/gm;
  const forReg = /\{\{each (\w+.*?)\}\}(.*?)\{\{end\}\}(?=[^}}]*$)/gm
  const instructionReg = /{{(\w+) (\w+.*?)}}(.*?)\{\{end\}\}(?=[^}}]*$)/;

  const cache = {};

  function _treeVal(par, val) {
    if (!/\./.test(val)) return par[val];
    var mt = val.split('.') || [];
    var ref = (par || []);
    for (var i in mt) {
      ref = ref[i];
      if (ref === undefined) return [];
    }
    return ref;
  }

  function _topLayer(tpl, vl) {
    var start = (function() {
      var e = tpl.indexOf('{{each');
      var i = tpl.indexOf('{{if');
      return e > i && i > -1 ? i : e;
    })();
    var pnt = start;
    var opc = 0;
    var clc = 0;
    var frag;

    for (var i = pnt; i < tpl.length; i++) {
      // if (tpl[i] != '{') continue;
      frag = tpl.substr(i);
      if (frag.indexOf('{{each') == 0) opc++;
      else if (frag.indexOf('{{if') == 0) opc++;
      else if (frag.indexOf('{{end') == 0) clc++;

      if (clc > 0 && clc === opc) {
        clc = 0; opc = 0;
        return tpl.substr(pnt, i + 7);
        pnt = i + 7;
      }
    }
  }

  function _render(tpl, vl, scp) {
    const matches = tpl.match(keyReg);
    var t = [];

    for (m in matches) {
      var v = matches[m].substr(2, matches[m].length - 4);
      if (scp) v = v.replace(scp + '.', '', 'gm');
      if (vl.hasOwnProperty(v)) tpl = tpl.replace(matches[m],
        _treeVal(vl, v),
        'gm');
    }
    return tpl;
  }

  var _forLoop = function(tpl, vl) {
    var ly = _topLayer(tpl);
    var fnd;
    var reg = new RegExp(instructionReg);

    var ren = '';
    fnd = reg.exec(ly);
    if (!fnd) return tpl;

    switch(fnd[1]) {
      case 'for':
      case 'each':
        var co =  _treeVal(vl, fnd[2]);
        for (var c in co) {
          ren += _render(fnd[3], co[c] || {}, fnd[2]);
          if (instructionReg.test(ren)) ren = _forLoop(ren, co[c]);
        }
        tpl = tpl.replace(fnd[0], ren);
        break;
      case 'if':
        if (vl[fnd[2]]) {
          ren += fnd[3];
          if (instructionReg.test(ren)) ren = _forLoop(ren, vl);
          tpl = tpl.replace(fnd[0], ren);
        } else tpl = tpl.replace(fnd[0], '');
        break;
    }

    if (instructionReg.test(tpl)) tpl = _forLoop(tpl, vl);
    return tpl;
  }

  function _digest(tpl, vl) {
    var otpl = tpl.replace(/\s+/g, ' ').trim();
    otpl = _forLoop(otpl, vl);
    otpl = _render(otpl, vl);
    return otpl;
  }

  function _update(sel, vl, cb) {
    var t = $(sel).data('tmp');
    var d = $(sel).data('def');
    if (!t || !d) return;
    for(var k in d) if (!vl[k]) vl[k] = d[k];
    _load(sel, t, vl, cb);
  }

  function _load(sel, tpl, v) {
    const $sel = typeof sel === 'string' ? $(sel) : sel;
    const last = arguments[arguments.length - 1];
    const cb = (typeof last == 'function') ? last : false;
    if (cache[tpl]) _p(cache[tpl]);
    else $.get(tpl, function(t) {
      cache[tpl] = t
      _p(cache[tpl]);
    });

    function _p(t) {
      $sel.html(v ? _digest(t, v || {}) : t);
      $sel.data('tmp', tpl);
      $sel.data('def', v);
      if (cb) cb($sel);
    }
  }

  this.Load = _load;
  this.Render = _digest;
  this.Update = _update;
});
