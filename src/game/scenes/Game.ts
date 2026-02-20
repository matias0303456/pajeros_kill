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
    private ammoUI!: Phaser.GameObjects.Container;
    private ammoIcon!: Phaser.GameObjects.Image;
    private ammoText!: Phaser.GameObjects.Text;

    private scoreText!: Phaser.GameObjects.Text;

    constructor() {
        super('Game');
    }

    create() {
        this.cursors = this.input.keyboard?.createCursorKeys()!;

        this.setMapAndSprites();

        this.setUI();

        this.setCamera();
    }

    update() {
        this.player.move();

        if (Phaser.Input.Keyboard.JustDown(this.cursors?.shift)) {
            this.player.shoot(this);
            this.ammoText.setText(String(this.player.getAmmo()));
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
        this.time.addEvent({
            delay: 7000,
            callback: () => {
                const random = Phaser.Math.Between(1, 2);
                const object = enemiesLayer?.objects.find(obj => obj.name === `enemy_spawn_${random}`);
                const enemy = new Enemy(this, object?.x as number, object?.y as number, 'enemy_1', this.player);
                this.enemies.add(enemy);
                this.physics.add.collider(this.enemies, collisionLayer!);
                this.physics.add.collider(this.enemies, this.player, (_, playerObj) => {
                    playerObj.destroy();
                    this.scene.start('GameOver');
                });
            },
            callbackScope: this,
            loop: true
        });
    }

    private spawnWeapons() {
        const enemiesLayer = this.map.getObjectLayer('objects');
        if (this.pickups.children.size >= 4) return;
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                const random = Phaser.Math.Between(1, 4);
                const object = enemiesLayer?.objects.find(obj => obj.name === `weapon_spawn_${random}`);
                const weapon = new Weapon(this, object?.x as number, object?.y as number);
                this.pickups.add(weapon);
            },
            callbackScope: this,
            loop: true
        });
        this.physics.add.overlap(this.player, this.pickups, (_, o2) => {
            this.player.incrementAmmo();
            o2.destroy();
            this.ammoText.setText(String(this.player.getAmmo()));
        }, undefined, this);
    }

    private setUI() {
        this.scoreText = this.add.text(150, 125, 'Puntos: 0', {
            fontSize: '24px',
            color: '#ffffff'
        });

        this.scoreText.setScrollFactor(0);

        this.ammoIcon = this.add.image(550, 90, 'weapon');
        this.ammoIcon.setOrigin(0, 0);
        this.ammoIcon.setScale(1.5)

        this.ammoText = this.add.text(610, 104, '0', {
            fontSize: '24px',
            color: '#ffffff'
        });

        this.ammoUI = this.add.container(20, 20, [
            this.ammoIcon,
            this.ammoText
        ]);

        this.ammoUI.setScrollFactor(0);
    }

    private setCamera() {
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.camera.setRoundPixels(true);
        this.camera.setZoom(1.5);
        this.camera.startFollow(this.player, true, 0.1, 0.1)
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
