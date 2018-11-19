var screen_width, screen_height, page_width, page_height;
var incl_deg = 20;
var incl_shift;

function init() {
	screen_width = window.screen.width;
	screen_height = window.screen.height;
	page_width = document.documentElement.clientWidth;
	page_height = document.documentElement.clientHeight;
	
	var right = document.getElementById('right');
	var left = document.getElementById('left');
	var right_s = document.getElementById('right-s');
	var left_s = document.getElementById('left-s');
	var right_title = document.getElementById('right-title');
	var left_title = document.getElementById('left-title');

	// BEFORE CSS DECLARATION
	left.style.transition = '0s';

	incl_shift = page_height * Math.tan(Math.PI * incl_deg / 180);

	// 
	left.style.transform = "skew(-" + incl_deg + "deg, 0deg)";
	left.style.left = (-(page_height * Math.tan(Math.PI * incl_deg / 180))).toString() + "px";
	left.style.width = (page_width / 2 + (page_height * Math.tan(Math.PI * incl_deg / 180))).toString() + "px";

	left.addEventListener('mousemove', function(e){
		left.style.width = (page_width / 2 + (page_height * Math.tan(Math.PI * incl_deg / 180)) + page_width / 4).toString() + "px";

	});

	right.addEventListener('mousemove', function(e){
		left.style.width = (page_width / 2 + (page_height * Math.tan(Math.PI * incl_deg / 180)) - page_width / 4).toString() + "px";
	});

	// After all operations
	left.style.transition = '.5s';
}

init();