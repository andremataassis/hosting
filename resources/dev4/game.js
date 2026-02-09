var HEIGHT = 20;
var WIDTH = 20;

const TOTAL_LEVELS = 5;
var current_level = 0;
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

function digAudio(){ PS.audioPlay("fx_blast2", {volume: 0.05}); }
function unbreakableAudio(){ PS.audioPlay("fx_shoot7", {volume: 0.05}); }

const levels = [];

//Loads level text files into levels[]
async function loadGameData() {
    try {
		for(let i = 0; i < TOTAL_LEVELS; i++){
			const response = await fetch("./level" + (i + 1) + ".txt");
			if (!response.ok) throw new Error("File not found");
			
			const data = await response.text();
			levels.push(data);
		}
		loadLevel(current_level);
        
    } catch (error) {
        PS.debug("Error loading file: " + error + "\n");
    }
}

//Loads level 'i' from levels[]
function loadLevel(i){
	WATER.clearAll();
	DOORS.clearAll();
	const preArgs = 3;
	const lines = levels[i].split('\n');
	WIDTH = parseInt(lines[0]);
	HEIGHT = parseInt(lines[1]);
	PS.gridSize(WIDTH, HEIGHT);

	let x = 0;
	let y = 0;
	for(let i = preArgs; i < HEIGHT + preArgs; i++){
		for(const char of lines[i]){
			if(char === '.') WATER.placeAir(x, y);
			else if (char === '#') WATER.placeSolid(x, y);
			else if(char === 'S') WATER.placeSource(x, y);
			else if(char === '=') WATER.placeUnbreakableSolid(x, y);
			else if(char === 'W') WATER.placeWinCondition(x, y);
			else if(char === "|") DOORS.placeDoor(x, y, false);
			else if(char === "/") DOORS.placeDoor(x, y, true);
			else if(char === "B") DOORS.placeButton(x, y);
			else if(char === '\n') continue;
			x++;
		}
		x = 0;
		y++;
	}
}

var PEN ={
	clicking: false,
}

function gameWinScreen(){
	WATER.clearAll();
	DOORS.clearAll();
	WIDTH = 6;
	HEIGHT = 4;
	PS.gridSize(WIDTH, HEIGHT);
	PS.color(PS.ALL, PS.ALL, PS.COLOR_GREEN);

	PS.glyph(1, 1, "Y");
	PS.glyph(2, 1, "O");
	PS.glyph(3, 1, "U");
	PS.glyph(1, 2, "W");
	PS.glyph(2, 2, "I");
	PS.glyph(3, 2, "N");
	PS.glyph(4, 2, "!");
}

function reloadLevel(){
	PS.audioPlay("fx_scratch");
	loadLevel(current_level);
}

function triggerWin(){
	PS.audioPlay("fx_bloop");
	PS.debug("Level " + (current_level + 1) + " cleared.\n");
	current_level += 1;
	if(current_level < TOTAL_LEVELS) loadLevel(current_level);
	else gameWinScreen();
}

var SOLIDS = ["Solid", "Unbreakable", "Door", "Button"];

var DOORS = {
	doorCells: [],
	buttonCells: [],
	doorsOn: false,
	placeDoor: function(x, y, open){
		data = open ? 0 : "Door";
		PS.data(x, y, data);
		PS.borderColor(x, y, PS.COLOR_CYAN);
		if(open){
			PS.borderColor(x, y, PS.COLOR_WHITE);
			PS.glyph(x, y, "/");
		}
		else {
			PS.color(x, y, PS.COLOR_CYAN);
			PS.glyph(x, y, "|");
		}
		DOORS.doorCells.push({x: x, y: y});
	},
	placeButton: function(x, y){
		PS.data(x, y, "Button");
		PS.borderColor(x, y, PS.COLOR_CYAN);
		PS.glyph(x, y, "O");
		DOORS.buttonCells.push({x: x, y: y});
	},
	openDoor: function(x, y){
		PS.data(x, y, 0);
		PS.color(x, y, PS.COLOR_WHITE);
		PS.glyph(x, y, "/");
	},
	closeDoor: function(x, y){
		PS.data(x, y, "Door");
		PS.color(x, y, PS.COLOR_CYAN);
		PS.glyph(x, y, "|");
	},
	checkDoors: function(){
		startDoorsOn = DOORS.doorsOn;
		for(const button of DOORS.buttonCells){
			x = button.x;
			y = button.y;
			if(x + 1 < WIDTH && PS.data(x + 1, y) === "Water"){
				PS.glyph(button.x, button.y, "I");
				DOORS.doorsOn = true;
				break;
			}
			if(x - 1 > 0 && PS.data(x - 1, y) === "Water"){
				PS.glyph(button.x, button.y, "I");
				DOORS.doorsOn = true;
				break;
			}
			if(y + 1 < HEIGHT && PS.data(x, y + 1) === "Water"){
				PS.glyph(button.x, button.y, "I");
				DOORS.doorsOn = true;
				break;
			}
			if(y - 1 < 0 && PS.data(x, y + 1) === "Water"){
				PS.glyph(button.x, button.y, "I");
				DOORS.doorsOn = true;
				break;
			}
		}
		if(startDoorsOn != DOORS.doorsOn){
			for(const door of DOORS.doorCells){
				if(PS.data(door.x, door.y) === 0){
					DOORS.closeDoor(door.x, door.y);
				}
				else if(PS.data(door.x, door.y) === "Door"){
					DOORS.openDoor(door.x, door.y);
				}
			}
		}
	},
	clearAll: function(){
		DOORS.doorCells = [];
		DOORS.buttonCells = [];
		DOORS.doorsOn = false;
	}
}

var WATER = {
	source: {x: 0, y: 0},
	waterCells: [],
	bufferCells: [],
	//Places solid block at x, y
	placeSolid: function(x, y){
		PS.data(x, y, "Solid");
		PS.color(x, y, PS.COLOR_BLACK);
	},
	placeUnbreakableSolid: function(x, y){
		PS.data(x, y, "Unbreakable");
		PS.color(x, y, PS.COLOR_GRAY_DARK);
	},
	//Places source water at x, y
	placeSource: function(x, y){
		WATER.source = {x: x, y: y};
		PS.data(x, y, "Water");
		PS.color(x, y, PS.COLOR_BLUE);
		WATER.waterCells.push(this.source);
		WATER.bufferCells.push(this.source);
	},
	//Places win condition at x, y
	placeWinCondition: function(x, y){
		PS.data(x, y, "Win");
		PS.color(x, y, PS.COLOR_YELLOW);
		PS.glyph(x, y, "★");
	},
	//Turns cell at x, y to water
	turnCellToWater: function(x, y){
		PS.data(x, y, "Water");
		PS.color(x, y, PS.COLOR_BLUE);
		WATER.bufferCells.push({x : x, y : y});
	},
	//Places air at x, y
	placeAir: function(x, y){
		//remove from list if water
		if(PS.data(x, y) === "Water"){
			for (let i = 0; i < WATER.bufferCells.length; i++) {
				if (WATER.bufferCells[i].x === x && WATER.bufferCells[i].y === y) {
					WATER.bufferCells.splice(i, 1);
					i--;
				}
			}
		}
		PS.color(x, y, PS.COLOR_WHITE);
		PS.data(x, y, 0);
	},
	//Used to check if water should expand further when in enclosed space
	checkExpandToSides: function(x, y){
		if(y + 1 >= HEIGHT) return false;
		if(PS.data(x, y + 1) === "Water"){
			return WATER.checkExpandToSides(x, y + 1);
		}
		else if (SOLIDS.includes(PS.data(x, y + 1))) {
			return SOLIDS.includes(PS.data(x, y + 1));
		}
	},
	//Ticks every second, makes water flow
	waterTick: function(){
		//Set buffer equal to actual data
		WATER.bufferCells = Array.from(WATER.waterCells);
		//Loop through actual data, making updates to buffer throughout
		for(let i = 0; i < WATER.waterCells.length; i++){
			let x = WATER.waterCells[i].x;
			let y = WATER.waterCells[i].y;
			
			//get up, down, left right for x and y
			let down = y + 1;
			let up = y - 1;
			let left = x - 1;
			let right = x + 1;

			//Get data of neighbors
			let cellBelowData = null;
			let cellAboveData = null;
			let cellRightData = null;
			let cellLeftData = null;

			if(left >= 0){
				//left
				cellLeftData = PS.data(left, y);
			}
			if(right < WIDTH){
				//right
				cellRightData = PS.data(right, y);
			}
			if(up >= 0){
				//above
				cellAboveData = PS.data(x, up);
			}
			if(down < HEIGHT){
				//below
				cellBelowData = PS.data(x, down);
			}

			//Air below water makes water
			if(cellBelowData === 0){
				WATER.turnCellToWater(x, down);
			}
			//Solid below water
			else if(SOLIDS.includes(cellBelowData)){
				//Makes water on the sides if possible
				if(cellRightData === 0){
					WATER.turnCellToWater(right, y);
				}
				if(cellLeftData === 0){
					WATER.turnCellToWater(left, y);
				}
			}
			//Water below water
			else if(cellBelowData == "Water"){
				//Makes more water to the sides if possible
				let expand = WATER.checkExpandToSides(x, y);
				if(cellRightData === 0 && expand){
					WATER.turnCellToWater(right, y);
				}
				if(cellLeftData === 0 && expand){
					WATER.turnCellToWater(left, y);
				}
			}

			//Skip this next part if source water
			if(x === WATER.source.x && y === WATER.source.y) continue;
			//Delete water if no water around it
			if(cellRightData != "Water" && cellLeftData != "Water" && cellAboveData != "Water"){
				WATER.placeAir(x, y);
			}

			//Check if we won the game!
			if(cellAboveData === "Win" || cellBelowData === "Win" || cellLeftData === "Win" || cellRightData === "Win"){
				triggerWin();
			}

			//Check if doors need to be opened/closed every tick
			DOORS.checkDoors();
		}
		//Update buffer into actual data
		WATER.waterCells = Array.from(WATER.bufferCells);
	},
	//clears everything for a new level
	clearAll: function(){
		WATER.bufferCells = [];
		WATER.waterCells = [];
		PS.data(PS.ALL, PS.ALL, PS.DEFAULT);
		PS.glyph(PS.ALL, PS.ALL, PS.DEFAULT);
		PS.color(PS.ALL, PS.ALL, PS.COLOR_WHITE);
	}
};

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

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

	loadGameData();

	PS.gridSize(WIDTH, HEIGHT);

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	PS.statusText( "Water my Supposed to do?" );
	PS.timerStart(8, WATER.waterTick)
	
	

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

	PEN.clicking = true;
	
	if(data == "Solid"){ 
		digAudio();
		WATER.placeAir(x, y);
	}
	else if(data === "Unbreakable"){
		unbreakableAudio();
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
	PEN.clicking = false;
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
	if(PEN.clicking && data == "Solid"){
		digAudio();
		WATER.placeAir(x, y);
	}
	else if(data == "Solid"){
		PS.border(x, y, 2);
		PS.borderColor(x, y, PS.COLOR_RED);
	}
	else if(data == "Unbreakable"){
		PS.border(x, y, 2);
		PS.borderColor(x, y, PS.COLOR_BLACK);
		PS.glyph(x, y, "X");
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
	if(data !== "Door" && data !== "Button" && PS.glyph(x, y) !== "/"){
		PS.border(x, y, 1);
		PS.borderColor(x, y, PS.COLOR_GRAY);
    }
	if(data === "Unbreakable") PS.glyph(x, y, PS.DEFAULT);
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
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
	if(key == 114){ reloadLevel() }
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

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

