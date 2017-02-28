SGE.NewModule('Support', new function() {
  var canvas = !! window.CanvasRenderingContext2D;
  var webgl = (function () {
    try {
      var canvas = document.createElement( 'canvas' );
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch ( e ) {

      return false;

    }
  })();
  var workers = !! window.Worker;
  var fileapi = !! (window.File && window.FileReader && window.FileList && window.Blob);
  var es6 = (function() {
    try {
      new Function("(a = 0) => a");
      return true;
    }
    catch (err) {
      return false;
    }
  })(); 

  this.__defineGetter__('canvas', function() { return canvas });
  this.__defineGetter__('webgl', function() { return webgl });
  this.__defineGetter__('workers', function() { return workers });
  this.__defineGetter__('fileapi', function() { return fileapi });
  this.__defineGetter__('es6', function() { return es6 });
});
