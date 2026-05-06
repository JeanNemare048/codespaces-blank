class Intro extends Phaser.Scene {
    constructor(){
        super({key : 'intro_scene'})
    }

    init(data){
    }

    preload(){
    console.log("Intro preload");
    this.load.image('first', 'assets/first_screen.png');
    }

    update(time, delta){
    if(time > 3000){
        this.scene.switch('titre_scene');
    }
    }
}
export default Intro