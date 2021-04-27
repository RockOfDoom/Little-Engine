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
        this.jumpHeight = 225;
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
    }

    update(gas, frame) {
        //change position on screen based on speed
        if(speed == loSpeed && this.x != borderUISize + this.width / 2 && this.tweening != 1) {
            this.tweening = 1;
            this.scene.time.delayedCall(3000, () => {
                this.tweening = 0;
            });
            this.scene.tweens.add({
                targets: [this],
                x: {from: this.x, to: borderUISize + this.width / 2},
                duration: 3000,
            });
        } else if(speed == midSpeed && this.x != borderUISize * 2 + this.width / 2 && this.tweening != 2) {
            this.tweening = 2;
            this.scene.time.delayedCall(3000, () => {
                this.tweening = 0;
            });
            this.sc
            this.scene.tweens.add({
                targets: [this],
                x: {from: this.x, to: borderUISize * 2 + this.width / 2},
                duration: 3000,
            });
        } else if(speed == hiSpeed && this.x != borderUISize * 3 + this.width / 2 && this.tweening != 3) {
            this.tweening = 3;
            this.scene.time.delayedCall(3000, () => {
                this.tweening = 0;
            });
            this.sc
            this.scene.tweens.add({
                targets: [this],
                x: {from: this.x, to: borderUISize * 3 + this.width / 2},
                duration: 3000,
            });
        }

        if(this.attacking) { //attacking halts falling or jumping
            this.setVelocity(0,0);
        }

        if(this.airborne && this.body.speed == 0) { //fall faster after apex of jump is reached
            this.setGravityY(this.jumpHeight * 3);
        }

        if(this.jKey.isDown) { //jump when jump input is recieved
            // console.log("jump initiated");
            this.jump();
        }

        if(Phaser.Input.Keyboard.JustDown(this.aKey) && !this.hurting && !this.attacking) { //attack when attack input is recieved
            this.attack();
        }
    }

    jump() {
        if(!this.airborne) {
            this.jumping = true;
            this.scene.time.delayedCall(25, () => {this.jumping = false;});
            this.airborne = true;
            this.setVelocity(0, -this.jumpHeight);
            this.jumpSFX.play();
        }
        // else if(this.jumping) {
        //     this.addVelocity(0, -1);
        // }
        // console.log("jump executed");
    }

    land() {
        this.landing = true;
        this.airborne = false;
        this.setGravityY(this.jumpHeight);
        // console.log(this.airborne);
    }

    attack() {
        this.attacking = true;
        this.scene.tweens.add({
            targets: [this],
            scale: {from: 1, to: 0.5},
            duration: 250
        });
        this.scene.time.delayedCall(250, () => {
            if(!this.hurting) {
                this.damaging = true;
                this.atkSFX.play();
                this.scene.tweens.add({
                    targets: [this],
                    scale: {from: 0.5, to: 1.5},
                    duration: 125});
            }});
        this.scene.time.delayedCall(500, () => {
            this.scene.tweens.add({
                targets: [this],
                scale: {from: 1.5, to: 1},
                duration: 75});
            this.attacking = false;
            this.damaging = false;
        });
    }

    getHurt() {
        this.hurting = true;
        this.hurtSFX.play();
        this.scene.time.delayedCall(1000, () => {this.hurting = false;});
    }
}