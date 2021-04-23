class Engine extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.running = true;
        this.attacking = false;
        this.jumping = false;
        this.airborne = false;
        this.landing = false;
        this.hurting = false;
    }

    update() {}

    jump() {}

    attack() {}
}