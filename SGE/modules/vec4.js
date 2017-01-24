SGE.NewModule('vec4', function(_x,_y,_z,_w){
    this.x = _x;
    this.y = _y;
    this.z = _z;
    this.w = _w || 1;

    var _operate = function(type,l){
        switch(type){
            case "+":
                return new SGE.vec4(l.x + this.x, l.y + this.y, l.z + this.z);
                break;
            case "+=":
                this.x += l.x;
                this.y += l.y;
                this.z += l.z;
                break;
            case "-":
                return new SGE.vec4(this.x - l.x, this.y - l.y, this.z - l.z);
                break;
            case "-=":
                this.x -= l.x;
                this.y -= l.y;
                this.z -= l.z;
                break;
            case "*":
                return new SGE.vec4(l.x * this.x, l.y * this.y, l.z * this.z);
                break;
            case "*=":
                this.x *= l.x;
                this.y *= l.y;
                this.z *= l.z;
                break;
            case "/":
                return new SGE.vec4(this.x / l.x, this.y / l.y, this.z / l.z);
                break;
            case "/=":
                this.x /= l.x;
                this.y /= l.y;
                this.z /= l.z;
                break;
            case "==":
                return (l.x == this.x && l.y == this.y && l.z == this.z);
                break;
        }
    }

    this.operate = _operate;
});
