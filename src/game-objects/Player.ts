import { Scene } from "phaser";
import { Weapon } from "./Weapon";

export class Player extends Phaser.Physics.Arcade.Sprite {

    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    private facingDirection: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 1); // mirando hacia abajo por defecto
    private ammo: number = 0;
    private score: number = 0;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined
    ) {
        super(scene, x, y, 'player_walk_down');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.cursors = cursors!;

        this.setImmovable(true);
        this.setScale(3, 3);
        this.setCollideWorldBounds(true);
        this.setSize(20, 5);
        this.setOffset(5, 25);
    }

    move() {
        const speed = 150;

        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors?.left.isDown) velocityX = -speed;
        if (this.cursors?.right.isDown) velocityX = speed;
        if (this.cursors?.up.isDown) velocityY = -speed;
        if (this.cursors?.down.isDown) velocityY = speed;

        this.setVelocity(velocityX, velocityY);

        const body = this.body as Phaser.Physics.Arcade.Body;

        if (body.velocity.length() > 0) {
            body.velocity.normalize().scale(speed);

            // 🔥 ACTUALIZAMOS SIEMPRE LA DIRECCIÓN REAL
            this.facingDirection.set(
                body.velocity.x,
                body.velocity.y
            ).normalize();
        }

        // 🎬 Animaciones (independientes de la dirección real)
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

    shoot(scene: Scene & { projectiles: Phaser.Physics.Arcade.Group, ammoText: Phaser.GameObjects.Text }) {
        if (this.ammo <= 0) return;

        const weapon = new Weapon(scene, this.x, this.y);
        scene.projectiles.add(weapon);

        const speed = 500;
        const dir = this.facingDirection.clone();

        weapon.setVelocity(dir.x * speed, dir.y * speed);

        this.decrementAmmo();
        scene.ammoText.setText(`Ammo: ${this.getAmmo()}`);
    }

    incrementAmmo() {
        this.ammo++;
    }

    decrementAmmo() {
        this.ammo--;
    }

    getAmmo() {
        return this.ammo;
    }

    incrementScore() {
        this.score += 10;
    }

    getScore() {
        return this.score;
    }
}