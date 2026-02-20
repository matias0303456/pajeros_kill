import { Scene } from 'phaser';

import { Player } from '../../game-objects/Player';
import { Enemy } from '../../game-objects/Enemy';
import { Weapon } from '../../game-objects/Weapon';

export class Game extends Scene {

    map: Phaser.Tilemaps.Tilemap;
    camera: Phaser.Cameras.Scene2D.Camera;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    enemies: Phaser.Physics.Arcade.Group;
    weapons: Phaser.Physics.Arcade.Group;

    player: Player;

    constructor() {
        super('Game');
    }

    create() {
        this.cursors = this.input.keyboard?.createCursorKeys()!;

        this.setMapAndSprites();

        this.setCamera();
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
        this.weapons = this.physics.add.group({ classType: Weapon, runChildUpdate: true });
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
                this.scene.stop();
            });
        }, 10000);
    }

    private spawnWeapons() {
        const enemiesLayer = this.map.getObjectLayer('objects');
        setInterval(() => {
            if (this.weapons.children.size >= 4) return;
            const random = Phaser.Math.Between(1, 4);
            const object = enemiesLayer?.objects.find(obj => obj.name === `weapon_spawn_${random}`);
            const weapon = new Weapon(this, object?.x as number, object?.y as number);
            this.weapons.add(weapon);
            this.physics.add.collider(this.weapons, this.enemies, (weaponObj, enemyObj) => {
                weaponObj.destroy();
                enemyObj.destroy();
            }
            );
            this.physics.add.collider(this.weapons, this.player, () => {
                this.player.incrementAmmo();
                weapon.destroy();
            });
        }, 5000);
    }

    private setCamera() {
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.camera.startFollow(this.player, true, 0.1, 0.1);
        this.camera.setZoom(1.5);
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
