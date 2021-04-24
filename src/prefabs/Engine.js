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
        //define variables that track the current action the engine is performing
        this.running = true;
        this.attacking = false;
        this.damaging = false;
        this.jumping = false;
        this.airborne = false;
        this.landing = false;
        this.hurting = false;
    }

    update(speed, gas, frame) {
        this.x = borderUISize + 5 * speed; //change position on screen based on speed

        if(this.attacking) { //attacking halts falling or jumping
            this.setVelocity(0,0);
        }

        if(this.jKey.isDown && !this.airborne) { //jump when jump input is recieved
            console.log("jump initiated");
            this.jump();
        }

        if(Phaser.Input.Keyboard.JustDown(this.aKey) && !this.hurting && !this.attacking) { //attack when attack input is recieved
            this.attack();
        }
    }

    jump() {
        this.jumping = true;
        this.scene.time.delayedCall(25, () => {this.jumping = false;});
        this.airborne = true;
        this.setVelocity(0, -200);
        this.jumpSFX.play();
        console.log("jump executed");
    }

    land() {
        this.landing = true;
        this.airborne = false;
        console.log(this.airborne);
    }

    attack() {
        this.attacking = true;
        this.scene.time.delayedCall(250, () => {
            if(!this.hurting) {
                this.damaging = true;
            }});
        this.scene.time.delayedCall(375, () => {this.damaging = false;});
        this.scene.tweens.add({
            targets: [this],
            scale: {from: 1, to: 0.5},
            duration: 250
        });
        this.scene.time.delayedCall(250, () => {
            if(!this.hurting) {
                this.scene.tweens.add({
                    targets: [this],
                    scale: {from: 0.5, to: 2},
                    duration: 125});
            }
        });
        this.scene.time.delayedCall(375, () => {this.scene.tweens.add({
                targets: [this],
                scale: {from: 2, to: 1},
                duration: 75});
            this.attacking = false;
        });
    }

    getHurt() {
        this.hurting = true;
        this.scene.time.delayedCall(500, () => {this.hurting = false;});
    }
}