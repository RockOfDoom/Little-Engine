class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    
    init() {
        this.runSpeed = 8; //current speed of the player
        this.deltaTicker = 0.0; //mechanism for capping game at 60fps
    }

    preload() {
        this.load.image("sun", "./assets/sun_background.png");
        this.load.image("buildings", "./assets/buildings_background.png");
        this.load.image("mushrooms", "./assets/mushrooms_background.png");
        this.load.spritesheet("fireguy", "./assets/fire_guy.png",
            {frameWidth:25, frameHeight: 24, startFrame: 0, endFrame: 2});
    }

    create() {
        //display sky
        this.sky = this.add.tileSprite(
            0,
            0,
            640,
            480,
            "sun").setOrigin(0,0);
        
        //display buildings
        this.buildings = this.add.tileSprite(
            0,
            0,
            640,
            480,
            "buildings").setOrigin(0,0);
        
        //display mushrooms
        this.mushrooms = this.add.tileSprite(
            0,
            0,
            640,
            480,
            "mushrooms").setOrigin(0,0);

        //display little engine
        this.engine = this.add.sprite(
            borderUISize + this.runSpeed,
            game.config.height - 2*borderUISize,
            "fireguy",
            0);
    }

    update(time, delta) {
        this.deltaTicker += delta; //update deltaTicker with milliseconds since last update()
        while(this.deltaTicker >= 16.666666) { //only perform updates 60 times per second
            this.buildings.tilePositionX += this.runSpeed / 2;
            this.mushrooms.tilePositionX += this.runSpeed - 1;

            this.deltaTicker -= 16.666666;
        }
    }
}