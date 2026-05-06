var keySpace;

class Intro extends Phaser.Scene {
    constructor(){
        super({key : 'intro_scene'})
    }

    init(data){
    }

    preload(){
    console.log("Intro preload");
    this.load.image('first', 'assets/first_screen.png');
    

    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
   
    update(time, delta){
        if(keySpace.isDown){
        this.scene.switch('menu_scene');
        }
    }

    
}
export default Intro