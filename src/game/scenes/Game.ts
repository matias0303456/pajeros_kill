import { Scene } from 'phaser';

import { Player } from '../../game-objects/Player';
import { Enemy } from '../../game-objects/Enemy';
import { Weapon } from '../../game-objects/Weapon';

export class Game extends Scene {

    map: Phaser.Tilemaps.Tilemap;
    camera: Phaser.Cameras.Scene2D.Camera;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    enemies: Phaser.Physics.Arcade.Group;
    projectiles: Phaser.Physics.Arcade.Group;
    pickups: Phaser.Physics.Arcade.Group;

    player: Player;
    ammoText!: Phaser.GameObjects.Text;

    private scoreText!: Phaser.GameObjects.Text;

    constructor() {
        super('Game');
    }

    create() {
        this.cursors = this.input.keyboard?.createCursorKeys()!;

        this.setMapAndSprites();

        this.setCamera();

        this.scoreText = this.add.text(20, 20, 'Puntos: 0', {
            fontSize: '24px',
            color: '#ffffff'
        });

        this.ammoText = this.add.text(680, 20, 'Ammo: 0', {
            fontSize: '24px',
            color: '#ffffff'
        });
    }

    update() {
        this.player.move();

        if (Phaser.Input.Keyboard.JustDown(this.cursors?.shift)) {
            this.player.shoot(this);
        }
    }

    private setMapAndSprites() {
        this.map = this.make.tilemap({ key: 'level_1' });

        const roomImg = this.map.addTilesetImage('room', 'room');
        const furnitureImg = this.map.addTilesetImage('furniture', 'furniture');

        this.map.createLayer('base', roomImg!);
        this.map.createLayer('furniture', furnitureImg!);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        const collisionLayer = this.map.createLayer('collision', roomImg!);
        collisionLayer?.setCollisionByExclusion([-1]);
        collisionLayer?.setVisible(false);

        this.player = new Player(this, 400, 300, this.cursors);
        this.physics.add.collider(this.player, collisionLayer!);

        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        this.projectiles = this.physics.add.group({ classType: Weapon });
        this.physics.add.collider(this.projectiles, this.enemies, (projectile, enemy) => {
            projectile.destroy();
            enemy.destroy();
            this.player.incrementScore();
            this.scoreText.setText(`Puntos: ${this.player.getScore()}`);
        });
        this.pickups = this.physics.add.group({ classType: Weapon });
        this.spawnEnemies(collisionLayer);
        this.spawnWeapons();

        // this.debug(collisionLayer);
    }

    private spawnEnemies(collisionLayer: Phaser.Tilemaps.TilemapLayer | null) {
        const enemiesLayer = this.map.getObjectLayer('objects');
        setInterval(() => {
            const random = Phaser.Math.Between(1, 2);
            const object = enemiesLayer?.objects.find(obj => obj.name === `enemy_spawn_${random}`);
            const enemy = new Enemy(this, object?.x as number, object?.y as number, 'enemy_1', this.player);
            this.enemies.add(enemy);
            this.physics.add.collider(this.enemies, collisionLayer!);
            this.physics.add.collider(this.enemies, this.player, (_, playerObj) => {
                playerObj.destroy();
                this.scene.start('GameOver');
            });
        }, 10000);
    }

    private spawnWeapons() {
        const enemiesLayer = this.map.getObjectLayer('objects');
        if (this.pickups.children.size >= 4) return;
        setInterval(() => {
            const random = Phaser.Math.Between(1, 4);
            const object = enemiesLayer?.objects.find(obj => obj.name === `weapon_spawn_${random}`);
            const weapon = new Weapon(this, object?.x as number, object?.y as number);
            this.pickups.add(weapon);
        }, 5000);
        this.physics.add.overlap(this.player, this.pickups, (_, o2) => {
            this.player.incrementAmmo();
            o2.destroy();
            this.ammoText.setText(`Ammo: ${this.player.getAmmo()}`);
        }, undefined, this);
    }

    private setCamera() {
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.camera.setRoundPixels(true);
    }

    // private debug(collisionLayer: Phaser.Tilemaps.TilemapLayer | null) {
    //     this.physics.world.createDebugGraphic();
    //     collisionLayer!.renderDebug(this.add.graphics(), {
    //         tileColor: null,                 // tiles sin colisión
    //         collidingTileColor: new Phaser.Display.Color(255, 0, 0, 200), // rojo
    //         faceColor: new Phaser.Display.Color(0, 255, 0, 200)            // caras activas
    //     });
    // }
}
