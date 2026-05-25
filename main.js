import Intro from './intro.js'
import Menu from './menu.js'
import Credits from './credits.js'
import Game1 from './game1.js'
import Game2 from './game2.js'
import Game3 from './game3.js'

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
    scene: []
};

var game = new Phaser.Game(config);

game.scene.add('intro_scene', Intro);
game.scene.add('credits_scene', Credits);
game.scene.add('menu_scene', Menu);
game.scene.add('game_scene_1', Game1);
game.scene.add('game_scene_2', Game2);
game.scene.add('game_scene_3', Game3);

game.scene.start('intro_scene');