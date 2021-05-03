class Fuel extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add sprite to scene
        scene.physics.add.existing(this); //assign physics to sprite
        this.body.setImmovable(); //prevent from falling
        this.revvSFX = scene.sound.add("engineRev");
        this.time = 0;
        this.initialY = y;
    }

    update() {
        this.x -= speed;

        if(this.x < -this.width) {
            this.destroy();
        }
        this.time++;
        this.y = Math.round(Math.sin(this.time/20) * 4 + this.initialY);
    }

    use() {
        this.revvSFX.play();
        this.destroy();
    }
}