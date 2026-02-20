export class Player extends Phaser.Physics.Arcade.Sprite {

    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    private direction = new Phaser.Math.Vector2(0, 1);

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined
    ) {
        super(scene, x, y, 'player_walk_down');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.cursors = cursors;

        this.setImmovable(true);
        this.setScale(2, 2);
        this.setCollideWorldBounds(true);
        this.setSize(20, 5);
        this.setOffset(5, 25);
    }

    move() {
        const speed = 150;

        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors?.left.isDown) {
            velocityX = -speed;
        }
        else if (this.cursors?.right.isDown) {
            velocityX = speed;
        }

        if (this.cursors?.up.isDown) {
            velocityY = -speed;
        }
        else if (this.cursors?.down.isDown) {
            velocityY = speed;
        }

        this.setVelocity(velocityX, velocityY);

        const body = this.body as Phaser.Physics.Arcade.Body;

        if (body.velocity.length() > 0) {
            body.velocity.normalize().scale(speed);

            this.direction
                .set(body.velocity.x, body.velocity.y)
                .normalize();
        }

        if (velocityX < 0) {
            this.anims.play('player_walk_left', true);
        }
        else if (velocityX > 0) {
            this.anims.play('player_walk_right', true);
        }
        else if (velocityY < 0) {
            this.anims.play('player_walk_up', true);
        }
        else if (velocityY > 0) {
            this.anims.play('player_walk_down', true);
        }
        else {
            this.anims.stop();
        }
    }
}