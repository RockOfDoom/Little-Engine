class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    
    init() {
        this.runSpeed = 8; //current speed of the player
        this.gas = 100; //how much gas the player has in the tank
        this.distance = 0; //how far the player has travelled
        this.gameOver = false; //if this is true, game ends. becomes true if gas & speed = 0
        this.deltaTicker = 0.0; //mechanism for capping game at 60fps
        this.aniFrame = 0; //tracks the current frame of the current animation (except run)
    }

    preload() {
        this.load.image("sun", "./assets/sun_background.png");
        this.load.image("buildings", "./assets/buildings_background.png");
        this.load.image("mushrooms", "./assets/mushrooms_background.png");
        this.load.image("groundbacking", "./assets/groundbacking.png");
        this.load.image("ground", "./assets/ground.png");
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
        
        //display groundbacking
        this.groundbacking = this.add.tileSprite(
            0,
            0,
            640,
            480,
            "groundbacking").setOrigin(0,0);
        
        //display ground
        this.ground = this.add.tileSprite(
            0,
            0,
            640,
            480,
            "ground").setOrigin(0,0);

        //prepare little engine animations
        //walk
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("fireguy",
                {start: 0, end: 2, first: 0}),
            frameRate: 9,
            repeat: -1
        });

        //display little engine
        this.engine = new Engine(
            this,
            borderUISize + this.runSpeed,
            game.config.height - 2 * borderUISize,
            "fireguy",
            0);
        
        this.engine.anims.play("run");
    }

    update(time, delta) {
        this.deltaTicker += delta; //update deltaTicker with milliseconds since last update()
        while(this.deltaTicker >= 16.666666) { //only perform updates 60 times per second
            //move backgrounds based on current speed
            this.buildings.tilePositionX += this.runSpeed / 2;
            this.mushrooms.tilePositionX += this.runSpeed - (this.runSpeed / 8);
            this.groundbacking.tilePositionX += this.runSpeed;
            this.ground.tilePositionX += this.runSpeed;
            console.log("speed: " + this.runSpeed);
            console.log("gas: " + this.gas);

            //update game pieces if game is not over
            if(!this.gameOver) {
                //manage different fuel levels in engine
                if(this.gas > 100) { //if engine overflows, don't
                    this.gas = 100;
                }
                if(this.gas > 67) { //if engine has full tank, accelerate
                    this.runSpeed *= 1.0001;
                }
                else if(this.gas > 33) { //if engine has half tank, maintain speed
                    //
                }
                else if(this.gas > 0) { //if engine is low, but not empty, decelerate
                    this.runSpeed -= this.runSpeed * 0.0001;                
                }
                else {
                    if(this.runSpeed = 0) { //if player is out of gas and speed, end game
                        this.gameOver = true;
                    }
                    else { //if player is out of gas but not speed, skid to a halt
                        this.runSpeed -= this.runSpeed * 0.001;
                        if(this.runSpeed < 0.0000000001) {
                            this.runSpeed = 0;
                        }
                    }
                }


                //consume gas based on speed
                if(this.gas > 0) {
                    this.gas -= this.runSpeed / 1000;
                    if(this.gas < 0) {
                        this.gas = 0;
                    }
                }
            }
            else { //game over screen
                //
            }
            //tick deltaTicker down once
            this.deltaTicker -= 16.666666;
        }
    }
}