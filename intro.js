var keySpace;
var keyC;

class Intro extends Phaser.Scene {
    constructor(){
        super({key : 'intro_scene'})
    }

    init(data){
    }

    preload(){
    console.log("Intro preload");
    this.load.image('first', 'assets/first_screen.png');
    this.add.text(400, 300, 'Press SPACE to Continue', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    this.add.text(400, 350, 'Press c to see the credits', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    

    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    }
    
    update(time, delta){
        if(keySpace.isDown){
        this.scene.switch('menu_scene');
        }
        if(keyC.isDown){
        this.scene.switch('credits_scene');
        }
        // if(time > 3000){
        //     this.scene.switch('menu_scene');
        // }
        
    }

    
}
export default Intro