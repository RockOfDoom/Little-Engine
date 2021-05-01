class NumberRenderer {
    constructor(scene, x, y, numbers, maxNumbers) {

        // ok so this is a lot less complicated than it looks
        // basically it's a class to render the numers that i drew
        // i wanted to do that cuz i wanted to draw my own numbers bc i like to have control over the style
        // (and because i couldn't figure out how to outline numbers with css shadows for some reason)
        this.scene = scene;                 // u need this to make sprites lol
        this.x = x;                         // where they draw the numbers
        this.y = y;                         // ^^
        this.numbers = numbers;             // this holds the actual number value that we are rendering
        this.maxNumbers = maxNumbers;       // this is so that i can right align the numbers 
        this.numberSprites = [];            // this is where i put the actual sprites (which are taken from a sprite sheet)
                                            // frame 0 is the number 0 frame 1 is 1 etc.
        this.updateNumbers(this.numbers);   // this is the part that does it lol i call it every frame
    }  

    updateNumbers(numbers) {
        // this takes an argument of numbers so that u can actually change what the numbers are
        this.numbers = numbers;          
        // i store the numbers in a string so i can process them        
        this.numberString = this.numbers.toString();
        // this part will fill the first part of the string with empty space so i can ignore that decimal place
        while (this.numberString.length < this.maxNumbers) {
                this.numberString = " " + this.numberString;
        }
        // iterate over the string
        for (let i = 0; i < Math.min(this.numberString.length, this.maxNumbers); i++) {
            // sometimes they are undefined or NaN and in that case u can't destroy it 
            if (this.numberSprites[i] != undefined && this.numberSprites[i] != NaN) {
                // if there is a sprite there, i destroy it so i can draw a new one
                this.numberSprites[i].destroy();
            }

            // if it is blank, we skip the drawing sprite so that it goes to the next number and just adds space
            if (this.numberString.charAt(i) != " ") {
                this.numberSprites[i] = this.scene.add.sprite(
                                            this.x + 32*i,                  // 32 is the width of the numbers
                                            this.y,                         // y
                                            "numbers",                      // this is the name of the sprite
                                            this.numberString.charAt(i)     // the frame
                                            ).setOrigin(.5,0);              // origin
            }
        }
    }
}