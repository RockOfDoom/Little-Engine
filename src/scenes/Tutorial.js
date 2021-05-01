class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    init() {
        this.bgOffset = 50;         // this makes the bg elements lower on the title screen than on the play screen
        this.parallaxMovement = 2;  // used for parallax on the title and tutorial scenes
        this.page = 1;              // for the different pages of the tutorial
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
        
        this.label = this.add.sprite(
            borderUISize,
            borderUISize,
            "tutorial label"
            ).setOrigin(0, 0);
        
        this.tutorial1 = this.add.sprite(
            borderUISize,
            borderUISize*4,
            "tutorial1"
            ).setOrigin(0, 0);

        this.tutorial2 = this.add.sprite(
            borderUISize + config.width,
            borderUISize*4,
            "tutorial2"
            ).setOrigin(0, 0);
        
        
        // make the engine for the enemy when i put it on the tutorial
        this.engine = this.add.sprite(
            this.tutorial1.x + this.tutorial1.width/2 + 18, // middle of the tutorial panel on bottom
            borderUISize*8.5 + 10,                          // spaced just right 😉
            "run"
            ).setOrigin(.5, 1);
        this.engine.scaleX = 2;                             // so it shows up better
        this.engine.scaleY =2;
        this.engine.play("run");
        
        // make the animation for the enemy when i put it on the tutorial
        this.anims.create({
            key: "enemy1Run",
            frames: this.anims.generateFrameNumbers("enemy1",
                {start: 0, end: 8, first: 0}),
            frameRate: 12,
            repeat: -1
        });
        this.monster = this.add.sprite(
            this.tutorial2.x + this.tutorial2.width/2,        // same thing as engine
            borderUISize*8.5,
            "enemy1Run"
            ).setOrigin(.5, 1);
        this.monster.scale = 2;
        this.monster.play("enemy1Run");

        this.isTweening = true;     // so u only have 1 tween @ a time

        // fades everything in
        this.tweens.add({
            targets: [this.label, this.tutorial1, this.tutorial2, this.engine], 
            alpha: {from: 0, to: 1},                          
            duration: 1000,
        }).on("complete", () => {
            this.isTweening = false;
        });
        
        // this is the ugliest code i've written in my entire life but that's just how tweening is! 😭😭
        this.input.keyboard.on("keydown-F", () => {
            if (this.isTweening == false) {
                this.isTweening = true;                     // so only 1 tween @ once
                this.select.play();             
                if (this.page == 1) {
                    
                    // turns to the next page (of 2 currently)
                    this.page++;                           
                    this.tweens.add({
                        targets: [this.tutorial1],
                        x: -config.width + borderUISize,
                        duration: 750,
                    }).on("complete", () => {
                        this.isTweening = false;            // so we know we're not tweening
                    });

                    // same as above, but for the second page, which is positioned offscreen
                    this.tweens.add({
                        targets: [this.tutorial2],
                        x: borderUISize,
                        duration: 750
                    });
                } else if (this.page == 2) {

                    // fades out and then goes back to the title screen
                    // if we edit the tutorial and add more pages, we will need to change this code
                    this.tweens.add({
                        targets: [this.label, this.tutorial1, this.tutorial2, this.engine, this.monster],
                        alpha: {from: 1, to: 0},
                        duration: 500,
                    }).on("complete", () => {
                        buildingsX = this.buildings.tilePositionX + this.parallaxMovement;
                        lastScene = "tutorial";
                        this.scene.start("menuScene");
                    });
                }
            }
        });
    }

    update() {
        //this.sun.y = Math.round(this.sun.y);
        this.buildings.y = Math.round(this.buildings.y);
        this.buildings.tilePositionX += this.parallaxMovement;
        this.engine.x = this.tutorial1.x + this.tutorial1.width/2 + 18;     // easier than adding a tween for them
        this.monster.x = this.tutorial2.x + this.tutorial2.width/2;         // ^^
    }
}