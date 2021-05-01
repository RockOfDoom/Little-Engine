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
        this.load.image("sun", "./assets/sun_background.png");
        this.load.image("buildings", "./assets/buildings_background.png");
        this.load.image("mushrooms", "./assets/mushrooms_background.png");
        this.load.image("groundbacking", "./assets/groundbacking.png");
        this.load.image("ground", "./assets/ground.png");
        this.load.image("names", "./assets/names.png");
        this.load.image("tutorial label", "./assets/tutorial_label.png");
        this.load.image("tutorial1", "./assets/tutorial1.png");
        this.load.image("tutorial2", "./assets/tutorial2.png");
        this.load.audio("select", "./assets/Select.wav");
        this.load.spritesheet("enemy1", "./assets/enemy1-Sheet.png",
            {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 8});
        this.load.spritesheet("fireguy", "./assets/fire-guy-Sheet.png",
            {frameWidth:64, frameHeight: 64, startFrame: 0, endFrame: 3});
    }

    create() {
        // select sound
        this.select = this.sound.add("select");
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
        // everything but sky and buildings are positioned off screen so the player can't see them by default
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
            -config.height*.75, 
            "menu ui"
            ).setOrigin(0, 0);
        
        this.names = this.add.sprite(
            config.width/2,
            config.height*1.25,
            "names"
            ).setOrigin(.5,1);

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
        
        // randomly set the dials to a position
        this.dial1.angle = Phaser.Math.RND.between(-112.5, 112.5);
        this.dial2.angle = Phaser.Math.RND.between(-112.5, 112.5);
        this.dial1Tweening = false;     // so we don't interupt a tween
        this.dial2Tweening = false;     // ^^
        
        // so we can put the little guy running at the bottom of the screen for the transition
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
                this.select.play();

                // this moves everything in the scene up until they are at 0,0 so it looks like the
                //camera is moving down until it gets to engine
                // notably, all of the sprites are 640x480
                this.tweens.add({
                    targets: [this.sun, this.buildings, this.mushrooms, this.groundbacking, this.ground],
                    y: 0,
                    duration: this.tweenLength,
                    ease: this.tweenEase
                }).on("complete", () => {
                    // this itle posiiton stuff is so that the next scene transitions well and it looks smooth
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
                    targets: [this.menuSprite, this.dial1, this.dial2, this.meter1, this.meter2, this.names],
                    alpha: {from: 1, to: 0},
                    duration: this.tweenLength/2,
                });
            }
        });
        
        // transition to the tutorial
        this.input.keyboard.on("keydown-F", () => {
            if (this.isTweening == false) {
                this.isTweening = true; // only one tween at once 
                this.select.play();

                // they all fade out
                this.tweens.add({
                    targets: [this.menuSprite, this.dial1, this.dial2, this.meter1, this.meter2, this.names],
                    alpha: {from: 1, to: 0},
                    duration: 500,
                }).on("complete", () => {
                    buildingsX = this.buildings.tilePositionX + this.parallaxMovement;
                    lastScene = "menu";
                    this.scene.start("tutorialScene"), this
                });
            }
        });

        // different transitions based on the previous scene
        // the default for "lastScene" is "menu", so that is what will happen when u open the game
        if (lastScene == "menu" || lastScene == "tutorial") {

            // after a delay, moves the title and the text to the center of the screen
            this.time.delayedCall(250, () => {
                this.tweens.add({
                    targets: [this.menuSprite],
                    y: {from: -config.height*.5, to: 0},
                    duration: 750,
                    ease: "Back.Out"
                });
            });

            // after a delay, moves the names onscreen. i like the rhythm of it 💖💖💖 the ux of it all
            this.time.delayedCall(1125, () => {
                this.tweens.add({
                    targets: [this.names],
                    y: {from: config.height*1.25, to: config.height - borderUISize},
                    duration: 750,
                    ease: "Back.Out"
                });
            });

        // here, i make it transition from a black square, cuz i draw one at the end of the play scene
        // from there, i just put everything in place no need to tween them again
        } else if (lastScene == "play") {
            this.transRect = this.add.rectangle(0, 0, config.width, config.height, 0x000).setOrigin(0, 0);
            this.transRect.setDepth(101);
            this.tweens.add({
                targets: [this.transRect],
                alpha: {from: 1, to: 0},
                duration: 2000
            });
            this.menuSprite.y = 0;
            this.names.y = config.height - borderUISize;
            
        } 
        // i dont remember why this is here but i do know that it has to be here 💖💖
        if (lastScene == "tutorial") {
            this.tweens.add({
                targets: [this.dial1, this.dial2, this.meter1, this.meter2],
                alpha: {from: 0, to: 1},
                duration: 500
            });
            console.log('ea');
        }
    }

    update() {
        // i round everything or else it looks uggy when they are trying to draw it at not integer coordinates
        this.sun.y = Math.round(this.sun.y);
        this.buildings.y = Math.round(this.buildings.y);
        this.mushrooms.y = Math.round(this.mushrooms.y);
        this.groundbacking.y = Math.round(this.groundbacking.y);
        this.ground.y = Math.round(this.ground.y);

        // these are so they look good on the transitions between scenes
        this.buildings.tilePositionX += this.parallaxMovement;
        this.mushrooms.tilePositionX += this.parallaxMovement*1.5;
        this.groundbacking.tilePositionX += this.parallaxMovement*2;

        // this is all for the dials
        // it kinda took me a while but they look super cute so 🤔🤔🤔
        // it's the little things that add up, you know 
        if (this.dial1Tweening == false) {
            this.dial1Tweening = true; 

            // the next angle that the dial will have on the next tween
            this.nextAngle1 = Phaser.Math.RND.between(-112.5, 112.5);
            // how long the next angle will take to get there
            this.nextDuration1 = Phaser.Math.RND.between(2000, 4000);
            // how long it will stay at that angle for
            this.nextWait1 = Phaser.Math.RND.between(1000, 2000);

            // then i just tween the rotation using those variables
            this.tweens.add({
                targets: [this.dial1],
                angle: this.nextAngle1,
                duration: this.nextDuration1,
                ease: "Cubic.InOut"
            }).on("complete", () => {
                this.time.delayedCall(this.nextWait1, () => {
                    this.dial1Tweening = false;
            })});   // idk why this line is like that but it is so ugly lol
                    // i like phaser but sometimes javascript is ugly with the parathesis and curly bracers
    
        }

        // it's the same as above. in THEORY i could have used a for loop or a function but w/e
        if (this.dial2Tweening == false) {
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