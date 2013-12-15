Blind.Segment = function(dict) {
	this.box = dict.box;
	this.type = dict.type;
	this.x0 = dict.x0;
	this.y0 = dict.y0;
	this.x1 = dict.x1;
	this.y1 = dict.y1;
	this.distSq0 = this.x0*this.x0 + this.y0*this.y0;
	this.distSq1 = this.x1*this.x1 + this.y1*this.y1;
	this.angle0 = Math.atan2(this.y0, this.x0);
	this.angle1 = Math.atan2(this.y1, this.x1);
};

Blind.Segment.prototype = {
	getDistAtAngle: function(angle) {
		if (this.type == 'v') {
			return this.x0 / Math.cos(angle);
		}
		else {
			return this.y0 / Math.sin(angle);
		}
	},
};

Blind.Quadrant = function(segs) {
	this.segs = segs;
	
	// create sorted corner list
};

Blind.Quadrant.prototype = {
};

Blind.projector = function(cx,cy, boxes) {
	var TOPRIGHT=0, TOPLEFT=1, BOTTOMLEFT=2, BOTTOMRIGHT=3;

	function getQuadrants() {
		var quadrants = [[],[],[],[]];
		function processVSeg(box,x,y0,y1) {
			var seg = new Blind.Segment({
				box: box,
				x0: x, y0: y0,
				x1: x, y1: y1,
				type: 'v',
			});
			if (y1 <= 0) {
				quadrants[x<0 ? TOPLEFT : TOPRIGHT].push(seg);
			}
			else if (y0 >= 0) {
				quadrants[x<0 ? BOTTOMLEFT : BOTTOMRIGHT].push(seg);
			}
			else {
				processVSeg(box, x,y0,0);
				processVSeg(box, x,0,y1);
			}
		}
		function processHSeg(box,y,x0,x1) {
			var seg = new Blind.Segment({
				box: box,
				x0: x0, y0: y,
				x1: x1, y1: y,
				type: 'h',
			});
			if (x1 <= 0) {
				quadrants[y<0 ? TOPLEFT : BOTTOMLEFT].push(seg);
			}
			else if (x0 >= 0) {
				quadrants[y<0 ? TOPRIGHT : BOTTOMRIGHT].push(seg);
			}
			else {
				processHSeg(box, y,x0,0);
				processHSeg(box, y,0,x1);
			}
		}
		function processBox(box) {
			var x = box.x-cx;
			var y = box.y-cy;
			var w = box.w;
			var h = box.h;

			// left
			if (x > 0) {
				processVSeg(box, x, y, y+h);
			}

			// right
			if (x+w < 0) {
				processVSeg(box, x+w, y, y+h);
			}

			// top
			if (y > 0) {
				processHSeg(box, y, x, x+w);
			}

			// bottom
			if (y+h < 0) {
				processHSeg(box, y+h, x, x+w);
			}
		}

		var i,len=boxes.length;
		for (i=0; i<len; i++) {
			processBox(boxes[i]);
		}
		return quadrants;
	}
	quadrants = getQuadrants();

	return {
		quadrants: quadrants,
	};
};
