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
bg.setOrigin(0,0);

this.keyOne = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
this.keyTwo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
this.keyThree = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
}

updateModeDisplay()
{
    var display = document.getElementById('modeDisplay');
    var modeText = "press 1, 2 or 3 to start the corresponding difficulty";
    var color = 'white';
    
    display.innerHTML = `Mode: <span style="color: ${color}; font-weight: bold;">${modeText}</span><br>Press M to toggle`;
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