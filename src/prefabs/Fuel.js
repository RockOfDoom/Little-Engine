class Fuel extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add sprite to scene
        scene.physics.add.existing(this); //assign physics to sprite
        this.body.setImmovable(); //prevent from falling
        this.revvSFX = scene.sound.add("engineRev");
    }

    update() {
        this.x -= speed;

        if(this.x < -this.width) {
            this.destroy();
        }
    }

    use() {
        this.revvSFX.play();
        this.destroy();
    }
}