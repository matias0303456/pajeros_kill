import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets/exported');

        this.load.tilemapTiledJSON('level_1', 'tilemaps/level_1.tmj');
 
        this.load.image('room', 'tilesets/room.png');
        this.load.image('furniture', 'tilesets/furniture.png');

        this.load.spritesheet('player_walk_up', 'spritesheets/player_walk_up.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player_walk_down', 'spritesheets/player_walk_down.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player_walk_right', 'spritesheets/player_walk_right.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player_walk_left', 'spritesheets/player_walk_left.png', { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('enemy_1_walk_up', 'spritesheets/enemy_1_walk_up.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('enemy_1_walk_down', 'spritesheets/enemy_1_walk_down.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('enemy_1_walk_right', 'spritesheets/enemy_1_walk_right.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('enemy_1_walk_left', 'spritesheets/enemy_1_walk_left.png', { frameWidth: 32, frameHeight: 32 });
        
        this.load.spritesheet('weapon', 'spritesheets/weapon.png', { frameWidth: 32, frameHeight: 32 });

    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        this.anims.create({
            key: 'player_walk_up',
            frames: this.anims.generateFrameNumbers('player_walk_up'),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'player_walk_down',
            frames: this.anims.generateFrameNumbers('player_walk_down'),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'player_walk_right',
            frames: this.anims.generateFrameNumbers('player_walk_right'),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'player_walk_left',
            frames: this.anims.generateFrameNumbers('player_walk_left'),
            frameRate: 8,
            repeat: -1
        })

        this.anims.create({
            key: 'enemy_1_walk_up',
            frames: this.anims.generateFrameNumbers('enemy_1_walk_up'),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy_1_walk_down',
            frames: this.anims.generateFrameNumbers('enemy_1_walk_down'),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy_1_walk_right',
            frames: this.anims.generateFrameNumbers('enemy_1_walk_right'),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy_1_walk_left',
            frames: this.anims.generateFrameNumbers('enemy_1_walk_left'),
            frameRate: 8,
            repeat: -1
        })

        //  Move to the Game. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Game');
    }
}
