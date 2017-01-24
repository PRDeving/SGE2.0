SGE.NewModule('Images', new function() {
  _Preload = function(arr, callback) {
    var l = Object.keys(arr).length;
    var c = 0;
    var media = {};

    for (var k in arr) {
      media[k] = new Image();
      media[k].src = arr[k];
      media[k].onload = check();
    }

    function check() {
      c++;
      if (c == l) callback(media);
    }
  }
  this.Preload = _Preload;
});
