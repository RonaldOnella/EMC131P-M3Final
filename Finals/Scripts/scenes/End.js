export default class endScene extends Phaser.Scene {
    constructor(){
        super('endScene');
    }

    init(data){
            console.log('init',data),
            this.finalScore = data.score;
    }
    preload(){

    }

    create(){
        this.cameras.main.fadeIn(1000, 0, 0, 0)
        this.add.text(255,250, 'Final Score:' + this.finalScore, {fontSize: '40px', fontStyle: 'bold', fill: '#ffffff' })
        this.add.text(175,100, ' Game Over ', {fontSize: '70px', fontStyle: 'bold', fill: '#ff0000' });
        let menu = this.add.text(100, 350, 'Main Menu', {fontSize: '40px', fill: '#ff0033'});
        menu.setInteractive({useHandCursor:true});
        menu.on('pointerdown', ()=> this.menuButton());
        
        let restart = this.add.text(550,350,'Restart', {fontSize:'40px', fill:'#ff0033'});
        restart.setInteractive({useHandCursor:true});
        restart.on('pointerdown',() => this.restartButton());


    }

    menuButton(){
        console.log("Loading Main Menu...");
        this.scene.start('menuScene');
    }

    restartButton(){
        console.log("Restarting...");
        this.scene.start('gameScene');
        
    }
        
    }
