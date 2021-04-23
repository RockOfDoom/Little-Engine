class Engine extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, attackKey, jumpKey) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add sprite to scene
        scene.physics.add.existing(this); //assign physics to sprite
        //load input keys
        this.aKey = attackKey;
        this.jKey = jumpKey;
        //define variables that track the current action the engine is performing
        this.running = true;
        this.attacking = false;
        this.jumping = false;
        this.airborne = false;
        this.landing = false;
        this.hurting = false;
    }

    update(speed, gas, frame) {
        this.x = borderUISize + 5 * speed;

        if(this.jKey.isDown && !this.airborne) {
            console.log("jump initiated");
            this.jump();
        }
    }

    jump() {
        this.jumping = true;
        this.airborne = true;
        this.setVelocity(0, -100);
        console.log("jump executed");
    }

    land() {
        this.landing = true;
        this.airborne = false;
        console.log(this.airborne);
    }

    attack() {}
}