// LITTLE ENGINE 5/2/2021
// 
// Alex Basinski                - programming, game design
// Alexa Wilbert                - audio design, art
// Ardent Eliot :-) Reinhard    - UI/UX 
// Star Hagen-Esquerra          - art
//
// FONTS USED:
// Fredoka One
// Berlin Sans FB
//
// Twemoji (recolored) https://creativecommons.org/licenses/by/4.0/
// 
// Creative Tilt:
// Alexa is proud of the audio design and music that she did. This was the first time she worked with audio, and she learned a lot.
// Ardent implemented a way to draw a custom font onto the screen, in NumberRenderer.js. 
//      This was new to them and it worked out pretty well.
// Alex is proud of the jump that he made and the series of logical statements that make it feel good to use, 
//      (found in Engine.js between the jump() method and the update() method)
// Star animated the player character in three distinct states. The outcome was very effective, and the character is very cute!
// We made a really interesting and unique looking setting that is still cohesive. 
// The fuel system that we made adds a layer of resource management to the endless runner genre. 
//      In the game, you are always running out of fuel, which is a unique feeling to our game.

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    physics: {
        default: "arcade",
        arcade: {
            // debug: true
        }
    },
    scene: [Menu, Play, Tutorial],
};

let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;


let keySPACE, keyF; //configure input keys
let speed, loSpeed, midSpeed, hiSpeed; //configure speed levels
let distance; //score variable

let buildingsX = 0;
let mushroomsX = 0;
let groundbackingX = 0;
let groundX = 0;

let lastScene = "menu"; // this variable is so we can animate the scene transitions different depending on what the last scene was