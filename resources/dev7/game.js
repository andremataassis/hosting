var WIDTH = 25;
var HEIGHT = 25;

const GHOST = 0x1F47B;
const WALL_COLOR = PS.COLOR_GRAY_DARK;

/*
game.js for Perlenspiel 3.3.x
Last revision: 2022-03-15 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-22 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these two lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT remove this directive!

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function checkBounds(x = 0, y = 0){
	return x < WIDTH && x >= 0 && y < HEIGHT && y >= 0;
}

//Returns points that were drawn on
function drawSquare(x, y, length, color, borderColor = color) {
	let mod = Math.floor(length / 2)
	let return_array = [];
	for(let i = x - mod; i <= x + mod; i++){
		for (let j = y - mod; j <= y + mod; j++){
			if(checkBounds(i, j)) {
				PS.color(i, j, color);
				PS.borderColor(i, j, borderColor);
				return_array.push({x: i, y: j});
			}
		}
	}

	return return_array;
}

//Returns points that were drawn on
function drawLine(from, to, color, borderColor){
	//Clamp all values before finding line array
	from.x = clamp(from.x, 0, WIDTH);
	from.y = clamp(from.y, 0, HEIGHT);
	to.x = clamp(to.x, 0, WIDTH);
	to.y = clamp(to.y, 0, HEIGHT);

	//Find line array and draw line
	line_array = PS.line(from.x, from.y, to.x, to.y);

	let return_array = [];

	for(let i = 0; i < line_array.length; i++){
		let x = line_array[i][0];
		let y = line_array[i][1];
		if(checkBounds(x, y)) {
			PS.color(x, y, color);
			PS.borderColor(x, y, borderColor);
			return_array.push({x: x, y: y});
		}
	}

	return return_array;
}

//Doesn't actually do what it seems like it does since I wanted only odd numbers for the radius,
//so that the mouse is in the center of the circle
//Supports diameter == 1 - 7 (also clamps to this range)
//Retruns beads that were drawn on
function drawCircle(x, y, diameter, color, borderColor = color){
	diameter = clamp(diameter, 1, 7);
	let return_array = [];
	//First, draw a square
	
	var squareLength;

	//1 x 1
	if(diameter <= 3){
		squareLength = 1;
	}
	//3 x 3
	else if(diameter <= 6){
		squareLength = 3;
	}
	//5 x 5
	else{
		squareLength = 5;
	}
	
	return_array.push(...drawSquare(x, y, squareLength, color, borderColor = color));

	if(diameter == 1 || diameter == 4);
	else if(diameter == 6){
		let mod = Math.floor(squareLength / 2)
		//top
		return_array.push(...drawLine({x: (x - mod - 1), y: (y - mod - 1)},
		{x: (x + mod), y: (y - mod - 1)}, color, borderColor));
		//bottom
		return_array.push(...drawLine({x: (x - mod - 1), y: (y + mod + 1)},
		{x: (x + mod), y: (y + mod + 1)}, color, borderColor));
		//left 
		return_array.push(...drawLine({x: x - mod - 1, y: y - mod - 1},
		{x: x - mod - 1, y: y + mod}, color, borderColor));
		//right
		return_array.push(...drawLine({x: x + mod + 1, y: y - mod - 1},
		{x: x + mod + 1, y: y + mod}, color, borderColor));
	}
	else if(diameter == 2 || diameter == 3){
		if (checkBounds(x + 1, y)){ 
			PS.color(x + 1, y, color);
			PS.borderColor(x + 1, y, borderColor);
			return_array.push({x : x + 1, y: y});
		}
		if (checkBounds(x - 1, y)) {
			PS.color(x - 1, y, color);
			PS.borderColor(x - 1, y, borderColor);
			return_array.push({x: x - 1, y: y});
		}
		if (checkBounds(x, y + 1)) {
			PS.color(x, y + 1, color);
			PS.borderColor(x, y + 1, borderColor);
			return_array.push({x: x, y: y + 1});
		}
		if (checkBounds(x, y - 1)) {
			PS.color(x, y - 1, color);
			PS.borderColor(x, y - 1, borderColor);
			return_array.push({x: x, y: y - 1});
		}
	}
	else{
		let mod = Math.floor(squareLength / 2)
		//top
		return_array.push(...drawLine({x: (x - mod), y: (y - mod - 1)},
		{x: (x + mod - 1), y: (y - mod - 1)}, color, borderColor));
		//bottom
		return_array.push(...drawLine({x: (x - mod), y: (y + mod + 1)},
		{x: (x + mod - 1), y: (y + mod + 1)}, color, borderColor));
		//left 
		return_array.push(...drawLine({x: x - mod - 1, y: y - mod},
		{x: x - mod - 1, y: y + mod - 1}, color, borderColor));
		//right
		return_array.push(...drawLine({x: x + mod + 1, y: y - mod},
		{x: x + mod + 1, y: y + mod - 1}, color, borderColor));
	}

	return return_array;
}

function masterTick(){
	FLASHLIGHT.lightTick();
	GHOST_SPAWNER.ghostTick();
	WALL_SPAWNER.wallTick();
}

var FLASHLIGHT = {
	light_diameter : 10,
	light_mod: 90,
	last: null,
	all_on: false,
	lightUp: function(x, y){
		if(FLASHLIGHT.all_on) return;
		FLASHLIGHT.lightOffLast();

		let beads = drawCircle(x, y, FLASHLIGHT.light_diameter, PS.COLOR_GRAY_LIGHT);
		FLASHLIGHT.updateBeadData(beads, "Lit");
		FLASHLIGHT.last = {x: x, y: y, d: FLASHLIGHT.light_diameter};
	},
	lightOffLast: function(){
		if(!(FLASHLIGHT.last)) return;
		let beads = drawCircle(FLASHLIGHT.last.x, FLASHLIGHT.last.y, FLASHLIGHT.last.d, PS.COLOR_BLACK);
		FLASHLIGHT.updateBeadData(beads, PS.DEFAULT);
	},
	updateBeadData: function(beads, newData){
		for(const bead of beads){
			PS.data(bead.x, bead.y, newData);
		}
	},
	lightUpAll: function(){
		let beads = drawSquare(Math.floor(WIDTH/2), Math.floor(HEIGHT/2), WIDTH, PS.COLOR_GRAY_LIGHT);
		FLASHLIGHT.updateBeadData(beads, "Lit");

		FLASHLIGHT.all_on = true;
	},
	lightOffAll: function(){
		let beads = drawSquare(Math.floor(WIDTH/2), Math.floor(HEIGHT/2), WIDTH, PS.COLOR_BLACK);
		FLASHLIGHT.updateBeadData(beads, PS.DEFAULT);

		FLASHLIGHT.all_on = false;
	},
	lightTick: function(){
		FLASHLIGHT.light_mod -= 0.08;
		FLASHLIGHT.light_mod = clamp(FLASHLIGHT.light_mod, 0, 90);
		
		let start = FLASHLIGHT.light_diameter;
		
		FLASHLIGHT.light_diameter = Math.floor(FLASHLIGHT.light_mod / 10);

		if(start != FLASHLIGHT.light_diameter && FLASHLIGHT.light_diameter < 7) {
			PS.audioPlay("fx_bloink", {volume: 0.05});
			if(FLASHLIGHT.last) FLASHLIGHT.lightUp(FLASHLIGHT.last.x, FLASHLIGHT.last.y)
		}
	},
	charge:function(){
		FLASHLIGHT.light_mod += 0.3;
		FLASHLIGHT.light_mod = clamp(FLASHLIGHT.light_mod, 0, 90);

		let start = FLASHLIGHT.light_diameter;

		FLASHLIGHT.light_diameter = Math.floor(FLASHLIGHT.light_mod / 10);

		if(start !== FLASHLIGHT.light_diameter && FLASHLIGHT.light_diameter !== 9) {
			FLASHLIGHT.light_mod += 5;
			PS.audioPlay("fx_blip");
			if(FLASHLIGHT.last) FLASHLIGHT.lightUp(FLASHLIGHT.last.x, FLASHLIGHT.last.y)
		}
	}
}

var GHOST_SPAWNER = {
	ghosts: [],
	counter: 0,
	cooldown: 50,
	placeGhost: function(x, y){
		GHOST_SPAWNER.ghosts.push({x: x, y: y});
	},
	isGhost: function(x, y){
		for(const ghost of GHOST_SPAWNER.ghosts){
			if(ghost.x == x && ghost.y == y){
				return true;
			}
		}
		return false;
	},
	removeGhost: function(x, y){
		for(let i = 0; i < GHOST_SPAWNER.ghosts.length; i++){
			ghost = GHOST_SPAWNER.ghosts[i];
			if(ghost.x == x && ghost.y == y){
				PS.glyph(x, y, PS.DEFAULT);
				GHOST_SPAWNER.ghosts.splice(i, 1);
				playRandomGhostSound();
				return;
			}
		}
	},
	ghostTick: function(){
		//Show lit ghosts
		for(const ghost of GHOST_SPAWNER.ghosts){
			if(PS.data(ghost.x, ghost.y) === "Lit"){
				PS.glyph(ghost.x, ghost.y, GHOST);
			}
			else{
				PS.glyph(ghost.x, ghost.y, PS.DEFAULT);
			}
		}

		GHOST_SPAWNER.counter++;
		GHOST_SPAWNER.spawnGhosts();
	},
	spawnGhosts: function(){
		if(GHOST_SPAWNER.counter < GHOST_SPAWNER.cooldown) return;
		
		let x = PS.random(WIDTH - 2);
		let y = PS.random(HEIGHT - 2);
		while(WALL_SPAWNER.isWall(x, y)){
			x = PS.random(WIDTH - 2);
			y = PS.random(HEIGHT - 2);
		}
		GHOST_SPAWNER.placeGhost(x, y);
		GHOST_SPAWNER.counter = 0;
	}
}

var WALL_SPAWNER = {
	walls: [],
	placeWall: function(x, y){
		WALL_SPAWNER.walls.push({x: x, y: y});
	},
	isWall: function(x, y){
		for(const wall of WALL_SPAWNER.walls){
			if(wall.x == x && wall.y == y){
				return true;
			}
		}
		return false;
	},
	wallTick: function(){
		//Show lit walls
		for(const wall of WALL_SPAWNER.walls){
			if(PS.data(wall.x, wall.y) === "Lit"){
				PS.color(wall.x, wall.y, WALL_COLOR);
				PS.borderColor(wall.x, wall.y, WALL_COLOR);
			}
			else{
				PS.color(wall.x, wall.y, PS.COLOR_BLACK);
				PS.borderColor(wall.x, wall.y, PS.COLOR_BLACK);
			}
		}
	},
	generateLayout: function(){
		for(const wall of WALL_SPAWNER.walls){
			PS.color(wall.x, wall.y, PS.COLOR_GRAY_LIGHT);
			PS.borderColor(wall.x, wall.y, PS.COLOR_GRAY_LIGHT);
		}
		WALL_SPAWNER.walls = [];
		WALL_SPAWNER.roomRecursion({x: 0, y: 0}, {x: WIDTH - 1, y: HEIGHT - 1}, "X")
	},
	roomRecursion: function(topLeft, botRight, split){
		let MIN_SIZE = 6;
		
		let width = Math.abs(botRight.x - topLeft.x);
		let height = Math.abs(botRight.y - topLeft.y);

		//Done if <= whatever number
		if (width <= MIN_SIZE || height <= MIN_SIZE) {
			let shortenVert = height <= 3;
			let shortenHorz = width <= 3;

			// Draw the box
			for (let x = topLeft.x; x <= botRight.x; x++) {
				if(!shortenVert || topLeft.y == 0) WALL_SPAWNER.placeWall(x, topLeft.y);
				if(botRight.y == HEIGHT - 1) WALL_SPAWNER.placeWall(x, botRight.y);
			}
			for (let y = topLeft.y; y <= botRight.y; y++) {
				if(!shortenHorz || topLeft.x == 0) WALL_SPAWNER.placeWall(topLeft.x, y);
				if(botRight.x == WIDTH - 1) WALL_SPAWNER.placeWall(botRight.x, y);
			}
			return 1;
		}

		if(split === "X"){
			let minSplit = topLeft.x + MIN_SIZE;
        	let maxSplit = botRight.x - MIN_SIZE;
			
			let x_split = Math.floor(Math.random() * (maxSplit - minSplit + 1)) + minSplit;
			let newTopLeft = {x: x_split + 1, y: topLeft.y};
			let newBotRight = {x: x_split, y: botRight.y};
			return WALL_SPAWNER.roomRecursion(topLeft, newBotRight, "Y") + WALL_SPAWNER.roomRecursion(newTopLeft, botRight, "Y");
		}
		else if(split === "Y"){
			let minSplit = topLeft.y + MIN_SIZE;
        	let maxSplit = botRight.y - MIN_SIZE;

			let y_split = Math.floor(Math.random() * (maxSplit - minSplit + 1)) + minSplit;
			let newBotRight = { x: botRight.x, y: y_split };
			let newTopLeft  = { x: topLeft.x,  y: y_split + 1 };
			return WALL_SPAWNER.roomRecursion(topLeft, newBotRight, "X") + 
				WALL_SPAWNER.roomRecursion(newTopLeft, botRight, "X");
		}
	}
}

var last_i = 1;
function playRandomGhostSound(){
	if(last_i > 3) last_i = 1;
	PS.audioPlay("ghostdeath-0" + last_i++, {path: "./audio/", fileTypes: ["wav"]});
}

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

var g_image;
function getImage(image){
	g_image = image;
}

PS.init = function( system, options ) {
	// Uncomment the following code line
	// to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin
	// with a call to PS.gridSize( x, y )
	// where x and y are the desired initial
	// dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the
	// default dimensions (8 x 8).
	// Uncomment the following code line and change
	// the x and y parameters as needed.

	PS.gridSize(WIDTH, HEIGHT);
	PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.gridColor(PS.COLOR_BLACK);
	PS.statusColor(PS.COLOR_WHITE);

	PS.fade(PS.ALL, PS.ALL, 5);
	PS.borderFade(PS.ALL, PS.ALL, 5);

	PS.timerStart(2, masterTick);

	WALL_SPAWNER.generateLayout();
	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	// PS.statusText( "Game" );

	// Add any other initialization code you need here.
};

/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.

	if(GHOST_SPAWNER.isGhost(x, y)){
		GHOST_SPAWNER.removeGhost(x, y);
	}
};

/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.

	FLASHLIGHT.lightUp(x, y);
	if(GHOST_SPAWNER.isGhost(x, y)){
		PS.borderColor(x, y, PS.COLOR_RED);
	}
};

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = function( key, shift, ctrl, options ) {
	// Add code here for when a key is pressed.

	//Turn lights on/off (for debugging)
	if(key == PS.KEY_SPACE && shift == true){
		FLASHLIGHT.all_on ? FLASHLIGHT.lightOffAll() : FLASHLIGHT.lightUpAll();
	}
	if(key == PS.KEY_ENTER){
		WALL_SPAWNER.generateLayout();
	}
};

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

	var device = sensors.wheel; // check for scroll wheel

	if ( device ) {
		FLASHLIGHT.charge();
		PS.audioPlay("fx_click", {volume: 0.01});
	}

	// Add code here for when an input event is detected.
};

