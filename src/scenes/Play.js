class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    
    init() {
        loSpeed = 2;
        midSpeed = 4;
        hiSpeed = 8;
        this.runSpeed = hiSpeed; //current speed of the player
        this.gas = 100; //how much gas the player has in the tank
        this.distance = 0; //how far the player has travelled
        this.gameOver = false; //if this is true, game ends. becomes true if gas & speed = 0
        this.deltaTicker = 0.0; //mechanism for capping game at 60fps
        this.frameTick = 0; //tracks how many times update() has run
        this.gasGuzzle = 1; //controls how quickly gas is consumed
    }

    preload() {
        this.load.image("groundbox", "./assets/groundbox.png");
        this.load.audio("jumpSFX", "./assets/Jump2.wav");
        this.load.spritesheet("enemy1", "./assets/enemy1-Sheet.png",
            {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 8});
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
        this.enemy1.body.setImmovable();
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
            borderUISize,
            game.config.height - 1.62 * borderUISize,
            "fireguy",
            0,
            keyF,
            keySPACE).setOrigin(0.5,1);
        //give engine gravity
        this.engine.setGravityY(200);
        
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

            //make ground standable
            this.physics.world.collide(this.engine, this.groundBox, () => {
                if(this.engine.airborne) { //if player has just touched ground, land
                    this.engine.land();
                }
            });

            //update game pieces if game is not over
            if(!this.gameOver) {
                //increase speed every 30s
                if(this.frameTick % 900 == 0) {
                    hiSpeed += 0.5;
                    midSpeed += 0.5;
                    loSpeed += 0.5;
                    this.gasGuzzle += 0.5;
                }

                //check collisions
                this.physics.world.collide(this.engine, this.enemy1, () => {
                    if(this.engine.damaging) {
                        this.gas += 10 * this.gasGuzzle;
                        this.enemy1.reset();
                    }
                    else if(!this.engine.hurting) { //lower speed if player runs into enemy
                        this.engine.getHurt();
                        console.log("ow!");
                        hiSpeed -= 0.5;
                        if(hiSpeed < 3) {
                            hiSpeed = 3;
                        }
                        midSpeed -= 0.5;
                        if(midSpeed < 2) {
                            midSpeed = 2;
                        }
                        loSpeed -= 0.5;
                        if(loSpeed < 1) {
                            loSpeed = 1;
                        }
                    }
                });

                //update engine
                this.engine.update(this.runSpeed, this.gas, this.aniFrame);
                //update enemies
                this.enemy1.update(this.runSpeed);

                //manage different fuel levels in engine
                if(this.gas > 100) { //if engine overflows, don't
                    console.log("gas overflow");
                    this.gas = 100;
                }

                if(this.gas > 66 && this.runSpeed != hiSpeed) { //if engine has full tank, go to high speed
                    console.log("hispeed set");
                    this.runSpeed = hiSpeed;
                } else if(this.gas >= 33 &&  this.gas <= 66 && this.runSpeed != midSpeed) { //if engine has half tank, go to medium speed
                    console.log("midspeed set");
                    this.runSpeed = midSpeed;
                } else if(this.gas > 0 && this.gas < 33 && this.runSpeed != loSpeed) { //if engine is low, but not empty, go to low speed
                    console.log("lowspeed set");
                    this.runSpeed = loSpeed;          
                } else if(this.gas <= 0) {
                    //if player is out of gas, end game
                    this.gameOver = true;
                    console.log("game over");
                }


                //consume gas based how long game has been going
                if(this.gas > 0) {
                    this.gas -= 0.01666666 * this.gasGuzzle;
                    if(this.gas < 0) {
                        this.gas = 0;
                    }
                }
            }
            else { //game over screen
                if(this.runSpeed != 0) {
                    console.log("decelerating");
                    this.runSpeed -= loSpeed * 0.005;
                    if(this.runSpeed < 0) {
                        this.runSpeed = 0;
                    }
                }
            }
            //tick deltaTicker down once and frameTick up once
            this.deltaTicker -= 16.666666;
            this.frameTick++;
        }
    }
}