class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    init() {
        this.bgOffset = 50;         // this makes the bg elements lower on the title screen than on the play screen
        this.parallaxMovement = 2;  // used for parallax on the title and tutorial scenes
    }

    preload() {
        this.load.image("menu meter", "./assets/menu_meter.png");
        this.load.image("menu dial", "./assets/menu_dial.png");
        this.load.image("menu ui", "./assets/menu_ui_image.png");
        this.load.image("tutorial ui", "./assets/tutorial_ui_image.png");
        this.load.image("sun", "./assets/sun_background.png");
        this.load.image("buildings", "./assets/buildings_background.png");
        this.load.image("mushrooms", "./assets/mushrooms_background.png");
        this.load.image("groundbacking", "./assets/groundbacking.png");
        this.load.image("ground", "./assets/ground.png");
        this.load.spritesheet("fireguy", "./assets/fire-guy-Sheet.png",
            {frameWidth:64, frameHeight: 64, startFrame: 0, endFrame: 3});
    }

    create() {
        // i only use the first frame but i load the whole animation anyway
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("fireguy",
                {start: 0, end: 3, first: 0}),
            frameRate: 9,
            repeat: -1
        });

        // this is the same color as the background in the sun image.
        // it's so that the sky extends when the sun image is below 0,0 the sky is still the right color
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

        this.mushrooms = this.add.tileSprite(
            0, 
            this.bgOffset*5, 
            640,
            480,
            "mushrooms"
            ).setOrigin(0, 0);
        this.groundbacking = this.add.tileSprite(
            0,
            this.bgOffset*8,
            640,
            480,
            "groundbacking"
            ).setOrigin(0,0);
        this.ground = this.add.tileSprite(
            0,
            this.bgOffset*10,
            640,
            480,
            "ground").setOrigin(0,0);
        
        // in the future i would like to make this two or three sprites and change the way they tween induvidually
        this.menuSprite = this.add.sprite(
            0, 
            0, 
            "menu ui"
            ).setOrigin(0, 0);


        if (lastScene == "menu" || lastScene == "tutorial") {
            this.tweens.add({
                targets: [this.menuSprite],
                alpha: {from: 0, to: 1},
                duration: 500,
            });
        } else if (lastScene == "play") {
            this.transRect = this.add.rectangle(0, 0, config.width, config.height, 0x000).setOrigin(0, 0);
            this.transRect.setDepth(101);
            this.tweens.add({
                targets: [this.transRect],
                alpha: {from: 1, to: 0},
                duration: 2000
            });
        }

        // meters
        this.meter1 = this.add.sprite(
            borderUISize,
            config.height + 22,
            "menu meter"
            ).setOrigin(0, 1);
        
        this.meter2 = this.add.sprite(
            config.width - borderUISize,
            config.height + 22,
            "menu meter"
            ).setOrigin(1, 1);
        

        // dials
        this.dial1 = this.add.sprite(
            this.meter1.x + this.meter1.width/2,
            this.meter1.y - this.meter1.height/2,
            "menu dial"
            ).setOrigin(.5, 1);

        this.dial2 = this.add.sprite(
            this.meter2.x - this.meter2.width/2,
            this.meter2.y - this.meter2.height/2,
            "menu dial"
            ).setOrigin(.5, 1);

        this.dial1.angle = Phaser.Math.RND.between(-112.5, 112.5);
        this.dial2.angle = Phaser.Math.RND.between(-112.5, 112.5);
        this.dial1Tweening = false;
        this.dial2Tweening = false;

        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("fireguy",
                {start: 0, end: 3, first: 0}),
            frameRate: 9,
            repeat: -1
        });
        
        // our baby!
        this.engine = this.add.sprite(
            borderUISize,
            config.height - 1.62 * borderUISize + this.bgOffset*10,
            "fireguy",
            0
            ).setOrigin(.5, 1);
        //this.engine.play("run");

        // okay here are all the tweens. 
        this.tweenLength = 4000;
        this.tweenEase = "Back.In";
        this.isTweening = false;
        // in the future, i will change this so that the different keys go to different screens/tweens
        // i am using Quart.easeOut but maybe i will change that to
        this.input.keyboard.on("keydown-SPACE", () => {
            if (this.isTweening == false) {
                this.isTweening = true;
                this.tweens.add({
                    targets: [this.sun, this.buildings, this.mushrooms, this.groundbacking, this.ground],
                    y: 0,
                    duration: this.tweenLength,
                    ease: this.tweenEase
                }).on("complete", () => {
                    buildingsX = this.buildings.tilePositionX + this.parallaxMovement;
                    mushroomsX = this.mushrooms.tilePositionX + this.parallaxMovement;
                    groundbackingX =this.groundbacking.tilePositionX + this.parallaxMovement;
                    groundX = this.ground.tilePositionX + this.parallaxMovement;
                    lastScene = "menu";
                    this.scene.start("playScene"), this
                });

                //this one is for engine to make it go to the right spot for the transition
                this.tweens.add({
                    targets: this.engine,
                    y: game.config.height - 1.62 * borderUISize,
                    duration: this.tweenLength,
                    ease: this.tweenEase
                });
                
                // this one tweens the parallax movement to zero so that the play screen starts stationary
                this.tweens.add({
                    targets: this,
                    parallaxMovement: {from: this.parallaxMovement, to: 0},
                    duration: this.tweenLength,
                    //ease: this.tweenEase
                });

                // this tweens the ui sprite to alpha = 0 so that it is gone by the time the play scene starts
                this.tweens.add({
                    targets: [this.menuSprite],
                    alpha: {from: 1, to: 0},
                    duration: this.tweenLength/2,
                });
            }
        });

        this.input.keyboard.on("keydown-F", () => {
            if (this.isTweening == false) {
                this.isTweening = true;
                this.tweens.add({
                    targets: [this.menuSprite],
                    alpha: {from: 1, to: 0},
                    duration: 500,
                }).on("complete", () => {
                    buildingsX = this.buildings.tilePositionX + this.parallaxMovement;
                    lastScene = "menu";
                    this.scene.start("tutorialScene"), this
                });
            }
        });
    }

    update() {
        this.sun.y = Math.round(this.sun.y);
        this.buildings.y = Math.round(this.buildings.y);
        this.mushrooms.y = Math.round(this.mushrooms.y);
        this.groundbacking.y = Math.round(this.groundbacking.y);
        this.ground.y = Math.round(this.ground.y);
        this.buildings.tilePositionX += this.parallaxMovement;
        this.mushrooms.tilePositionX += this.parallaxMovement*1.5;
        this.groundbacking.tilePositionX += this.parallaxMovement*2;

        if (this.dial1Tweening == false) {
            console.log("here1");
            this.dial1Tweening = true;
            this.nextAngle1 = Phaser.Math.RND.between(-112.5, 112.5);
            this.nextDuration1 = Phaser.Math.RND.between(2000, 4000);
            this.nextWait1 = Phaser.Math.RND.between(1000, 2000);
            this.tweens.add({
                targets: [this.dial1],
                angle: this.nextAngle1,
                duration: this.nextDuration1,
                ease: "Cubic.InOut"
            }).on("complete", () => {
                this.time.delayedCall(this.nextWait1, () => {
                    this.dial1Tweening = false;
            })});
        }

        if (this.dial2Tweening == false) {
            console.log("here2");
            this.dial2Tweening = true;
            this.nextAngle2 = Phaser.Math.RND.between(-112.5, 112.5);
            this.nextDuration2 = Phaser.Math.RND.between(2000, 4000);
            this.nextWait2 = Phaser.Math.RND.between(1000, 2000);
            this.tweens.add({
                targets: [this.dial2],
                angle: this.nextAngle2,
                duration: this.nextDuration2,
                ease: "Cubic.InOut"
            }).on("complete", () => {
                this.time.delayedCall(this.nextWait2, () => {
                    this.dial2Tweening = false;
            })});
        }
    }
}