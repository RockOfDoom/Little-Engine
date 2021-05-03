class Engine extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, attackKey, jumpKey) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add sprite to scene
        scene.physics.add.existing(this); //assign physics to sprite
        this.scene = scene; //save scene so animations can be played from here
        //load input keys
        this.aKey = attackKey;
        this.jKey = jumpKey;
        //load sounds
        this.jumpSFX = scene.sound.add("jumpSFX");
        this.atkSFX = scene.sound.add("atkSFX");
        this.hurtSFX = scene.sound.add("hurtSFX");
        //configure hitbox
        this.body.setSize(40, 56, true);
        this.body.setOffset(1, 2.25);
        //give engine gravity
        this.jumpHeight = 300;
        this.setGravityY(this.jumpHeight);
        //define variables that track the current action the engine is performing
        this.running = true;
        this.attacking = false;
        this.damaging = false;
        this.jumping = false;
        this.airborne = false;
        this.landing = false;
        this.hurting = false;
        this.tweening = 0;
        this.fastFalling = true;
        this.blinkColor = 0xFFFFFF;
    }

    update(gas, frame) {
        //change position on screen based on speed
        if(speed == loSpeed && this.x != borderUISize + this.width / 2 && this.tweening != 1) { //move forward if player is at high speed
            this.tweening = 1;
            this.scene.time.delayedCall(3000, () => {
                this.tweening = 0;
            });
            this.scene.tweens.add({
                targets: [this],
                x: {from: this.x, to: borderUISize + this.width / 2},
                duration: 3000,
            });
        } else if(speed == midSpeed && this.x != borderUISize * 2 + this.width / 2 && this.tweening != 2) { //move to middle if player is at medium speed
            this.tweening = 2;
            this.scene.time.delayedCall(3000, () => {
                this.tweening = 0;
            });
            this.scene.tweens.add({
                targets: [this],
                x: {from: this.x, to: borderUISize * 2 + this.width / 2},
                duration: 3000,
            });
        } else if(speed == hiSpeed && this.x != borderUISize * 3 + this.width / 2 && this.tweening != 3) { //move backward if player is at low speed
            this.tweening = 3;
            this.scene.time.delayedCall(3000, () => {
                this.tweening = 0;
            });
            this.scene.tweens.add({
                targets: [this],
                x: {from: this.x, to: borderUISize * 3 + this.width / 2},
                duration: 3000,
            });
        }

        if(this.attacking) { //attacking halts falling or jumping
            this.setVelocity(0,0);
        }

        if(!this.body.touching.down && !this.airborne) { //if player is aerial but not marked as such, mark them
            this.airborne = true;
        }

        if(this.airborne && (this.body.speed == 0 || this.fastFalling)) { //fall faster after apex of jump is reached
            this.setGravityY(this.jumpHeight * 3);
        }
        
        this.fastFalling = true; //cause player to stop rising if they have released the jump key (see jump())
        if(this.jKey.isDown) { //jump when jump input is recieved
            // console.log("jump initiated");
            this.jump();
        }

        if(Phaser.Input.Keyboard.JustDown(this.aKey) && !this.hurting && !this.attacking) { //attack when attack input is recieved
            this.attack(gas);
        }
    }

    jump() { //call this to start and/or continue the player's jump
        if(!this.airborne) { //start the jump if it has not been started
            this.jumping = true;
            this.fastFalling = false;
            this.scene.time.delayedCall(25, () => {this.jumping = false;});
            this.airborne = true;
            this.setVelocity(0, -this.jumpHeight);
            this.jumpSFX.play();
        } else { //allow the player to continue rising if they are still holding the jump key
            this.fastFalling = false;
        }
    }

    land() { //finish a jump / aerial manuever and reset player's ability to jump again
        this.landing = true;
        this.airborne = false;
        this.setGravityY(this.jumpHeight);
        // console.log(this.airborne);
    }

    attack(gas) { //initiate and carry out an attacking action
        this.attacking = true;
        if(gas > 66){ //if gas is full, play full attack anim
            this.texture = "attack full";
            this.play("attack full");
        } else if(gas >= 33 && gas <= 66) { //if gas is half, play half attack anim
            this.texture = "attack half";
            this.play("attack half");
        } else if(gas > 0 && gas < 33) { //if gas is low, play low attack anim
            this.texture = "attack low";
            this.play("attack low");
        }
        this.scene.time.delayedCall(125, () => { //once attack has progressed to damage stage, evaluate
            if(!this.hurting) { //if player has not been hit, follow through with attack
                this.damaging = true;
                this.atkSFX.play();
                this.body.setSize(80, 56, true);
            } else if(gas > 66){ //if gas is full, go back to full run anim
                this.texture = "run full";
                this.play("run full");
            } else if(gas >= 33 && gas <= 66) { //if gas is half, go back to half run anim
                this.texture = "run half";
                this.play("run half");
            } else if(gas > 0 && gas < 33) { //if gas is low, go back to low run anim
                this.texture = "run low";
                this.play("run low");
            }
        });
        this.scene.time.delayedCall(500, () => { //conclude attack
            if(gas > 66){ //if gas is full, go back to full run anim
                this.texture = "run full";
                this.play("run full");
            } else if(gas >= 33 && gas <= 66) { //if gas is half, go back to half run anim
                this.texture = "run half";
                this.play("run half");
            } else if(gas > 0 && gas < 33) { //if gas is low, go back to low run anim
                this.texture = "run low";
                this.play("run low");
            }
            this.attacking = false;
            this.damaging = false;
            this.body.setSize(40, 56, true);
            this.body.setOffset(1, 2.25);
        });
    }

    getHurt() { //partially stun player / give them feedback that they have been hurt
        this.scene.cameras.main.shake(250, .008);
        this.hurting = true;
        this.hurtSFX.play();
        this.scene.time.delayedCall(1000, () => {this.hurting = false;});
        this.scene.time.delayedCall(100, () => this.setTintFill(this.blinkColor));
        this.scene.time.delayedCall(300, () => this.setTintFill(this.blinkColor));
        this.scene.time.delayedCall(500, () => this.setTintFill(this.blinkColor));
        this.scene.time.delayedCall(700, () => this.setTintFill(this.blinkColor));
        this.scene.time.delayedCall(900, () => this.setTintFill(this.blinkColor));
        this.scene.time.delayedCall(200, () => this.clearTint());
        this.scene.time.delayedCall(400, () => this.clearTint());
        this.scene.time.delayedCall(600, () => this.clearTint());
        this.scene.time.delayedCall(800, () => this.clearTint());
        this.scene.time.delayedCall(1000, () => this.clearTint());
    }
}