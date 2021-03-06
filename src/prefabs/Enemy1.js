class Enemy1 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add sprite to scene
        scene.physics.add.existing(this); //assign physics to sprite
        //configure hitbox
        this.body.setSize(40, 50, true);
        this.body.setOffset(1, 14);
        this.setGravityY(900); //give gravity
        this.anims.play("enemy1Run"); //play running animation
        this.scene = scene; //save scene for tween purposes
        //create particle manager for enemy death particles
        this.particles = this.scene.add.particles("spark");
        this.goingRight = false; //keeps track of which way enemy is walking
        this.ticker = 0; //internal timer
        this.walkSpeed = 2; //how fast the enemy can move
        this.totalSpeed = 0; //runSpeed from Play.js with this.walkSpeed either added or subtracted based on current direction
    }

    update() {
        this.wander();
        this.x -= this.totalSpeed;

        if(this.x < -this.width) {
            this.die();
        }
    }

    wander() { //create illusion of walking left and right
        if(this.goingRight && this.ticker == 0) { //walk right
            this.totalSpeed = speed - this.walkSpeed;
            this.flipX = true;
            this.body.setOffset(10, 14);
        } else if(!this.goingRight && this.ticker == 0) { //walk left
            this.totalSpeed = speed + this.walkSpeed;
            this.flipX = false;
            this.body.setOffset(5, 14);
        }

        if(this.ticker > 45) { //swap directions every 3/4 second
            this.goingRight = !this.goingRight;
            this.ticker = 0;
        }
        else { //keep track of time
            this.ticker++;
        }
    }

    die() { //play death animation, and then destroy this enemy
        this.emitter = this.particles.createEmitter({
            x: this.x,
            y: this.y - (this.height / 2),
            speed: 400,
            lifespan: {min: 125, max: 250}
        });
        this.scene.time.delayedCall(250, () => {
            this.particles.destroy();
        })
        this.destroy();
    }
}