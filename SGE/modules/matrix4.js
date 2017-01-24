SGE.Matrix4 = function (data) {
	if (data.length != 16) return false;

	for (var i = 0; i < 16; i++)
		this[i] = data[i];
};

SGE.Matrix4.prototype = {
	clone: function () {
		return new SGE.Matrix4([
			this[0], this[1], this[2], this[3],
			this[4], this[5], this[6], this[7],
			this[8], this[9], this[10], this[11],
			this[12], this[13], this[14], this[15]
		]);
	},

	get: function (i, j) {
		return this[j * 4 + i];
	},

	put: function (i, j, value) {
		this[j * 4 + i] = value;
		return this;
	},

	transpose: function () {
		var newArray = [
			this[0], this[4], this[8], this[12],
			this[1], this[5], this[9], this[13],
			this[2], this[6], this[10], this[14],
			this[3], this[7], this[11], this[15]
		];
		for (var i = 0; i < 16; i++) {
			this[i] = newArray[i];
		}
		return this;
	},

	getTransposed: function () {
		return new SGE.Matrix4([
			this[0], this[4], this[8], this[12],
			this[1], this[5], this[9], this[13],
			this[2], this[6], this[10], this[14],
			this[3], this[7], this[11], this[15]
		]);
	},

	add: function (m) {
		for (var i = 0; i < 16; i++) {
			this[i] += m[i];
		}
		return this;
	},

	plus: function (m) {
		var newArray = [];
		for (var i = 0; i < 16; i++) {
			newArray.push(this[i] + m[i]);
		}
		return new SGE.Matrix4(newArray);
	},

	subtract: function (m) {
		for (var i = 0; i < 16; i++) {
			this[i] -= m[i];
		}
		return this;
	},

	minus: function (m) {
		var newArray = [];
		for (var i = 0; i < 16; i++) {
			newArray.push(this[i] - m[i]);
		}
		return new SGE.Matrix4(newArray);
	},

	multiply: function (x) {
		var i;
		if (x instanceof SGE.Matrix4) {
			var newArray = [
				this[0] * x[0] + this[4] * x[1] + this[8] * x[2] + this[12] * x[3],
				this[1] * x[0] + this[5] * x[1] + this[9] * x[2] + this[13] * x[3],
				this[2] * x[0] + this[6] * x[1] + this[10] * x[2] + this[14] * x[3],
				this[3] * x[0] + this[7] * x[1] + this[11] * x[2] + this[15] * x[3],
				this[0] * x[4] + this[4] * x[5] + this[8] * x[6] + this[12] * x[7],
				this[1] * x[4] + this[5] * x[5] + this[9] * x[6] + this[13] * x[7],
				this[2] * x[4] + this[6] * x[5] + this[10] * x[6] + this[14] * x[7],
				this[3] * x[4] + this[7] * x[5] + this[11] * x[6] + this[15] * x[7],
				this[0] * x[8] + this[4] * x[9] + this[8] * x[10] + this[12] * x[11],
				this[1] * x[8] + this[5] * x[9] + this[9] * x[10] + this[13] * x[11],
				this[2] * x[8] + this[6] * x[9] + this[10] * x[10] + this[14] * x[11],
				this[3] * x[8] + this[7] * x[9] + this[11] * x[10] + this[15] * x[11],
				this[0] * x[12] + this[4] * x[13] + this[8] * x[14] + this[12] * x[15],
				this[1] * x[12] + this[5] * x[13] + this[9] * x[14] + this[13] * x[15],
				this[2] * x[12] + this[6] * x[13] + this[10] * x[14] + this[14] * x[15],
				this[3] * x[12] + this[7] * x[13] + this[11] * x[14] + this[15] * x[15]
			];
			for (i = 0; i < 16; i++) {
				this[i] = newArray[i];
			}
		} else {
			for (i = 0; i < 16; i++) {
				this[i] *= x;
			}
		}
		return this;
	},

	by: function (x) {
		if (x instanceof SGE.Matrix4) {
			return new SGE.Matrix4([
				this[0] * x[0] + this[4] * x[1] + this[8] * x[2] + this[12] * x[3],
				this[1] * x[0] + this[5] * x[1] + this[9] * x[2] + this[13] * x[3],
				this[2] * x[0] + this[6] * x[1] + this[10] * x[2] + this[14] * x[3],
				this[3] * x[0] + this[7] * x[1] + this[11] * x[2] + this[15] * x[3],
				this[0] * x[4] + this[4] * x[5] + this[8] * x[6] + this[12] * x[7],
				this[1] * x[4] + this[5] * x[5] + this[9] * x[6] + this[13] * x[7],
				this[2] * x[4] + this[6] * x[5] + this[10] * x[6] + this[14] * x[7],
				this[3] * x[4] + this[7] * x[5] + this[11] * x[6] + this[15] * x[7],
				this[0] * x[8] + this[4] * x[9] + this[8] * x[10] + this[12] * x[11],
				this[1] * x[8] + this[5] * x[9] + this[9] * x[10] + this[13] * x[11],
				this[2] * x[8] + this[6] * x[9] + this[10] * x[10] + this[14] * x[11],
				this[3] * x[8] + this[7] * x[9] + this[11] * x[10] + this[15] * x[11],
				this[0] * x[12] + this[4] * x[13] + this[8] * x[14] + this[12] * x[15],
				this[1] * x[12] + this[5] * x[13] + this[9] * x[14] + this[13] * x[15],
				this[2] * x[12] + this[6] * x[13] + this[10] * x[14] + this[14] * x[15],
				this[3] * x[12] + this[7] * x[13] + this[11] * x[14] + this[15] * x[15]
			]);
		} else if (x instanceof SGE.vec4) {
			return new SGE.vec4(
				this[0] * x.x + this[4] * x.y + this[8] * x.z + this[12] * x.w,
				this[1] * x.x + this[5] * x.y + this[9] * x.z + this[13] * x.w,
				this[2] * x.x + this[6] * x.y + this[10] * x.z + this[14] * x.w,
				this[3] * x.x + this[7] * x.y + this[11] * x.z + this[15] * x.w
				);
		} else {
			var newArray = [];
			for (var i = 0; i < 16; i++) {
				newArray.push(this[i] * x);
			}
			return new SGE.Matrix4(newArray);
		}
	}
};

SGE.Matrix4.NULL = new SGE.Matrix4([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
SGE.Matrix4.IDENTITY = new SGE.Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);



SGE.Matrix4.TranslationMatrix = function (x, y, z) {
	return new SGE.Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
};

SGE.Matrix4.RotationMatrixOver = function (x, y, z, a) {
	var s = Math.sin(a);
	var c = Math.cos(a);
	return new SGE.Matrix4([
		x * x * (1 - c) + c,
		x * y * (1 - c) + z * s,
		x * z * (1 - c) - y * s,
		0,
		y * x * (1 - c) - z * s,
		y * y * (1 - c) + c,
		y * z * (1 - c) + x * s,
		0,
		z * x * (1 - c) + y * s,
		z * y * (1 - c) - x * s,
		z * z * (1 - c) + c,
		0,
		0,
		0,
		0,
		1
	]);
};

SGE.Matrix4.RotationMatrix = function (angles) {
    var matrix = SGE.Matrix4.IDENTITY
                .by(SGE.Matrix4.XRotationMatrix(angles.x * Math.PI / 180))
                .by(SGE.Matrix4.YRotationMatrix(angles.y * Math.PI / 180))
                .by(SGE.Matrix4.ZRotationMatrix(angles.z * Math.PI / 180));
    return matrix;

}

SGE.Matrix4.XRotationMatrix = function (angle) {
	var s = Math.sin(angle);
	var c = Math.cos(angle);
	return new SGE.Matrix4([
		1, 0, 0, 0,
		0, c, s, 0,
		0, -s, c, 0,
		0, 0, 0, 1
	]);
};

SGE.Matrix4.YRotationMatrix = function (angle) {
	var s = Math.sin(angle);
	var c = Math.cos(angle);
	return new SGE.Matrix4([
		c, 0, -s, 0,
		0, 1, 0, 0,
		s, 0, c, 0,
		0, 0, 0, 1
	]);
};

SGE.Matrix4.ZRotationMatrix = function (angle) {
	var s = Math.sin(angle);
	var c = Math.cos(angle);
	return new SGE.Matrix4([
		c, s, 0, 0,
		-s, c, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	]);
};

SGE.Matrix4.ScalingMatrix = function (x, y, z) {
	return new SGE.Matrix4([x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]);
};


SGE.Matrix4.OrthogonalProjection = function (screenRatio) {
	if (arguments.length < 1) {
		screenRatio = 1;
	}
	return new SGE.Matrix4([1, 0, 0, 0, 0, screenRatio, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
};

SGE.Matrix4.PerspectiveProjection = function (screenRatio, focus) {
	if (arguments.length < 2) {
		focus = Math.PI / 2;
		if (arguments.length < 1) {
			screenRatio = 1;
		}
	}
	var h = Math.cos(focus / 2);
	return new SGE.Matrix4([h, 0, 0, 0, 0, h * screenRatio, 0, 0, 0, 0, 0, 1, 0, 0, 1, h]);
};
