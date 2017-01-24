SGE.NewModule('Struct', new function(){
    var self = this;

    var vec2 = function(_x,_y){
        this.x = _x;
        this.y = _y;

        var _operate = function(type,l){
            switch(type){
                case "+":
                    return new self.vec2(l.x + this.x, l.y + this.y);
                break;
                case "+=":
                    this.x += l.x;
                    this.y += l.y;
                break;
                case "-":
                    return new self.vec2(this.x - l.x, this.y - l.y);
                break;
                case "-=":
                    this.x -= l.x;
                    this.y -= l.y;
                break;
                case "*":
                    return new self.vec2(l.x * this.x, l.y * this.y);
                break;
                case "*=":
                    this.x *= l.x;
                    this.y *= l.y;
                break;
                case "/":
                    return new self.vec2(this.x / l.x, this.y / l.y);
                break;
                case "/=":
                    this.x /= l.x;
                    this.y /= l.y;
                break;
                case "==":
                    return (l.x == this.x && l.y == this.y);
                break;
            }
        }

        this.operate = _operate;
    }

    var vec3 = function(_x,_y,_z){
        this.x = _x;
        this.y = _y;
        this.z = _z;

        var _operate = function(type,l){
            switch(type){
                case "+":
                    return new self.vec3(l.x + this.x, l.y + this.y, l.z + this.z);
                break;
                case "+=":
                    this.x += l.x;
                    this.y += l.y;
                    this.z += l.z;
                break;
                case "-":
                    return new self.vec3(this.x - l.x, this.y - l.y, this.z - l.z);
                break;
                case "-=":
                    this.x -= l.x;
                    this.y -= l.y;
                    this.z -= l.z;
                break;
                case "*":
                    return new self.vec3(l.x * this.x, l.y * this.y, l.z * this.z);
                break;
                case "*=":
                    this.x *= l.x;
                    this.y *= l.y;
                    this.z *= l.z;
                break;
                case "/":
                    return new self.vec3(this.x / l.x, this.y / l.y, this.z / l.z);
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
    }

    this.vec2 = vec2;
    this.vec3 = vec3;
});
