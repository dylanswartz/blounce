/* Author: 
Blounce - Dylan Swartz & John Wiegert
*/

window.onload = function() {

	var SKYSCRAPER_WIDTH = 33; //Width of the skyscrapers on the sides
	var BLOB_HEIGHT = 80; //The height of the blob images
	var BLOB_WIDTH = 80; //The width of the blob images
	var pointTotal = 0; //Total number of points
	var aliveTotal = 0; //Total number of alive blobs
	var deadTotal = 0; //Total number of dead (off the screen) blobs
	var blobTotal = 0; //Total number of blobs for calculations
	var CANVAS_HEIGHT = 768; //The height of the actual canvas
	var CANVAS_WIDTH = 1024; //The width of the actual canvas
	
	var Score = function() { //Object to display the score
	
		this.update = function() { //Update the score each frame
			aliveTotal = blobTotal - deadTotal; //Calculating number of alive blobs
			c.font = "bold 30px sans-serif"; //Font properties
			c.fillStyle = "#affafb"; //Text color
			c.fillText("Score: ", 48, 50); //Writing all the score numbers
			c.fillText(pointTotal, 150, 50);
			c.fillText("Alive: ", 48, 80);
			c.fillText(aliveTotal, 150, 80);
			c.fillText("Dead: ", 48, 110);
			c.fillText(deadTotal, 150, 110);
		}
	}

	var Trampoline = function() { //Object for the trampoline (platform)
		this.img = new Image()
		this.x   = 0;
		this.y   = 0;

		this.init = function() { //Initialize the trampoline
			this.img.src = "img/trampoline.png"; //Trampoline image
			this.x = 500; //Starting coordinates
			this.y = 560;
		}

		this.move = function(x) {

			this.x = x - (this.img.width / 2);

			// if the trampoline is off the left edge
			if (this.x < SKYSCRAPER_WIDTH)
				this.x = SKYSCRAPER_WIDTH;	// move it back
			// if the trampoline is off the right edge
			else if ( (this.x + this.img.width) > (canvas.width - SKYSCRAPER_WIDTH) )
				this.x = (canvas.width - (this.img.width + SKYSCRAPER_WIDTH)); // move it back
		}

		this.update = function() {
			c.drawImage(this.img, this.x, this.y, this.img.width, this.img.height);			
		}
	}

	var Blob = function() { //Object for the blobs
		this.img     = new Image(); //New image being added
		this.x       = 0; //Initial coordinates
		this.y       = 0;
		this.blobSpeed = 20; //The default speed at which the blob falls (Or bounces)
		this.points = 2; //Default number of points a blob bounce is worth
		var randomBlob = Math.ceil((Math.random()*4)); //Generate random number for which blob will spawn
		var bounced = false; //If the blob has been bounced off the trampoline already
		this.diagonalSpeed = 0; //Variable for diagonal movement
		var side = false;
		var left = false;
		var center = true;
		var right = false;
			
		this.init = function() { //Function to initialize the blobs
			//var randomCoord = Math.floor((Math.random() * (CANVAS_WIDTH - (2 * SKYSCRAPER_WIDTH))) + SKYSCRAPER_WIDTH);
			var randomCoord = generateRandomX(); //Generating the random x coordinate to spawn a blob at
			switch (randomBlob) //Switch to change the blob image based on random number
			{
				case 1:
					this.img.src = "img/blob_vladimir.png"; //Blob image
					this.blobSpeed = 28; //Speed at which the blob moves
					this.points = 3; //number of points it is worth
					break;
				case 2:
					this.img.src = "img/blob_ted.png";
					this.blobSpeed = 35;
					this.points = 4;
					break;
				case 3:
					this.img.src = "img/blob_leonidas.png";
					break;
				case 4:
					this.img.src = "img/blob_balthazar.png";
					this.blobSpeed = 16;
					this.points = 1;
					break;
			}
			this.x = randomCoord;  //Initializing the coordinates
			this.y = 10;
			blobTotal += 1; //Adding to the total number of blobs
		}
		
		this.physics = function(){
			if (side) //Side bounce off a wall
			{
				this.diagonalSpeed = this.diagonalSpeed * -1; //Reverse direction
			}
			else if (bounced) //If bounced from the trampoline
			{
				if (this.x + BLOB_WIDTH >= trampoline.x && this.x + BLOB_WIDTH <= trampoline.x + 40) //If blob hits left
				{
					left = true;
					right = false;
					center = false;
				}
				else if (/*(this.x + BLOB_WIDTH >= trampoline.x + 33) && */(this.x + BLOB_WIDTH <= trampoline.x + 66) && center) //If blob hits center
				{
					center = true;
					right = false;
					left = false;
				}
				else if (this.x /*+ BLOB_WIDTH >= trampoline.x && this.x + BLOB_WIDTH */<= trampoline.x + 100) //If blob hits right
				{
					right = true;
					left = false;
					center = false;
				}
			
				if (center) //If the blob hit the center 
					this.diagonalSpeed = 0;
				else //Hit right or left side
				{
					switch (randomBlob) //Switch to change the blob image based on random number
					{
						case 1:
							this.diagonalSpeed = 28; //Speed at which the blob moves diagonally
							break;
						case 2:
							this.diagonalSpeed = 35;
							break;
						case 3:
							this.diagonalSpeed = 20;
							break;
						case 4:
							this.diagonalSpeed = 16;
							break;
					}
					if (left)
						this.diagonalSpeed = this.diagonalSpeed * -1; //Reversing diagonal
				}	
			}
		}

		this.update = function() {	//Function to update the blob each frame
			if (!bounced && (this.y + BLOB_HEIGHT >= trampoline.y && this.y + BLOB_HEIGHT <= trampoline.y + trampoline.img.height) && (this.x + BLOB_WIDTH >= trampoline.x && this.x <= trampoline.x + 100)) //If blob hits trampoline
			{
				bounced = true; //Blob hit the trampoline
				this.bounce(); //Reverse the blob direction
				this.physics();
				this.y = this.y + this.blobSpeed; //The amount that the blob falls at a time
				this.x = this.x + this.diagonalSpeed; //The amount the blob goes diagonal at a time
				pointTotal += this.points; //Adding the points for a bounce of a blob
			}
			else if (this.y <= 0) //Hit the top
			{
				bounced = false; //Blob hit the top
				this.y = this.y - this.blobSpeed; //The amount that the blob falls at a time
				this.x = this.x + this.diagonalSpeed; //The amount the blob goes diagonal at a time
				this.bounce(); //Reverse the blob direction
			}
			else if (this.y >= CANVAS_HEIGHT) //Blob is off the canvas, stop drawing
			{
				deadTotal += 1; //Count the dead
			}
			else if ((this.y + BLOB_HEIGHT) >= trampoline.y + trampoline.img.height) //Blob is past the platform
			{
				this.y = this.y + this.blobSpeed; //The amount that the blob falls at a time
				this.x = this.x + this.diagonalSpeed; //The amount the blob goes diagonal at a time
				this.die(); //If the blob hits the death area, draw him dead
			}
			else if ((this.x <= (SKYSCRAPER_WIDTH)) || ((this.x + BLOB_WIDTH) >= (CANVAS_WIDTH - SKYSCRAPER_WIDTH))) //Hit a side
			{
				side = true;
				this.physics();
				side = false;
				this.y = this.y + this.blobSpeed; //The amount that the blob falls at a time
				this.x = this.x + this.diagonalSpeed; //The amount the blob goes diagonal at a time
			}
			else //Has not hit the bottom, top or either side 
			{
				this.y = this.y + this.blobSpeed; //The amount that the blob falls at a time
				this.x = this.x + this.diagonalSpeed; //The amount the blob goes diagonal at a time
			}
			c.drawImage(this.img, this.x, this.y, this.img.width, this.img.height); //Redrawing the image each time
		}
		
		this.bounce = function() { //Function to reverse the direction of the blob
			this.blobSpeed = this.blobSpeed * -1;
		}
		
		this.die = function() { //The blob is dead
			switch (randomBlob) //Switch to select the death image
			{
				case 1:
					this.img.src = "img/blob_vladimir_screaming.png";
					break;
				case 2:
					this.img.src = "img/blob_ted_screaming.png";
					break;
				case 3:
					this.img.src = "img/blob_leonidas_screaming.png";
					break;
				case 4:
					this.img.src = "img/blob_balthazar_screaming.png";
					break;
			}
			c.drawImage(this.img, this.x, this.y, this.img.width, this.img.height); //Drawing the death image
		}
	}

	function generateRandomX() { //Function to generate the random x coordinate
		var randNum = Math.floor((Math.random() * CANVAS_WIDTH))

		if ((randNum + BLOB_WIDTH) >= (CANVAS_WIDTH - SKYSCRAPER_WIDTH))
			randNum = (CANVAS_WIDTH - (SKYSCRAPER_WIDTH + 1)) - BLOB_WIDTH;
		else if (randNum <= SKYSCRAPER_WIDTH)
			randNum = SKYSCRAPER_WIDTH + 1;		
			
		return randNum;	
	}


	function moveEventFunction(e) {
		var p;
	    if (e.touches) {
	        // Touch Enabled (loop through all touches)
	        for (var i = 1; i <= e.touches.length; i++) {
	            p = getCoords(e.touches[i - 1]); // Get info for finger i
	        }
	    }
	    else {
	        // Not touch enabled (get cursor position from single event)
	        var p = getCoords(e);
	    }
	    trampoline.move(p.x);
	 
	    return false; // Stop event bubbling up and doing other stuff (like pinch zoom or scroll)
	}

	// Get the coordinates for a mouse or touch event
	function getCoords(e) {
	    if (e.offsetX) {
	        // Works in Chrome / Safari (except on iPad/iPhone)
	        return { x: e.offsetX, y: e.offsetY };
	    }
	    else if (e.layerX) {
	        // Works in Firefox
	        return { x: e.layerX, y: e.layerY };
	    }
	    else {
	        // Works in Safari on iPad/iPhone
	        return { x: e.pageX - c.offsetLeft, y: e.pageY - c.offsetTop };
	    }
	}
	
	// link our JS canvas with the element in index.html
	// we could also dynamically create the canvas with js
	// but..I don't feel like it
	var canvas = document.getElementById('gameCanvas');

	var c = canvas.getContext('2d');
	blob = new Blob(); 
	trampoline = new Trampoline();
	score = new Score();
	
	blob.init(); //Initializing first blob
	trampoline.init();
	
	var frames = 0; //Setting the initial frames to 0 to start
	var frameIncrement = 1; //Setting initial increment 
	var newBlob = 50; //How often a new blob generates
	
	var blobArray = new Array(); //Adding first element to the array of blobs
	blobArray.push(blob);

	var audio = document.getElementById("music");

	// Set up handlers
	canvas.ontouchmove = moveEventFunction;
	canvas.onmousemove = moveEventFunction;

	function draw(){
		deadTotal = 0; //Resetting the dead total
		c.clearRect(0, 0, canvas.width, canvas.height); //Clearing the canvas
		trampoline.update(); //Update trampoline position
		for(var i = 0; i < blobArray.length; i++)  //Update every blob in the array
			{
			blobArray[i].update();
			}
		if (frames >= newBlob) //Make a new blob fall if enough time has passed
			{
			blobArray.push(new Blob());
			blobArray[blobArray.length - 1].init();
			frames = 0;
			frameIncrement += .1;
			}
		score.update(); //Update the score each frame
		if (aliveTotal < 10) //If structure for slowing down blob generation
			frameIncrement = 1;
		else if (aliveTotal < 20 && frameIncrement > 2)
			frameIncrement = 2;	
		else if (aliveTotal < 30 && frameIncrement > 3)
			frameIncrement = 3;
		else if (aliveTotal < 50 && frameIncrement > 4)
			frameIncrement = 4;
		else if (aliveTotal < 75 && frameIncrement > 5)
			frameIncrement = 5;
		else if (aliveTotal < 120 && frameIncrement > 10)
			frameIncrement = 10;
		else if (aliveTotal < 200 && frameIncrement > 49)
			frameIncrement = 49;
		frames += frameIncrement; //Specifying a new frame has passed
	}

    audio.load();
    audio.play();
	
	// make our game loop
	setInterval(draw,100);

	$(window).resize(function(){

		if ($(window).width() > 1024 && $(window).height() > 768) {
			$('#gameCanvas').css({
				position:'absolute',
				left: ($(window).width() - $('#gameCanvas').outerWidth())/2,
				top: ($(window).height() - $('#gameCanvas').outerHeight())/2
			});
		} else {
			$('#gameCanvas').css({
				position:'absolute',
				left: 0,
				top: 0
			});
		}

	});

	$(window).resize();
}













