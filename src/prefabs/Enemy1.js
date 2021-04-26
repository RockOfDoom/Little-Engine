class Enemy1 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add sprite to scene
        scene.physics.add.existing(this); //assign physics to sprite
        this.scene = scene; //save scene for tween purposes
        this.goingRight = false; //keeps track of which way enemy is walking
        this.ticker = 0; //internal timer
        this.walkSpeed = 2; //how fast the enemy can move
        this.totalSpeed = 0; //runSpeed from Play.js with this.walkSpeed either added or subtracted based on current direction
    }

    update(speed) {
        this.wander(speed);
        this.x -= this.totalSpeed;

        if(this.x < -this.width) {
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width + this.width + 10 * this.width;
    }

    wander(speed) { //create illusion of walking left and right
        if(this.goingRight && this.ticker == 0) { //walk right
            this.totalSpeed = speed - this.walkSpeed;
            this.flipX = true;
        } else if(!this.goingRight && this.ticker == 0) { //walk left
            this.totalSpeed = speed + this.walkSpeed;
            this.flipX = false;
        }

        if(this.ticker > 45) { //swap directions every 3/4 second
            this.goingRight = !this.goingRight;
            this.ticker = 0;
        }
        else { //keep track of time
            this.ticker++;
        }
    }
}