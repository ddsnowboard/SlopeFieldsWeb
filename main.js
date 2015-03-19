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
		fontFamily :
		FONT_FAMILY,
		fontSize : FONT_SIZE,
		text : text,
		x : x,
		y : y
	});
}
function drawGrid(canvas, minX, maxX, minY, maxY, resolution) {
	var TICK_LENGTH = 20;
	var height = canvas.height() - 20;
	var width = canvas.width() - 20;
	// The absolute origin point, in terms of the HTML canvas object. 
	var origin = {
		x : (Math.abs(minX) / (maxX - minX)) * width,
		y : (Math.abs(maxY) / (maxY - minY)) * height
	};
	var fieldCoords = {
		x : [],
		y : []
	};
	var graphCoords = {
		x : [],
		y : []
	};
	// Draw horizontal line.
	drawLine(canvas, 0, origin.y, width, origin.y);

	// Draw vertical line.
	drawLine(canvas, origin.x, 0, origin.x, height);
	// Draw tick marks
	var offsetX = Math.floor(((minX / (maxX - minX)) * resolution));
	for (var i = 0; i <= resolution; i++) {
		var currx = origin.x + ((i + offsetX) * (width / resolution));
		fieldCoords.x.push(currx);
		graphCoords.x.push( + ((currx - origin.x) * ((maxX - minX) / width)).toFixed(2));
		drawTick(canvas, currx, origin.y, TICK_LENGTH, VERTICAL);
	}
	var offsetY = Math.floor(((maxY / (minY - maxY)) * resolution));
	for (var i = 0; i <= resolution; i++) {
		var curry = origin.y + ((i + offsetY) * (height / resolution));
		fieldCoords.y.push(curry);
		graphCoords.y.push( + ((curry - origin.y) * ((minY - maxY) / height)).toFixed(2));
		drawTick(canvas, origin.x, curry, TICK_LENGTH, HORIZONTAL);
	}

	// Draw numbers
	var OFFSET = 20;
	for (var x = 0; x < fieldCoords.x.length; x++) {
		drawText(canvas, fieldCoords.x[x], origin.y - OFFSET, graphCoords.x[x]);
	}
	for (var y = 0; y < fieldCoords.y.length; y++) {
		if (graphCoords.y[y] !== 0) {
			drawText(canvas, origin.x + OFFSET, fieldCoords.y[y], graphCoords.y[y]);
		}
	}
}
function graph(canvas, eqn, minX, maxX, minY, maxY, resolution) {
	var STROKE_WIDTH = 2;
	var STROKE_STYLE = "black";
	var FILL_STYLE = "black";
	var OFFSET = 15;
	var FONT_SIZE = 8;
	var FONT_FAMILY = "Verdana, Geneva, sans-serif";
	var height = canvas.height() - 20;
	var width = canvas.width() - 20;
	for (var i = 0; i <= resolution; i++) {
		canvas.drawText({
			fillStyle : FILL_STYLE,
			strokeStyle : STROKE_STYLE,
			strokeWidth : STROKE_WIDTH,
			x : (height / 2) + OFFSET,
			y : i * (height / resolution),
			text : (maxY - i * ((maxY - minY) / resolution)).toString(),
			fontSize : FONT_SIZE,
			fontFamily : FONT_FAMILY
		});
	}
	for (var i = 0; i <= resolution; i++) {
		if (i !== 10) {
			console.log((minX + i * ((maxX - minX) / resolution)).toString());
			canvas.drawText({
				fillStyle : FILL_STYLE,
				strokeStyle : STROKE_STYLE,
				strokeWidth : STROKE_WIDTH,
				fontSize : FONT_SIZE,
				x : i * (width / resolution),
				y : (width / 2) - OFFSET,
				text : (minX + i * ((maxX - minX) / resolution)).toString(),
				fontFamily : FONT_FAMILY
			});
		}
	}
}

$(document).ready(function () {
	var RESOLUTION = 20;
	var jcanvas = $("#field");
	var canvas = document.getElementById("field");
	canvas.height = $(window).height() * 0.8;
	canvas.width = canvas.height;
	$("#draw").click(function () {
		jcanvas.clearCanvas();
		var maxX = parseInt($("#maxx").val());
		var maxY = parseInt($("#maxy").val());
		var eqn = math.compile($("#equation").val());
		var minX = parseInt($("#minx").val());
		var minY = parseInt($("#miny").val());
		drawGrid(jcanvas, minX, maxX, minY, maxY, RESOLUTION);
		// graph(jcanvas, eqn, minX, maxX, minY, maxY, RESOLUTION);
	});
});
