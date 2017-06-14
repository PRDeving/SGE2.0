SGE.NewModule('Template', new function() {
  const keyReg = /\{\{([^\\}]*(?:\\.[^\\}]*)*)\}\}/gm;
  // const forReg = /\{\{each (\w+)\}\}(.*?)\{\{end\}\}/gm
  const forReg = /\{\{each (\w+.*?)\}\}(.*?)\{\{end\}\}(?=[^}}]*$)/gm

  function _process(tpl, vl) {
    tpl = tpl.replace(/\s+/g, ' ').trim();
    tpl = _logic(tpl, vl);
    return _render(tpl, vl);
  }

  function _logic(tpl, vl) {
    const matches = tpl.match(forReg);
    var reg, f, fnd, l, ren;

    for (m in matches) {
      f = matches[m];
      reg = new RegExp(forReg);
      fnd = reg.exec(f);
      ren = '';
      var co =  _treeVal(vl, fnd[1]);
      for (var c in co) {
        ren += _render(fnd[2], co[c] || {}, fnd[1]);
      }
      if (forReg.test(ren)) ren = _logic(ren, co[c]);
      tpl = tpl.replace(f, ren);
    }
    return tpl;
  }

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

  function _render(tpl, vl, scp) {
    const matches = tpl.match(keyReg);
    var t = [];

    for (m in matches) {
      // if (t.indexOf(matches[m]) != -1) continue;
      // t.push(matches[m]);
      // var v = _treeVal(vl, matches[m].substr(2, matches[m].length - 4));
      var v = matches[m].substr(2, matches[m].length - 4);
      if (scp) v = v.replace(scp + '.', '', 'gm');
      if (vl.hasOwnProperty(v)) tpl = tpl.replace(matches[m],
        _treeVal(vl, v),
        'gm');
    }
    return tpl;
  }

  function _update(sel, vl, cb) {
    var t = $(sel).data('tmp');
    var d = $(sel).data('def');
    if (!t || !d) return;
    for(var k in d) if (!vl[k]) vl[k] = d[k];
    _load(sel, t, vl, cb);
  }
  
  function _load(sel, tpl, v) {
    const $f = $('<div>');
    const $sel = typeof sel === 'string' ? $(sel) : sel;
    const last = arguments[arguments.length - 1];
    const cb = (typeof last == 'function') ? last : false;
    $f.load(tpl, function() {
      $sel.html(v ? _process($f.html(), v || {}) : $f.html());
      $sel.data('tmp', tpl);
      $sel.data('def', v);
      if (cb) {
        cb($sel);
      }
    });
  }

  this.Load = _load;
  this.Render = _process;
  this.Update = _update;
  return this;
})
