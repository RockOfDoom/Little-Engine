class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    
    init() {
        loSpeed = 2;
        midSpeed = 4;
        hiSpeed = 8;
        speed = midSpeed; //current speed of the player
        distance = 0; //initialize score
        this.gas = 50; //how much gas the player has in the tank
        this.distance = 0; //how far the player has travelled
        this.gameOver = false; //if this is true, game ends. becomes true if gas & speed = 0
        this.deltaTicker = 0.0; //mechanism for capping game at 60fps
        this.frameTick = 0; //tracks how many times update() has run
        this.gasGuzzle = 1; //controls how quickly gas is consumed
        this.platformFreq = 300; //controls the interval between platform spawns in ticks (60 per second)
        this.enemy1Freq = 600;
        this.intensity = 0; //controls the rate at which obstacles spawn, goes up over time
    }

    preload() {
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
        this.buildings.tilePositionX = buildingsX;
        
        //display mushrooms
        this.mushrooms = this.add.tileSprite(
            0,
            0,
            640,
            480,
            "mushrooms").setOrigin(0,0);
        this.mushrooms.tilePositionX = mushroomsX;
        
        //display groundbacking
        this.groundbacking = this.add.tileSprite(
            0,
            0,
            640,
            480,
            "groundbacking").setOrigin(0,0);
        this.groundbacking.tilePositionX = groundbackingX;

        //display ground
        this.ground = this.add.tileSprite(
            0,
            0,
            640,
            480,
            "ground").setOrigin(0,0);
        this.ground.tilePositionX = groundX;

        this.engine = this.add.sprite(
            borderUISize,
            game.config.height - 1.62 * borderUISize,
            "fireguy",
            0).setOrigin(0.5,1);
        this.engine.play("run");
        
        

        this.load.image("groundbox", "./assets/groundbox.png");
        this.load.image("gameover ui", "./assets/gameover_ui_image.png");
        this.load.image("meter", "./assets/meter.png");
        this.load.image("platform", "./assets/platform.png");
        this.load.image("fuel", "./assets/fuel.png");
        this.load.audio("jumpSFX", "./assets/Jump2.wav");
        this.load.audio("atkSFX", "./assets/Fireball.wav");
        this.load.audio("hurtSFX", "./assets/Hit-matrixxx.wav");
        this.load.audio("music", "./assets/BackgroundMusic_mixdown4.wav");
        this.load.spritesheet("enemy1", "./assets/enemy1-Sheet.png",
            {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 8});
    }

    create() {
        this.music = this.sound.add("music", {
            loop: true
        });
        this.music.play();

        this.engine.destroy();
        //define input keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //place ground hitbox
        this.groundBox = this.physics.add.image(
            0,
            game.config.height - 1.62 * borderUISize,
            "groundbox").setOrigin(0,0);
        this.groundBox.body.setImmovable();

        //create enemy1 group
        this.enemy1Group = this.add.group({
            runChildUpdate: true
        });
        //prepare enemy animation
        this.anims.create({
            key: "enemy1Run",
            frames: this.anims.generateFrameNumbers("enemy1",
                {start: 0, end: 8, first: 0}),
            frameRate: 24,
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
        
        this.engine.anims.play("run");

        //create platform group
        this.platformGroup = this.add.group({
            runChildUpdate: true
        });
        //create fuel pickup group
        this.fuelGroup = this.add.group({
            runChildUpdate: true
        });
        
        // draw the game over UI with alpha at zero
        this.gameoverUI = this.add.sprite(
            0,
            0,
            "gameover ui"
            ).setOrigin(0, 0);
        this.gameoverUI.alpha = 0;
        this.gameoverUITween = false;
        this.gameoverUI.setDepth(100);
        
        // this variable is used when u transition from game over to title screen
        this.transRectTween = false;
        
        // draw fuel gauge sprite
        // in the future this will have two sprites + numbers
        this.fuelGauge = this.add.sprite(
            borderUISize /2,
            borderUISize/2,
            "meter"
            ).setOrigin(0, 0);
        
        // draw speedometer sprite
        // same thing as above
        this.speedometer = this.add.sprite(
            config.width - borderUISize/2,
             borderUISize/2,
            "meter"
            ).setOrigin(1, 0);
        this.speedometer.flipX = true;

        // text for the meters... this will probaby be replaced later
        let numbersConfig = {
            fontFamily: "Verdana",
            fontSize: "24px",
            color: "#000",
            backgroundColor: "#fff",
            align: "center",
            padding: 5,
        }
        this.fuelGaugeText = this.add.text(
            this.fuelGauge.x + borderUISize/2,
            this.fuelGauge.y + borderUISize/2,
            Math.round(this.gas),
            numbersConfig
        );
        numbersConfig.align = "left";
        this.speedometerText = this.add.text(
            this.speedometer.x - borderUISize*1.5,
            this.speedometer.y + borderUISize/2,
            Math.round(speed*10),
            numbersConfig
        );
        // animate the gauges coming in
        this.tweens.add({
            targets: [this.fuelGauge, this.speedometer],
            y: {from: 0 - this.speedometer.height, to: borderUISize/2},
            duration: 500,
            ease: "Back.Out"
        });
        this.tweens.add({
            targets: [this.fuelGaugeText, this.speedometerText],
            y: {from: 0 - this.speedometer.height + borderUISize/2, to: this.fuelGauge.y + borderUISize/2},
            duration: 500,
            ease: "Back.Out"
        });
    }

    update(time, delta) {
        this.deltaTicker += delta; //update deltaTicker with milliseconds since last update()
        while(this.deltaTicker >= 16.666666) { //only perform updates 60 times per second
            //move backgrounds based on current speed
            this.buildings.tilePositionX += speed / 2;
            this.mushrooms.tilePositionX += speed - (speed / 8);
            this.groundbacking.tilePositionX += speed;
            this.ground.tilePositionX += speed;
            // console.log("speed: " + speed);
            // console.log("gas: " + this.gas);

            //make ground standable
            this.physics.world.collide(this.engine, this.groundBox, () => {
                if(this.engine.airborne) { //if player has just touched ground, land
                    this.engine.land();
                }
            });
            this.physics.world.collide(this.engine, this.platformGroup, () => {
                if(this.engine.airborne && this.engine.body.touching.down) { //if player has just landed on platform, land
                    this.engine.land();
                }
            });

            //update distance by 1 * speed per second
            distance += speed / 60;
            console.log(distance);

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
                this.physics.world.collide(this.engine, this.enemy1Group, (engine, enemy1) => {
                    if(this.engine.damaging) {
                        this.gas += 10; //* this.gasGuzzle;
                        enemy1.die();
                    }
                    else if(!this.engine.hurting) { //lower speed if player runs into enemy
                        this.engine.getHurt();
                        console.log("ow!");
                        hiSpeed -= 0.5;
                        if(hiSpeed < 4) {
                            hiSpeed = 4;
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
                this.engine.update(this.gas, this.aniFrame);

                //check to see if engine is picking up a fuel pickup
                this.physics.world.collide(this.engine, this.fuelGroup, (engine, fuel) => {
                    fuel.use();
                    this.gas += 40;
                });

                //manage different fuel levels in engine
                if(this.gas > 100) { //if engine overflows, don't
                    console.log("gas overflow");
                    this.gas = 100;
                }

                if(this.gas > 66 && speed != hiSpeed) { //if engine has full tank, go to high speed
                    console.log("hispeed set");
                    speed = hiSpeed;
                } else if(this.gas >= 33 &&  this.gas <= 66 && speed != midSpeed) { //if engine has half tank, go to medium speed
                    console.log("midspeed set");
                    speed = midSpeed;
                } else if(this.gas > 0 && this.gas < 33 && speed != loSpeed) { //if engine is low, but not empty, go to low speed
                    console.log("lowspeed set");
                    speed = loSpeed;          
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

                //spawn enemies some frequency based on ticks and speed
                if(speed == hiSpeed && this.frameTick % (this.enemy1Freq / 2) == 0) {
                    this.spawnEnemy1(game.config.width, game.config.height - 1.62 * borderUISize);
                } else if(speed == midSpeed && this.frameTick % this.enemy1Freq == 0) {
                    this.spawnEnemy1(game.config.width, game.config.height - 1.62 * borderUISize);
                } else if(speed == loSpeed && this.frameTick % (this.enemy1Freq * 2) == 0) {
                    this.spawnEnemy1(game.config.width, game.config.height - 1.62 * borderUISize);
                }

                //spawn platforms some frequency based on ticks and speed
                if(speed == hiSpeed && this.frameTick % (this.platformFreq / 2) == 0) {
                    this.spawnPlatform();
                } else if(speed == midSpeed && this.frameTick % this.platformFreq == 0) {
                    this.spawnPlatform();
                } else if(speed == loSpeed && this.frameTick % (this.platformFreq * 2) == 0) {
                    this.spawnPlatform();
                }
            }
            else { //game over screen
                if (this.gameoverUITween == false && speed == 0) {
                    this.gameoverUITween = true;
                    this.tweens.add({
                        targets: [this.gameoverUI],
                        alpha: {from: 0, to: 1},
                        duration: 1000
                    });
                }
                if(speed != 0) {
                    console.log("decelerating");
                    speed -= loSpeed * 0.005;
                    if(speed < 0) {
                        speed = 0;
                    }
                } else {
                    if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
                        this.scene.start("playScene");
                    } else if (Phaser.Input.Keyboard.JustDown(keyF) && this.transRectTween == false) {
                        this.transRectTween = true;
                        this.transRect = this.add.rectangle(0, 0, config.width, config.height, 0x000).setOrigin(0, 0);
                        this.transRect.setDepth(101);
                        this.transRect.alpha = 0;
                        console.log("here");
                        this.tweens.add({
                            targets: [this.transRect],
                            alpha: {from: 0, to: 1},
                            duration: 1000
                        }).on("complete", () => {
                            lastScene = "play";
                            this.scene.start("menuScene");
                        });
                        
                    }
                }
            }

            // updating the text on the fuel gauge and speedometer
            this.fuelGaugeText.text = Math.round(this.gas);
            this.speedometerText.text = Math.round(speed*10);

            //tick deltaTicker down once and frameTick up once
            this.deltaTicker -= 16.666666;
            this.frameTick++;
        }
    }

    spawnPlatform() { //spawn a new platform offscreen, and sometimes spawn something on it and/or under it
        console.log("platform spawn go!");
        this.platformGroup.add(new Platform(
            this, 
            2 * game.config.width, 
            game.config.height / 2 + borderUISize, 
            "platform", 
            0).setOrigin(0.5,0));
    }

    spawnEnemy1(x, y) {
        this.enemy1Group.add(new Enemy1(
            this,
            x,
            y,
            "enemy1",
            0).setOrigin(0.5,1));
    }
}