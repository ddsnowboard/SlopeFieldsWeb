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
function drawGrid(canvas, minX, maxX, minY, maxY, resolution) {
	var TICK_LENGTH = 10;
	var height = canvas.height() - 20;
	var width = canvas.width() - 20;
	var origin = {
		x : (Math.abs(minX) / (maxX - minX)) * width,
		y : (Math.abs(maxY) / (maxY - minY)) * height
	};
	// Draw horizontal line.
	drawLine(canvas, 0, origin.y, width, origin.y);

	// Draw vertical line.
	drawLine(canvas, origin.x, 0, origin.x, height);

	// Draw tick marks
	// for (var i = origin.x + minX * (width / (maxX - minX)); i <= origin.x + maxX * (width / (maxX - minX)); i += width / (maxX - minX)) {
		// drawLine(canvas, i, origin.y - TICK_LENGTH, i, origin.y + TICK_LENGTH);
	// }
	for (var i = origin.y + maxY * (height / (maxY - minY)); i <= origin.y + minY * (height / (maxY - minY)); i += height / (maxY - minY)) {
		console.log(i);
		drawLine(canvas, origin.x - TICK_LENGTH, i, origin.x + TICK_LENGTH, i);
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
