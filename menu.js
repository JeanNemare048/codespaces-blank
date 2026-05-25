var bg;

class Menu extends Phaser.Scene {
    constructor(){
        super({key : 'menu_scene'})
    }

    init(data){
    }

    preload(){
        this.load.image('first_screen', 'assets/first_screen.png');
    }

create(data){
bg = this.add.image(0, 0, 'first_screen');
bg.setScale(1);
bg.setOrigin(0,0);

this.keyOne = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
this.keyTwo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
this.keyThree = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
this.add.text(400, 150, 'Press 1, 2 or 3 to start the corresponding difficulty', { fontSize: '24px', fill: '#000000', stroke: '#999999', strokeThickness: 4 }).setOrigin(0.5);
}
    update(time, delta){
        if(this.keyOne.isDown){
            this.scene.switch('game_scene_1');
        }
        if(this.keyTwo.isDown){
            this.scene.switch('game_scene_2');
        }
        if(this.keyThree.isDown){
            this.scene.switch('game_scene_3');
        }
    }
}
export default Menu