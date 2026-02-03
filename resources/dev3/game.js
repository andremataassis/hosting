var WIDTH = 15;
var HEIGHT = 15;

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

var gameOn = false;

//for doing drag and click
var clicking = false;
var placing = false;
var draw_color = PS.COLOR_BLACK;

function pauseOrPlay(){
	gameOn = !gameOn;
		if(gameOn){
			PS.glyph(7, HEIGHT - 1, "⏸");
			PS.audioPlay("fx_chirp1");
			PS.borderAlpha(PS.ALL, PS.ALL, 50);
			PS.borderAlpha(PS.ALL, 14, 255);
		}
		else{
			PS.glyph(7, HEIGHT - 1, "▶︎");
			PS.audioPlay("fx_chirp2");
			PS.borderAlpha(PS.ALL, PS.ALL, 255);
		}
}

function takeStep(){
	updateGame(true);
	PS.audioPlay("fx_hoot");
}

function clearGridButton(){
	GRID.clearGrid();
	PS.color(PS.ALL, PS.ALL, PS.COLOR_WHITE);
	PS.color(PS.ALL, 14, PS.COLOR_GRAY);
	PS.audioPlay("fx_bang");
}

function randomizeButton(){
	GRID.randomizeGrid();
	PS.audioPlay("fx_powerup8");
}

function changeDrawColor(x, y){
	PS.audioPlay("fx_drip1");
	draw_color = PS.glyphColor(x, y);
}

function create_toolbar(){
	for (let i = 0; i < WIDTH; i++){
		PS.color(i, HEIGHT - 1, PS.COLOR_GRAY);
	}
	//Pause/play button
	PS.glyph(7, HEIGHT - 1, "▶︎");
	PS.exec(7, HEIGHT - 1, pauseOrPlay);
	PS.glyphColor (7, HEIGHT - 1, PS.COLOR_WHITE );

	//Clear button
	PS.glyph(13, HEIGHT - 1, "X");
	PS.exec(13, HEIGHT - 1, clearGridButton);
	PS.glyphColor (13, HEIGHT - 1, PS.COLOR_RED);

	//Randomize button
	PS.glyph(11, HEIGHT - 1, "⟳");
	PS.exec(11, HEIGHT - 1, randomizeButton);
	PS.glyphColor (11, HEIGHT - 1, PS.COLOR_WHITE);

	//Step button ⏭
	PS.glyph(8, HEIGHT - 1, "⏭");
	PS.exec(8, HEIGHT - 1, takeStep);
	PS.glyphColor (8, HEIGHT - 1, PS.COLOR_WHITE );

	//Color blocks ■
	PS.glyph(1, HEIGHT - 1, "■");
	PS.exec(1, HEIGHT - 1, changeDrawColor);
	PS.glyphColor(1, HEIGHT - 1, PS.COLOR_BLACK);

	PS.glyph(2, HEIGHT - 1, "■");
	PS.exec(2, HEIGHT - 1, changeDrawColor);
	PS.glyphColor (2, HEIGHT - 1, PS.COLOR_RED);

	PS.glyph(3, HEIGHT - 1, "■");
	PS.exec(3, HEIGHT - 1, changeDrawColor);
	PS.glyphColor (3, HEIGHT - 1, PS.COLOR_YELLOW);

	PS.glyph(4, HEIGHT - 1, "■");
	PS.exec(4, HEIGHT - 1, changeDrawColor);
	PS.glyphColor(4, HEIGHT - 1, PS.COLOR_BLUE);

	PS.glyph(5, HEIGHT - 1, "■");
	PS.exec(5, HEIGHT - 1, changeDrawColor);
	PS.glyphColor(5, HEIGHT - 1, PS.COLOR_GREEN);

}

var GRID = {
	//0 = dead, 1 = alive
	grid: [],
	population: 0,
	prevPop: 0,
	createEmpty2DArray : function(rows, cols) {
		const arr = [];
		for (let i = 0; i < rows; i++) {
			arr.push(new Array(cols).fill(0));
		}
		grid = arr;
	},
	updateGrid : function(x, y, value){
		if(grid[y][x] != value){
			if(grid[y][x] == 1){
				this.population -= 1;
			}
			else this.population += 1;
		}
		grid[y][x] = value;
	},
	synchGridToDisplay : function(){
		let last_color = draw_color;
		for(let x = 0; x < WIDTH; x++){
			for(let y = 0; y < HEIGHT - 1; y++){
				//For multiple colors...
				if(PS.color(x, y) != PS.COLOR_WHITE) {
					last_color = PS.color(x, y);
				}

				if(grid[y][x] == 0){
					PS.color(x, y, PS.COLOR_WHITE);
				}
				else{
					PS.color(x, y, last_color);
				}
			}
		}

		//play sound effect based on population change
		if(this.population != this.prevPop){
			let sound = Math.floor(Math.random() * (2)) + 1;
			switch(sound){
				case 1:
					PS.audioPlay("fx_squish");
					break;
				case 2:
					PS.audioPlay("fx_tweet");
					break;
			}
		}
		this.prevPop = this.population;
	},
	clearGrid : function(){
		for(let x = 0; x < WIDTH - 1; x++){
			for(let y = 0; y < HEIGHT; y++){
				grid[x][y] = 0;
			}
		}
	},
	randomizeGrid : function(){
		for(let x = 0; x < WIDTH - 1; x++){
			for(let y = 0; y < HEIGHT; y++){
				grid[x][y] = Math.floor(Math.random() * 2);
			}
		}
		this.synchGridToDisplay();
	}
}

updateGame = function(step = false){
	if(gameOn == false && step == false) return;
	for(let x = 0; x < WIDTH; x++){
		let left = x - 1;
		let right = x + 1;
		for(let y = 0; y < HEIGHT - 1; y++){
			//get up and down
			let down = y + 1;
			let up = y - 1;
			
			//get neighbors
			let neighbors = 0;

			if(left > 0){
				//left
				if (PS.color(left, y) != PS.COLOR_WHITE) neighbors += 1;
				if(up > 0){
					//top left
					if (PS.color(left, up) != PS.COLOR_WHITE) neighbors += 1;
				}
				if(down < HEIGHT - 1){
					//bottom left
					if (PS.color(left, down) != PS.COLOR_WHITE) neighbors += 1;
				}
			}
			if(right < WIDTH){
				//right
				if (PS.color(right, y) != PS.COLOR_WHITE) neighbors += 1;
				if(up > 0){
					//top right
					if (PS.color(right, up) != PS.COLOR_WHITE) neighbors += 1;
				}
				if(down < HEIGHT - 1){
					//bottom right
					if (PS.color(right, down) != PS.COLOR_WHITE) neighbors += 1;
				}
			}
			if(up > 0){
				//above
				if (PS.color(x, up) != PS.COLOR_WHITE) neighbors += 1;
			}
			if(down < HEIGHT - 1){
				//below
				if (PS.color(x, down) != PS.COLOR_WHITE) neighbors += 1;
			}

			//follow rules depending on number of neighbors
			thisCell = PS.color(x, y) != PS.COLOR_WHITE;

			//cell alive
			if(thisCell){
				//die if fewer than two neighbors
				if(neighbors < 2){
					GRID.updateGrid(x, y, 0);
				}
				//2-3 neighbors means live
				else if(neighbors <= 3){
					GRID.updateGrid(x, y, 1);
				}
				//more than 3 neighbors dies
				else if (neighbors > 3){
					GRID.updateGrid(x, y, 0);
				}
			}
			//cell dead
			else{
				//exactly 3 means birth
				if(neighbors == 3){
					GRID.updateGrid(x, y, 1);
				}
			}
		}
	}

	//update display
	GRID.synchGridToDisplay();
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

	PS.gridSize( WIDTH, HEIGHT );
	GRID.createEmpty2DArray(HEIGHT - 1, WIDTH);
	PS.borderAlpha(PS.ALL, PS.ALL, 255);
	create_toolbar();

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	PS.statusText( "Inkblot Sandbox" );

	// Add any other initialization code you need here.
	PS.timerStart(4, updateGame);
	PS.debug("Draw something and hit play!\n\nMade by Andre Mata Assis.");
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
	if(y > HEIGHT - 2) return;
	
	clicking = true;
	gameOn = false;

	if(PS.color(x, y) == PS.COLOR_WHITE){
		PS.color(x, y, draw_color);
		PS.audioPlay("fx_click");
		GRID.updateGrid(x, y, 1);
		placing = true;
	}
	else {
		PS.color(x, y, PS.COLOR_WHITE);
		PS.audioPlay("fx_pop");
		GRID.updateGrid(x, y, 0);
		placing = false;
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
	clicking = false;
	if(PS.glyph(7, HEIGHT - 1) === 9208) gameOn = true;
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
	if(y > HEIGHT - 2){
		if(PS.exec(x, y) != null){
			PS.borderColor(x, y, PS.COLOR_BLACK);
		}
		return;
	}

	if(clicking == true){
		if(PS.color(x, y) == PS.COLOR_WHITE && placing){
			PS.color(x, y, draw_color);
			PS.audioPlay("fx_click");
			GRID.updateGrid(x, y, 1);
		}
		else if (PS.color(x, y) != PS.COLOR_WHITE && !placing) {
			PS.color(x, y, PS.COLOR_WHITE);
			PS.audioPlay("fx_pop");
			GRID.updateGrid(x, y, 0);
		}
	}
	else {
		PS.border(x, y, 2);
		PS.borderColor(x, y, draw_color);
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
	if(y > HEIGHT - 2 && PS.exec(x, y) != null){	
		PS.borderColor(x, y, PS.COLOR_GRAY);
		return;
	}

	PS.border(x, y, 1);
	PS.borderColor(x, y, PS.COLOR_GRAY);
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

	//PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
	clicking = false;
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

