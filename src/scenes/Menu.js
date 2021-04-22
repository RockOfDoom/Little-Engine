class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    init() {}

    preload() {}

    create() {
        this.scene.start("playScene");
    }

    update() {}
}