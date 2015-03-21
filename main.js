// Constants for drawTick() `dir` parameter.
VERTICAL = 1;
HORIZONTAL = 0;
function drawLine(canvas, x1, y1, x2, y2) {
	var STROKE_WIDTH = 2;
	var STROKE_STYLE = "black";
	canvas.drawLine({
		strokeStyle : STROKE_STYLE,
		strokeWidth : STROKE_WIDTH,
		x1 : x1,
		y1 : y1,
		x2 : x2,
		y2 : y2
	});
}
function drawTick(canvas, x, y, len, dir) {
	var STROKE_WIDTH = 2;
	var STROKE_STYLE = "black";
	if (dir === VERTICAL) {
		canvas.drawLine({
			strokeStyle : STROKE_STYLE,
			strokeWidth : STROKE_WIDTH,
			x1 : x,
			y1 : y + 0.5 * len,
			x2 : x,
			y2 : y - 0.5 * len
		});
	} else if (dir === HORIZONTAL) {
		canvas.drawLine({
			strokeStyle : STROKE_STYLE,
			strokeWidth : STROKE_WIDTH,
			x1 : x + 0.5 * len,
			y1 : y,
			x2 : x - 0.5 * len,
			y2 : y
		});
	}
}
function drawText(canvas, x, y, text) {
	var STROKE_WIDTH = 2;
	var STROKE_STYLE = "black";
	var FILL_STYLE = "black";
	var FONT_SIZE = 8;
	var FONT_FAMILY = "Verdana, Geneva, sans-serif";
	canvas.drawText({
		fillStyle : FILL_STYLE,
		strokeStyle : STROKE_STYLE,
		strokeWidth : STROKE_WIDTH,
		fontFamily : FONT_FAMILY,
		fontSize : FONT_SIZE,
		text : text,
		x : x,
		y : y
	});
}
function drawGrid(canvas, minX, maxX, minY, maxY, resolution, eqn) {
	var TICK_LENGTH = 20;
	// I put a 20 pixel buffer on these just so I don't bump into the edge all the time.
	var height = canvas.height() - 20;
	var width = canvas.width() - 20;
	// This is the origin point, measured in on-screen pixels. If you put something at this point
	// with javascript, it will go to the cross in the axes.
	var origin = {
		x : (Math.abs(minX) / (maxX - minX)) * width,
		y : (Math.abs(maxY) / (maxY - minY)) * height
	};
	// These are the coordinates of tick marks (and later slopes) on the graph *in terms of on-screen pixels.*
	var fieldCoords = {
		x : [],
		y : []
	};
	// These map to fieldCoords, but they are in terms of the graph itself.
	var graphCoords = {
		x : [],
		y : []
	};
	// These draw the axes.
	drawLine(canvas, 0, origin.y, width, origin.y);
	drawLine(canvas, origin.x, 0, origin.x, height);
	// This is the amount of ticks that have to be before the origin point. It finds the proportion of the
	// graph that is before the origin, and multiplies it by the amount of ticks to get the amount of ticks
	// that have to be before the origin point.
	var offsetX = Math.floor(((minX / (maxX - minX)) * resolution));
	// This draws each tick mark and puts the coordinates into their appropriate array (cf. fieldCoords
	// and graphCoords).
	for (var i = 0; i <= resolution; i++) {
		var currx = origin.x + ((i + offsetX) * (width / resolution));
		fieldCoords.x.push(currx);
		// This strangeness rounds to two decimal places to take care of issues arising from floating
		// point inaccuracy. I wouldn't care, but these are getting printed, and I hate when that kind of
		// stuff comes up to the user.
		graphCoords.x.push( + ((currx - origin.x) * ((maxX - minX) / width)).toFixed(2));
		drawTick(canvas, currx, origin.y, TICK_LENGTH, VERTICAL);
	}
	// cf. above.
	// Some of the signs and orders are switched because the y coordinates on the HTML canvas start
	// at the top, at the highest y value on the graph, while the opposite is true of x.
	var offsetY = Math.floor(((maxY / (minY - maxY)) * resolution));
	for (var i = 0; i <= resolution; i++) {
		var curry = origin.y + ((i + offsetY) * (height / resolution));
		fieldCoords.y.push(curry);
		graphCoords.y.push( + ((curry - origin.y) * ((minY - maxY) / height)).toFixed(2));
		drawTick(canvas, origin.x, curry, TICK_LENGTH, HORIZONTAL);
	}
	// This `OFFSET` is not related to the above two. This is how far away from the line the text should be.
	var OFFSET = 20;

	// These four if statements check if it will plot the endpoints automatically, and if not, they do it, so that
	// you can have good confirmation that the x and y values you put in were reflected. Sometimes, in order to get a
	// tick mark at the origin at all times, there is not one at the edge, and this fixes that.
	if (graphCoords.x[0] !== minX) {
		drawLine(canvas, 0, origin.y - TICK_LENGTH / 2, 0, origin.y + TICK_LENGTH / 2);
		drawText(canvas, 0, origin.y - OFFSET, minX);
	}
	if (graphCoords.x[graphCoords.x.length - 1] !== maxX) {
		drawText(canvas, width, origin.y - OFFSET, maxX);
		drawLine(canvas, width, origin.y - TICK_LENGTH / 2, width, origin.y + TICK_LENGTH / 2);
	}
	if (graphCoords.y[0] !== maxY) {
		drawText(canvas, origin.x + OFFSET, 0, maxY);
		drawLine(canvas, origin.x - TICK_LENGTH / 2, 0, origin.x + TICK_LENGTH / 2, 0);
	}
	if (graphCoords.y[graphCoords
			.length - 1] !== minY) {
		drawText(canvas, origin.x + OFFSET, height, minY);
		drawLine(canvas, origin.x - TICK_LENGTH / 2, height, origin.x + TICK_LENGTH / 2, height);
	}
	// This draws the rest of the text.
	for (var x = 0; x < fieldCoords.x.length; x++) {
		drawText(canvas, fieldCoords.x[x], origin.y - OFFSET, graphCoords.x[x]);
	}
	for (var y = 0; y < fieldCoords.y.length; y++) {
		if (graphCoords.y[y] !== 0) {
			drawText(canvas, origin.x + OFFSET, fieldCoords.y[y], graphCoords.y[y]);
		}
	}
	// I have different constants for the slope lines because I wanted to bug Jay by making them green and I didn't know
	// if the numbers I had would be too big or small.
	var SLOPE_STROKE_STYLE = "#0f0";
	var SLOPE_STROKE_WIDTH = 2;
	// These nested for loops draw the slopes. There are two `drawVector()`s to draw both halves. I need to have
	// it be the right length, but also be centered at the right spot, so it draws the first half, and then the
	// other half from the same point.
	for (var i = 0; i < fieldCoords.x.length; i++) {
		var x = graphCoords.x[i];
		var xCoord = fieldCoords.x[i];
		for (var j = 0; j < fieldCoords.y.length; j++) {
			var y = graphCoords.y[j];
			var yCoord = fieldCoords.y[j];
			var values = {
				p : Math.PI,
				e : Math.E,
				x : x,
				y : y,
				xy : x * y
			}
			canvas.drawVector({
				strokeWidth : SLOPE_STROKE_WIDTH,
				strokeStyle : SLOPE_STROKE_STYLE,
				x : xCoord,
				y : yCoord,
				a1 : 90 - (Math.atan(eqn.eval(values)) * (180 / Math.PI)),
				l1 : TICK_LENGTH / 2
			});
			canvas.drawVector({
				strokeWidth : SLOPE_STROKE_WIDTH,
				strokeStyle : SLOPE_STROKE_STYLE,
				x : xCoord,
				y : yCoord,
				a1 : 90 - (Math.atan(eqn.eval(values)) * (180 / Math.PI)),
				l1 : -1 * TICK_LENGTH / 2
			});
		}
	}
}
$(document).ready(function () {
	// This constant is the amount of total ticks on each axis. It can be increased by two at times, if
	// the endpoints aren't naturally drawn. See above.
	var RESOLUTION = 20;
	// This is the jquery/jcanvas wrapped canvas, which is used for everything except
	// setting the height and width because it's almost impossible to do with jquery
	// or jcanvas to my knowledge.
	var jcanvas = $("#field");
	var canvas = document.getElementById("field");
	canvas.height = $(window).height() * 0.8;
	canvas.width = $(window).width() * 0.5;
	// These draw default lines. They get erased as soon as you click draw, but they make it clear what's going
	// on at first glance, so I have them here.
	drawLine(jcanvas, 0, canvas.height / 2 - 10, canvas.width - 20, canvas.height / 2 - 10);
	drawLine(jcanvas, canvas.width / 2 - 10, 0, canvas.width / 2 - 10, canvas.height - 20);
	$("#draw").click(function () {
		jcanvas.clearCanvas();
		var maxX = parseInt($("#maxx").val());
		var maxY = parseInt($("#maxy").val());
		if(RegExp.match($("#equation").val(), /[A-Za-z]{2}/)){
		console.log("worked");}
		var eqn = math.compile($("#equation").val());
		var minX = parseInt($("#minx").val());
		var minY = parseInt($("#miny").val());
		drawGrid(jcanvas, minX, maxX, minY, maxY, RESOLUTION, eqn);
	});
	$(document).keydown(function (event) {
		if (event.which === 13) {
			$("#draw").click();
		}
	});
});
