class Credits extends Phaser.Scene {
    constructor(){
        super({key : 'credits_scene'})
    }

    init(data){
    }

    preload(){
    }

    create(data){
        this.add.text(400, 100, 'Credits', { fontSize: '60px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 170, 'Developed by: Benjamin', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 200, 'By Fire House Studios', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        
        this.add.text(400, 500, 'Press ESC to return to the menu', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    
    
    }

    update(time, delta){
        if(time > 5000){
        this.scene.switch('intro_scene');
    }
    }
}
export default Credits