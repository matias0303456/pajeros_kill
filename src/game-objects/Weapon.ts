export class Weapon extends Phaser.Physics.Arcade.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'weapon');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable(true);
        this.setCollideWorldBounds(true);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.onWorldBounds = true;

        this.scene.events.on('update', this.update, this);
    }

    update() {
        if (!this.body) return;

        if (this.body.blocked.up ||
            this.body.blocked.down ||
            this.body.blocked.left ||
            this.body.blocked.right) {

            this.destroy();
        }
    }
}