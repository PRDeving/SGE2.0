SGE.NewModule('CameraManager', {
  Camera2D: function(conf) {
    var c = new Object();
    var x = conf.x || 0;
    var y = conf.y || 0;
    var fov = conf.fov || 10;
    var minFov = conf.minFov || 10;
    var maxFov = conf.maxFov || 100;
    var speed = (conf.speed || 0.05) * fov;
    var topSpeed = speed * 3;
    var aceleration = speed / 2;
    var friction = conf.friction || speed / 3;

    c.moving = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

    c.update = function(delta) {
      var delta = delta || 1;
      var actualMoveSpeed = delta * speed;
      if ( this.moving.up) y -= actualMoveSpeed;
      if ( this.moving.down) y += actualMoveSpeed;
      if ( this.moving.left) x -= actualMoveSpeed;
      if ( this.moving.right) x += actualMoveSpeed;
    }

    c.setFov = function(v) {
      fov = v;
      if (fov < minFov) fov = minFov;
      if (fov > maxFov) fov = maxFov;
    }
    c.changeFov = v => {
      c.setFov(fov + v);
    };

    c.setPosition = function(x, y) {
      x = x;
      y = y;
    }
    c.move = function(x, y) {
      x += x;
      y += y
    }

    c.__defineGetter__('x', () => x);
    c.__defineGetter__('y', () => y);
    c.__defineGetter__('fov', () => fov);

    return c;
  }
});
