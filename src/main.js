let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    scene: [Menu, Play, Tutorial],
    pixelArt: true
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