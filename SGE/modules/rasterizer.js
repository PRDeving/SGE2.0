SGE.NewModule('Rasterizer', new function(){
    var self = this;
    var ctx;
    var data;
    var _depthBuffer;

    var dbarray;
    var ready = false;

    this.isReady = function(){
        return ready;
    }

    this.setUp = function(gctx, gdepthBuffer){
        ctx = gctx;
        data = ctx.createImageData(ctx.canvas.width,ctx.canvas.height);
        _depthBuffer = gdepthBuffer;

        dbarray = new Float32Array((ctx.canvas.width * ctx.canvas.height) | 0).fill(_depthBuffer | 0);
        ready = true;
        console.log("SGE.Rasterizer ready");
        console.log("Drawing in backbuffer");
        console.log("Resolution of "+Math.sqrt(dbarray.length)+"x"+Math.sqrt(dbarray.length)+" pixels");
        console.log("DepthBuffer of "+_depthBuffer);
    }

    this.putPixel = function(p,color){
        var index = (((p.x >> 0) + (p.y >> 0) * (ctx.canvas.width >> 0)) * 4) | 0;
 
        if(dbarray[index] < p.z) return;
        dbarray[index] = p.z;

        data.data[index] = color.r |0;
        data.data[index+1] = color.g |0;
        data.data[index+2] = color.b |0;
        data.data[index+3] = color.a |0;
    }

    this.init = function(){
        dbarray.fill(_depthBuffer | 0);
        data.data.fill(0 |0);
    }

    this.present = function() {
        ctx.putImageData(data, 0, 0);
    }

    this.point = function(c,m){
        var p = m.by(c);
        return p;
    }
    this.drawPoint = function(point, color){
        if(point.x >= 0 && point.y >= 0 && point.x < ctx.canvas.width && point.y < ctx.canvas.height){
            self.putPixel(point,color);
        }
    }

    this.clamp = function (value, min, max) {
        if (typeof min === "undefined") { min = 0; }
        if (typeof max === "undefined") { max = 1; }
        return Math.max(min, Math.min(value, max));
    };

    this.interpolate = function (min, max, gradient) {
        return min + (max - min) * self.clamp(gradient);
    }

    this.processScanLine = function (y, pa, pb, pc, pd, color) {
        var gradient1 = pa.y != pb.y ? (y - pa.y) / (pb.y - pa.y) : 1;
        var gradient2 = pc.y != pd.y ? (y - pc.y) / (pd.y - pc.y) : 1;

        var sx = self.interpolate(pa.x, pb.x, gradient1) >> 0;
        var ex = self.interpolate(pc.x, pd.x, gradient2) >> 0;

        for(var x = sx-1; x <= ex; x++) {
            var avgz = (pa.z + pb.z + pc.z + pd.z)/4;
            self.drawPoint({x:x, y:y, z:avgz}, color);
        }
    };

    this.drawTriangle = function (p1, p2, p3, color, matrix) {
        p1 = matrix.by(p1);
        p2 = matrix.by(p2);
        p3 = matrix.by(p3);

        p1.x |= 0;
        p1.y |= 0;
        p2.x |= 0;
        p2.y |= 0;
        p3.x |= 0;
        p3.y |= 0;

        if(p1.y > p2.y) {
            var temp = p2;
            p2 = p1;
            p1 = temp;
        }
        if(p2.y > p3.y) {
            var temp = p2;
            p2 = p3;
            p3 = temp;
        }
        if(p1.y > p2.y) {
            var temp = p2;
            p2 = p1;
            p1 = temp;
        }

        var dP1P2; var dP1P3;

        if(p2.y - p1.y > 0) {
            dP1P2 = (p2.x - p1.x) / (p2.y - p1.y);
        } else {
            dP1P2 = 0;
        }

        if(p3.y - p1.y > 0) {
            dP1P3 = (p3.x - p1.x) / (p3.y - p1.y);
        } else {
            dP1P3 = 0;
        }


        // var U = p2.operate("-",p1);
        // var V = p3.operate("-",p1);
        // var N = U.operate("*",V);
        //
        // var SL = new SGE.vec4(45,45,45,1);
        // var inc = SL.operate("-",N);
        // var incr = (inc.x + inc.y + inc.z)/3;
        //
        // color.r += incr;
        // color.g += incr;
        // color.b += incr;
        // if(color.r < 0) color.r = 0;
        // if(color.g < 0) color.g = 0;
        // if(color.b < 0) color.b = 0;
        //
        // if(!window.aa)console.log(U,V,N, incr);
        // window.aa = true;

        if(dP1P2 >= dP1P3) {
            for(var y = p1.y >> 0; y <= p3.y >> 0; y++) {
                if(y < p2.y) {
                    self.processScanLine(y, p1, p3, p1, p2, color);
                } else {
                    self.processScanLine(y, p1, p3, p2, p3, color);
                }
            }
        } else {
            for(var y = p1.y >> 0; y <= p3.y >> 0; y++) {
                if(y < p2.y) {
                    self.processScanLine(y, p1, p2, p1, p3, color);
                } else {
                    self.processScanLine(y, p2, p3, p1, p3, color);
                }
            }
            window.con = true;
        }
    }
});
