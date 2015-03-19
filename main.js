function drawLine(canvas, x1, y1, x2, y2) {
	var STROKE_WIDTH = 2;
	var STROKE_STYLE = "black";
	canvas.drawLine({
		strokeStyle : STROKE_STYLE,
		strokeWidth : STROKE_WIDTH,
		x1 : x1,
		y1 : y1,
		x2 : x2,
		y2 : y2,
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
	// I NEED TO MAKE IT SO THAT IT STARTS ON THE LEFT EDGE, *ALWAYS* GOES THROUGH THE ORIGIN, AND THEN ENDS ON THE RIGHT SIDE. 
	// I'M NOT EXACTLY SURE HOW TO DO THAT... 
	for (var i = origin.x + minX * (width / (maxX - minX)); i <= origin.x + maxX * (width / (maxX - minX)); i += width / resolution) {
		// var currx = origin.x + (i * (width/(maxX - minX)));
		var currx = i;
		console.log(i === origin.x);
		drawLine(canvas, currx, origin.y - TICK_LENGTH, currx, origin.y + TICK_LENGTH);
	}
	// for (var i = 0; i <= resolution; i++) {
	// drawLine(canvas, origin.x-TICK_LENGTH,i* (height/resolution), origin.x+TICK_LENGTH, i*(height/resolution));
	// }
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
