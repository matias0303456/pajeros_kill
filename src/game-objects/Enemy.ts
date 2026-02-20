import { Player } from "./Player";

export class Enemy extends Phaser.Physics.Arcade.Sprite {

    player: Player;
    name: string;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        name: string,
        player: Player
    ) {
        super(scene, x, y, `${name}_walk_down`);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.player = player;
        this.name = name;

        this.setImmovable(true);
        this.setScale(2, 2);
        this.setCollideWorldBounds(true);
        this.setSize(20, 5);
        this.setOffset(5, 25);
    }

    chase() {
        this.scene.physics.moveToObject(this, this.player, 80);

        const vx = this.body?.velocity.x ?? 0;
        const vy = this.body?.velocity.y ?? 0;

        // Si está prácticamente quieto, no animar
        if (Math.abs(vx) < 1 && Math.abs(vy) < 1) {
            this.setVelocity(0, 0);
            return;
        }

        // Elegimos eje dominante
        if (Math.abs(vx) > Math.abs(vy)) {
            // Movimiento horizontal domina
            if (vx > 0) {
                this.playAnim('right');
            } else {
                this.playAnim('left');
            }
        } else {
            // Movimiento vertical domina
            if (vy > 0) {
                this.playAnim('down');
            } else {
                this.playAnim('up');
            }
        }
    }

    private playAnim(direction: 'up' | 'down' | 'left' | 'right') {
        const key = `${this.name}_walk_${direction}`;

        if (this.anims.currentAnim?.key !== key) {
            this.anims.play(key, true);
        }
    }
}
