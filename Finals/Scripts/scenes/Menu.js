export default class menuScene extends Phaser.Scene {

    constructor(){
        super('menuScene');
    }

    preload(){
        this.load.image('backg', './assets/mapData/sky.png')
        this.load.atlas('hero','./assets/character/hero.png',' ./assets/character/hero.json');

    }

    create(){
        this.cameras.main.fadeIn(1000, 0, 0, 0)
        let bkg = this.add.image(0,0,'backg')


        this.hero = this.physics.add.sprite( 185,250,'hero', 0)
        this.hero.setScale(5)
        this.hero.enableBody = true;
        this.anims.create({
            key:'idleRight',
            frames: this.anims.generateFrameNames('hero',{
                start:1,
                end:18,
                zeroPad:0,
                prefix:'idle',
                suffix:'.png'
            }),
            frameRate: 12,
            repeat: -1
        })

        this.hero.play('idleRight');


        bkg.setDepth(-1);
        bkg.setOrigin(0);
        let start = this.add.text(350,250, 'Start Game', {fontSize: '40px', fill: '#FF00FF'});
        this.add.text(60,100, 'Red Hood',{fontSize:'60px',stroke: '#fff', strokeThickness: 3,  fontStyle: 'bold', fill: '#FF0000'});
        this.add.text(350,300, 'Controls:', {fontSize: '45px'})
        this.add.text(350,350, 'Movement = <-   ->',{fontSize:'40px'});
        this.add.text(350,400, 'Z = left Attack',{fontSize:'40px'});
        this.add.text(350,450, 'C = right Attack',{fontSize:'40px'});
        this.add.text(350,500, 'Space = jump',{fontSize:'40px'});
        
        start.setInteractive({useHandCursor: true});
        start.on('pointerdown', () => this.startButton());
    }

    startButton(){
        console.log("Game Start!");
        this.cameras.main.fadeOut(1000, 0, 0, 0)
        this.scene.start('gameScene');
        

    }




}


