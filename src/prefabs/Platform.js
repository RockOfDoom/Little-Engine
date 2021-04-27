class Platform extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add sprite to scene
        scene.physics.add.existing(this); //assign physics to sprite
        this.body.setImmovable(); //prevent from falling
        //configure hitbox
        this.body.setSize(78, 10, true);
        this.body.setOffset(0, 10);
    }

    update() {
        this.x -= speed;

        if(this.x < -this.width) {
            this.destroy();
        }
    }
}