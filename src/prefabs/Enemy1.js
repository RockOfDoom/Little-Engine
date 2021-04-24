class Enemy1 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add sprite to scene
        scene.physics.add.existing(this); //assign physics to sprite
    }

    update(speed) {
        this.x -= speed;

        if(this.x < -this.width) {
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width + this.width;
    }
}