class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    init() {
        this.bgOffset = 50;
        this.tweenLength = 4000;
        this.parallaxMovement = 2;
    }

    preload() {
        this.load.image("menu ui", "./assets/menu_ui_image.png");
        this.load.image("sun", "./assets/sun_background.png");
        this.load.image("buildings", "./assets/buildings_background.png");
        this.load.image("mushrooms", "./assets/mushrooms_background.png");
        this.load.image("groundbacking", "./assets/groundbacking.png");
        this.load.image("ground", "./assets/ground.png");
        this.load.spritesheet("fireguy", "./assets/fire_guy.png",
            {frameWidth:25, frameHeight: 24, startFrame: 0, endFrame: 2});
    }

    create() {
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("fireguy",
                {start: 0, end: 2, first: 0}),
            frameRate: 9,
            repeat: -1
        });

        this.add.rectangle(
            0,
            0,
            640,
            480,
            0x181640
            ).setOrigin(0, 0);
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
        
        this.mushrooms = this.add.tileSprite(
            0, 
            this.bgOffset*5, 
            640,
            480,
            "mushrooms"
            ).setOrigin(0, 0);

        this.menuSprite = this.add.sprite(
            0, 
            0, 
            "menu ui"
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
        
        this.engine = this.add.sprite(
            borderUISize,
            game.config.height - 2 * borderUISize,
            "fireguy",
            0);

        
        this.input.keyboard.on("keydown", () => {
            this.tweens.add({
                targets: [this.sun],
                y: {from: this.sun.y, to: 0},
                duration: this.tweenLength,
                ease: "Quart.easeOut"
            }).on("complete", () =>
                this.scene.start("playScene"), this);
            this.tweens.add({
                targets: [this.buildings],
                y: {from: this.buildings.y, to: 0},
                duration: this.tweenLength,
                ease: "Quart.easeOut"
            });
            this.tweens.add({
                targets: [this.mushrooms],
                y: {from: this.mushrooms.y, to: 0},
                duration: this.tweenLength,
                ease: "Quart.easeOut"
            });
            this.tweens.add({
                targets: [this.ground],
                y: {from: this.ground.y, to: 0},
                duration: this.tweenLength,
                ease: "Quart.easeOut"
            });
            this.tweens.add({
                targets: [this.groundbacking],
                y: {from: this.groundbacking.y, to: 0},
                duration: this.tweenLength,
                ease: "Quart.easeOut"
            });
            this.tweens.add({
                targets: this,
                parallaxMovement: {from: this.parallaxMovement, to: 0},
                duration: this.tweenLength,
                ease: "Quart.easeOut"
            });
            this.tweens.add({
                targets: [this.menuSprite],
                alpha: {from: 1, to: 0},
                duration: this.tweenLength/2,
                ease: "Quart.easeOut"
            });
            //this.scene.start("playScene");
        });
    }

    update() {
        this.buildings.tilePositionX += this.parallaxMovement;
        this.mushrooms.tilePositionX += this.parallaxMovement*1.5;
        this.groundbacking.tilePositionX += this.parallaxMovement*2;
        this.engine.y = this.ground.y + this.ground.height - 59 - this.engine.height/2;

    }
}