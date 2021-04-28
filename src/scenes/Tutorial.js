class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    init() {
        this.bgOffset = 50;         // this makes the bg elements lower on the title screen than on the play screen
        this.parallaxMovement = 2;  // used for parallax on the title and tutorial scenes
    }

    preload() {
        
    }

    create() {
        this.select = this.sound.add("select");
        this.add.rectangle(
            0,
            0,
            640,
            480,
            0x181640
            ).setOrigin(0, 0);
        
        // the next five tile sprites are what make up the background of the game 
        this.sun = this.add.tileSprite(
            0, 
            this.bgOffset, 
            640, 
            480,
            "sun"
            ).setOrigin(0, 0);
        this.buildings = this.add.tileSprite(
            0, 
            this.bgOffset*2, 
            640,
            480,
            "buildings"
            ).setOrigin(0, 0);
        this.buildings.tilePositionX = buildingsX + this.parallaxMovement;
        
        this.tutorialSprite = this.add.sprite(
            0,
            0,
            "tutorial ui"
            ).setOrigin(0, 0);
        
        
        this.tweens.add({
            targets: [this.tutorialSprite],
            alpha: {from: 0, to: 1},
            duration: 1000,
        });
        this.isTweening = false;
        this.input.keyboard.on("keydown-F", () => {
            if (this.isTweening == false) {
                this.isTweening = true;
                this.select.play();
                this.tweens.add({
                    targets: [this.tutorialSprite],
                    alpha: {from: 1, to: 0},
                    duration: 500,
                }).on("complete", () => {
                    buildingsX = this.buildings.tilePositionX + this.parallaxMovement;
                    lastScene = "tutorial";
                    this.scene.start("menuScene");
                });
            }
        });
    }

    update() {
        //this.sun.y = Math.round(this.sun.y);
        this.buildings.y = Math.round(this.buildings.y);
        this.buildings.tilePositionX += this.parallaxMovement;
    }
}