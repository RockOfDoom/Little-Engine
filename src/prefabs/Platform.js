class Platform extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add sprite to scene
        scene.physics.add.existing(this); //assign physics to sprite
        this.body.setImmovable(); //prevent from falling
        //configure hitbox
        this.body.setSize(234, 30, true);
        this.body.setOffset(0, 30);
        //save scene so platform can spawn objects
        this.scene = scene;
        this.hasSpawned = false; //ensures item spawning is only performed once
        this.enemyTop = false; //keeps track of if there is an enemy on top of the platform
    }

    update() {
        this.x -= speed;

        if(!this.hasSpawned) {
            this.spawnItems();
        }

        if(this.x < -this.width) {
            this.destroy();
        }
    }

    spawnItems() {
        if(Math.random() >= 0.5) { //50/50 shot of fuel spawn
            this.scene.fuelGroup.add(new Fuel(
                this.scene, 
                this.x, 
                this.y-6, 
                "fuel", 
                0).setOrigin(0.5,0));
        }
        else if(Math.random() >= 0.5) { //if no fuel, 50/50 shot of enemy spawn
            this.scene.spawnEnemy1(this.x + this.width / 4, this.y + 0.95 * borderUISize);
            this.enemyTop = true;
        }

        if(!this.enemyTop && Math.random() >= 0.5) { //if there isn't already an enemy on top, 50/50 shot of spawning enemy below
            this.scene.spawnEnemy1(this.x + this.width / 4, game.config.height - 1.62 * borderUISize);
        }
        else if(Math.random() >= 0.75) { //if no enemy spawned below, ~25% of spawning obstacle
            this.scene.spawnObstacle(this.x);
        }

        this.hasSpawned = true;
    } 
}