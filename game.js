var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var water;
var fire;
var cursor;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('water', 'assets/water.png');
    this.load.image('fire', 'assets/fire.png');
    this.load.image('cursor', 'assets/cursor.png');
}

function create ()
    {
        this.add.image(0,5, 'fire');
    }

function create ()
{
    water = this.physics.add.sprite(100, 450, 'water');
    water.setscale(0.5);
    fire = this.physics.add.sprite(200, 450, 'fire');
    fire.setscale(0.5);
    cursor = this.physics.add.sprite(300, 450, 'cursor');
    cursor.setscale(0.5);
}

function shootWater() {
    this.physics.accelerateToObject(water, cursor, 60, 200, 200);
}