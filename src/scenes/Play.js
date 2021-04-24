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
        this.load.image("groundbox", "./assets/groundbox.png");
        this.load.audio("jumpSFX", "./assets/Jump2.wav");
        this.load.spritesheet("enemy1", "./assets/enemy1-Sheet.png",
            {frameWidth: 256, frameHeight: 256, startFrame: 0, endFrame: 8});
    }

    create() {
        //define input keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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

        //place ground hitbox
        this.groundBox = this.physics.add.image(
            0,
            game.config.height - 1.62 * borderUISize,
            "groundbox").setOrigin(0,0);
        this.groundBox.body.setImmovable();

        //create enemy
        this.enemy1 = new Enemy1(
            this,
            game.config.width,
            game.config.height - 1.62 * borderUISize,
            "enemy1",
            0).setOrigin(0.5,1);
        //prepare enemy animation
        this.anims.create({
            key: "enemy1Run",
            frames: this.anims.generateFrameNumbers("enemy1",
                {start: 0, end: 8, first: 0}),
            frameRate: 24,
            repeat: -1
        });
        this.enemy1.anims.play("enemy1Run");

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
            game.config.height - 1.62 * borderUISize,
            "fireguy",
            0,
            keyF,
            keySPACE).setOrigin(0.5,1);
        //give engine gravity
        this.engine.setGravityY(100);
        
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
            // console.log("speed: " + this.runSpeed);
            // console.log("gas: " + this.gas);

            //update game pieces if game is not over
            if(!this.gameOver) {
                //check collisions
                this.physics.world.collide(this.engine, this.groundBox, () => {
                    if(this.engine.airborne) { //if player has just touched ground, land
                        this.engine.land();
                    }
                });

                //update engine
                this.engine.update(this.runSpeed, this.gas, this.aniFrame);
                //update enemies
                this.enemy1.update(this.runSpeed);

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
                    this.runSpeed -= this.runSpeed * 0.0002;                
                }
                else {
                    if(this.runSpeed = 0) { //if player is out of gas and speed, end game
                        this.gameOver = true;
                    }
                    else { //if player is out of gas but not speed, skid to a halt
                        this.runSpeed -= this.runSpeed * 0.0001;
                        if(this.runSpeed < 0.0000000001) {
                            this.runSpeed = 0;
                        }
                        if(this.runSpeed < 0) {
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