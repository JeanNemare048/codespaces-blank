import Menu from './menu.js';
import Game1 from './game1.js';
import Game2 from './game2.js';
import Game3 from './game3.js';
import Titre from './Intro.js';

const intro_scene = new Menu();
const titre_scene = new Titre();
const game_scene_1 = new Game1();
const game_scene_2 = new Game2();
const game_scene_3 = new Game3();

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
                gravity: { y: 300 },
                debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

game.scene.add('intro_scene', intro_scene);
game.scene.add('titre_scene', titre_scene);
game.scene.add('game_scene_1', game_scene_1);
game.scene.add('game_scene_2', game_scene_2);
game.scene.add('game_scene_3', game_scene_3);

game.scene.start('intro_scene');