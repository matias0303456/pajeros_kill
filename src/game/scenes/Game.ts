import { Scene } from 'phaser';

import { Player } from '../../game-objects/Player';
import { Enemy } from '../../game-objects/Enemy';

export class Game extends Scene {

    map: Phaser.Tilemaps.Tilemap;
    camera: Phaser.Cameras.Scene2D.Camera;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    player: Player;
    enemies: Enemy[] = [];

    constructor() {
        super('Game');
    }

    create() {
        this.cursors = this.input.keyboard?.createCursorKeys();

        this.setMapAndSprites();

        this.setCamera();

        // this.debug(collisionLayer);
    }

    update() {
        this.player.move();
        this.enemies.forEach(enemy => enemy.chase());
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

        this.spawnEnemies(collisionLayer);
    }

    private spawnEnemies(collisionLayer: Phaser.Tilemaps.TilemapLayer | null) {
        const enemiesLayer = this.map.getObjectLayer('enemies');
        setInterval(() => {
            const random = Phaser.Math.Between(1, 2);
            const object = enemiesLayer?.objects.find(obj => obj.name === `enemy_spawn_${random}`);
            const enemy = new Enemy(this, object?.x as number, object?.y as number, 'enemy_1', this.player);
            this.enemies.push(enemy);
            this.physics.add.collider(enemy, collisionLayer!);
            this.physics.add.collider(this.player, enemy);
        }, 10000);
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
