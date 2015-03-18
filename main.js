function drawGrid(canvas, resolution) {
	var STROKE_WIDTH = 2;
	var STROKE_STYLE = "black";
	var TICK_LENGTH = 10;
	var height = canvas.height() - 20;
	var width = canvas.width() - 20;
	// Draw horizontal line.
	canvas.drawLine({
		strokeStyle : STROKE_STYLE,
		strokeWidth : STROKE_WIDTH,
		x1 : 0,
		y1 : height / 2,
		x2 : width,
		y2 : height / 2
	});
	// Draw vertical line.
	canvas.drawLine({
		strokeStyle : STROKE_STYLE,
		strokeWidth : STROKE_WIDTH,
		x1 : width / 2,
		y1 : 0,
		x2 : width / 2,
		y2 : height
	});
	// Draw tick marks
	for (var i = 0; i <= resolution; i++) {
		canvas.drawLine({
			strokeStyle : STROKE_STYLE,
			strokeWidth : STROKE_WIDTH,
			x1 : i * (width / resolution),
			y1 : height / 2 + TICK_LENGTH / 2,
			x2 : i * (width / resolution),
			y2 : height / 2 - TICK_LENGTH / 2
		});
	}
	for (var i = 0; i <= resolution; i++) {
		canvas.drawLine({
			strokeStyle : STROKE_STYLE,
			strokeWidth : STROKE_WIDTH,
			x1 : width / 2 + TICK_LENGTH / 2,
			y1 : i * (height / resolution),
			x2 : width / 2 - TICK_LENGTH / 2,
			y2 : i * (height / resolution)
		});
	}
}
function graph(canvas, eqn, minX, maxX, minY, maxY, resolution) {
	var STROKE_WIDTH = 2;
	var STROKE_STYLE = "black";
	var FILL_STYLE = "black";
	var OFFSET = 15;
	var FONT_SIZE = 8;
	var FONT_FAMILY = "Verdana, Geneva, sans-serif"
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
	drawGrid(jcanvas, RESOLUTION);
	$("#draw").click(function () {
		var maxX = parseInt($("#maxx").val());
		var maxY = parseInt($("#maxy").val());
		var eqn = math.compile($("#equation").val());
		var minX = parseInt($("#minx").val());
		var minY = parseInt($("#miny").val());
		graph(jcanvas, eqn, minX, maxX, minY, maxY, RESOLUTION);
	});
});
