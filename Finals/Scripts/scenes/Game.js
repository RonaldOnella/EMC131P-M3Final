let gameOptions = {
    playerGravity: 800,
    playerSpeed: 160,
    ghostSpeedX: 60,
    ghostSpeedY: 60,
    ghostminSpeed : 40,
    ghostmaxSpeed : 60
}


export default class gameScene extends Phaser.Scene {
    constructor() {
        super('gameScene');
    }

preload(){

    this.load.tilemapTiledJSON('tileMap', 'map.json');
    this.load.image('grounds', './assets/mapData/ForestGround.png');
    this.load.image('tree', './assets/mapData/Trees.png');
    this.load.image('mtbkg','./assets/mapData/groundbkg.png');
    this.load.image('skybkg','./assets/mapData/sky.png');
    this.load.image('props','./assets/mapData/ForestAssets.png');
    this.load.atlas('hero','./assets/character/hero.png',' ./assets/character/hero.json');
    this.load.atlas('hero1',  './assets/character/jump.png',' ./assets/character/jump.json')
    this.load.atlas('hero2', './assets/character/atk.png','./assets/character/atk.json');
    this.load.image('atkhold', './assets/character/atkholder.png');
    this.load.atlas('ghost', './assets/enemy/ghost.png','./assets/enemy/ghost.json');
    this.load.audio('slash', './assets/sounds/slash.wav');
    this.load.audio('wind', './assets/sounds/wind.wav');
    
    
}

create(){
    this.cameras.main.fadeIn(1000, 0, 0, 0)

    this.lock = false;

    //character Anims
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

    this.anims.create({
        key:'idleLeft',
        frames: this.anims.generateFrameNames('hero',{
            start:1,
            end:18,
            zeroPad:0,
            prefix:'Lidle',
            suffix:'.png'
        }),
        frameRate: 12,
        repeat: -1
    })
    
    this.anims.create({
        key:'Right',
        frames: this.anims.generateFrameNames('hero',{
            start:1,
            end:24,
            zeroPad:0,
            prefix:'runr',
            suffix:'.png'
        }),
        frameRate: 15,
        repeat: -1
    })

    this.anims.create({
        key:'Left',
        frames: this.anims.generateFrameNames('hero',{
            start:1,
            end:24,
            zeroPad:0,
            prefix:'runl',
            suffix:'.png'
        }),
        frameRate: 15,
        repeat: -1
    })
    this.anims.create({
        key:'jumpRight',
        frames: this.anims.generateFrameNames('hero1',{
            start:1,
            end:19,
            zeroPad:0,
            prefix:'jumpr',
            suffix:'.png'
        }),
        frameRate: 19   ,
        repeat: 0
    })
    this.anims.create({
        key:'atkLeft',
        frames: this.anims.generateFrameNames('hero2',{
            start:1,
            end:15,
            zeroPad:0,
            prefix:'atkl',
            suffix:'.png'
        }),
        frameRate: 24,
        repeat: 0
    })

    this.anims.create({
        key:'atkRight',
        frames: this.anims.generateFrameNames('hero2',{
            start:1,
            end:15,
            zeroPad:0,
            prefix:'atkr',
            suffix:'.png'
        }),
        frameRate: 24,
        repeat: 0
    })

    //sound
    this.blade = this.sound.add('slash');
    this.bkgSound = this.sound.add('wind');

    this.soundConfig = {
        volume: 0.5,
        rate:1,
        loop: true
    }
    this.bkgSound.play(this.soundConfig);

    //enemy anim
    this.anims.create({
        key:'ghostLeft',
        frames: this.anims.generateFrameNames('ghost',{
            start:1,
            end:3,
            zerPad:0,
            prefix:'left',
            suffix:'.png'

        }),
        frameRate:5,
        repeat:-1

    })

    this.anims.create({
        key:'ghostRight',
        frames: this.anims.generateFrameNames('ghost',{
            start:1,
            end:3,
            zerPad:0,
            prefix:'right',
            suffix:'.png'

        }),
        frameRate:5,
        repeat:-1

    })

    //call tilemap
    this.map = this.make.tilemap({
        key: 'tileMap'
    });
    //bkg
    let props = this.map.addTilesetImage('props', 'props')
    let treebkg = this.map.addTilesetImage('Trees', 'tree');

    let sky = this.map.addTilesetImage('sky','skybkg');
    this.skylayer = this.map.createLayer('skybkg', sky);

    let bkg1 = this.map.addTilesetImage('groundbkg','mtbkg');
    this.mtlayer2 = this.map.createLayer('groundbkg2',bkg1);
    this.mtlayer1 = this.map.createLayer('groundbkg',bkg1);

    //bkg foliage
    this.treeLayer1 = this.map.createLayer('TreeBackground', treebkg);
    this.propsLayer1 = this.map.createLayer('propsBkg', props);
    

    //Character
    this.hero = this.physics.add.sprite( 45,498,'hero', 0)
    this.hero.enableBody = true;
    this.hero.play('idleRight');
    this.hero.body.gravity.y = gameOptions.playerGravity;
    
    
    //attack hitbox
    this.lefthold = this.physics.add.sprite(27 , 496, 'atkhold');
    this.lefthold.setSize(7,33);
    this.lefthold.enableBody = true;
    

    this.righthold = this.physics.add.sprite(63 , 496, 'atkhold');
    this.righthold.setSize(7,33);
    this.righthold.enableBody = true;

    //enemy
    
    this.ghost1 = this.physics.add.sprite((Phaser.Math.Between(50,650)),(Phaser.Math.Between(0,408)),'ghost', 0)
    this.ghost2 = this.physics.add.sprite((Phaser.Math.Between(50,650)),(Phaser.Math.Between(0,408)),'ghost', 0)
    this.ghost3 = this.physics.add.sprite((Phaser.Math.Between(50,650)),(Phaser.Math.Between(0,408)),'ghost', 0)

    //score
    this.killCount = 0;
    this.killText = this.add.text(225,175, 'Kill Count:' + this.killCount,{fontSize: '20px'})
    this.killText.setDepth(5);
    this.killText.setScrollFactor(0);
    
   


    //Ground
    let tileFloor = this.map.addTilesetImage('ground','grounds');
    this.floorLayer = this.map.createLayer('ground',tileFloor);
    this.map.setCollisionBetween(1,999, true, this.floorLayer);
    
    //Foreground foliage
    this.treeLayer2 = this.map.createLayer('TreeForeground', treebkg);
    this.propsLayer1 = this.map.createLayer('propsForeground', props);


    //keys
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyz = this.input.keyboard.addKey('z');
    this.keyc = this.input.keyboard.addKey('c');

    //cameras
    this.cameras.main.setBounds(0,0,800,608);
    this.cameras.main.setZoom(2);
    this.cameras.main.startFollow(this.hero);
    this.cameras.main.setDeadzone(30,30);

    this.physics.add.collider(this.hero, this.floorLayer)
    this.physics.add.collider(this.hero, this.ghost1,this.death,null,this)
    this.physics.add.collider(this.hero, this.ghost2,this.death,null,this)
    this.physics.add.collider(this.hero, this.ghost3,this.death,null,this)
    
    
    this.hero.setCollideWorldBounds(true);

    


    this.hero.on('animationcomplete', this.unlock.bind(this));
}

unlock (){
    this.lock = false;
}

death(){
    this.scene.start('endScene', {score: this.killCount});
    return false;
}




update(){

    if (this.ghost1.body.position.x < this.hero.body.position.x){
        this.ghost1.play('ghostRight',true);
    }
    else if (this.ghost1.body.position.x > this.hero.body.position.x){
        this.ghost1.play('ghostLeft',true);
    }
    this.trackX = this.hero.body.position.x - this.ghost1.body.position.x;
    this.trackY = this.hero.body.position.y - this.ghost1.body.position.y;
    if (Math.abs(this.trackX) < 800) {
        this.ghost1.body.setVelocityX(Math.sign(this.trackX) * Phaser.Math.FloatBetween(gameOptions.ghostminSpeed, gameOptions.ghostmaxSpeed));
    }
    if (Math.abs(this.trackY) < 608) {
        this.ghost1.body.setVelocityY(Math.tanh(this.trackY) * Phaser.Math.FloatBetween(gameOptions.ghostminSpeed, gameOptions.ghostmaxSpeed));
    };

    if (this.ghost2.body.position.x < this.hero.body.position.x){
        this.ghost2.play('ghostRight',true);
    }
    else if (this.ghost2.body.position.x > this.hero.body.position.x){
        this.ghost2.play('ghostLeft',true);
    }
    this.trackX = this.hero.body.position.x - this.ghost2.body.position.x;
    this.trackY = this.hero.body.position.y - this.ghost2.body.position.y;
    if (Math.abs(this.trackX) < 800) {
        this.ghost2.body.setVelocityX(Math.sign(this.trackX) * Phaser.Math.FloatBetween(gameOptions.ghostminSpeed, gameOptions.ghostmaxSpeed));
    }
    if (Math.abs(this.trackY) < 608) {
        this.ghost2.body.setVelocityY(Math.tanh(this.trackY) * Phaser.Math.FloatBetween(gameOptions.ghostminSpeed, gameOptions.ghostmaxSpeed));
    };

    if (this.ghost3.body.position.x < this.hero.body.position.x){
        this.ghost3.play('ghostRight',true);
    }
    else if (this.ghost3.body.position.x > this.hero.body.position.x){
        this.ghost3.play('ghostLeft',true);
    }
    this.trackX = this.hero.body.position.x - this.ghost3.body.position.x;
    this.trackY = this.hero.body.position.y - this.ghost3.body.position.y;
    if (Math.abs(this.trackX) < 800) {
        this.ghost3.body.setVelocityX(Math.sign(this.trackX) * Phaser.Math.FloatBetween(gameOptions.ghostminSpeed, gameOptions.ghostmaxSpeed));
    }
    if (Math.abs(this.trackY) < 608) {
        this.ghost3.body.setVelocityY(Math.tanh(this.trackY) * Phaser.Math.FloatBetween(gameOptions.ghostminSpeed, gameOptions.ghostmaxSpeed));
    };


    this.lefthold.setPosition(this.hero.body.position.x -11, this.hero.body.position.y +16);
    this.righthold.setPosition(this.hero.body.position.x + 27, this.hero.body.position.y +16);

    //attack
    if (this.keyz.isDown == true && this.lock == false && this.hero.body.velocity.x == 0  && this.hero.body.blocked.down){
        this.lock = true;
       
        this.hero.setSize(16,33).setOffset(15,0);
        this.collidr = this.physics.add.overlap(this.lefthold, this.ghost1, () => {this.ghost1.destroy(this.ghost1.x,this.ghost1.y),this.killCount += 1,this.ghost1 = this.physics.add.sprite((Phaser.Math.Between(50,650)),(Phaser.Math.Between(0,408)),'ghost', 0)}, null, this);
        this.collidr2 = this.physics.add.overlap(this.lefthold, this.ghost2, () => {this.ghost2.destroy(this.ghost2.x,this.ghost2.y),this.killCount += 1,this.ghost2 = this.physics.add.sprite((Phaser.Math.Between(50,650)),(Phaser.Math.Between(0,408)),'ghost', 0)}, null, this);
        this.collidr3 = this.physics.add.overlap(this.lefthold, this.ghost3, () => {this.ghost3.destroy(this.ghost3.x,this.ghost3.y),this.killCount += 1,this.ghost3 = this.physics.add.sprite((Phaser.Math.Between(50,650)),(Phaser.Math.Between(0,408)),'ghost', 0)}, null, this);
        this.hero.play('atkLeft');
        this.blade.play()
        this.hero.on('animationcomplete', () => {
            this.hero.setSize(this.hero.realWidth, this.hero.realHeight, true)
            this.killText.setText('Kill Count:' + this.killCount)
            this.physics.world.removeCollider(this.collidr)
            this.physics.world.removeCollider(this.collidr2)
            this.physics.world.removeCollider(this.collidr3)
            this.physics.add.collider(this.hero, this.ghost1,this.death,null,this)
            this.physics.add.collider(this.hero, this.ghost2,this.death,null,this)
            this.physics.add.collider(this.hero, this.ghost3,this.death,null,this)
            this.hero.play('idleLeft')});
        }
   
    
    if (this.keyc.isDown == true && this.lock == false && this.hero.body.velocity.x == 0 && this.hero.body.blocked.down ){
        this.lock = true;
        this.hero.setSize(16,33).setOffset(15,0)
        this.hero.play('atkRight');
        this.blade.play()
        this.collidr = this.physics.add.overlap(this.righthold, this.ghost1, () => {this.ghost1.destroy(this.ghost1.x,this.ghost1.y),this.killCount += 1, this.ghost1 = this.physics.add.sprite((Phaser.Math.Between(50,650)),(Phaser.Math.Between(0,408)),'ghost', 0)}, null, this);
        this.collidr2 = this.physics.add.overlap(this.righthold, this.ghost2, () => {this.ghost2.destroy(this.ghost2.x,this.ghost2.y), this.killCount += 1,this.ghost2 = this.physics.add.sprite((Phaser.Math.Between(50,650)),(Phaser.Math.Between(0,408)),'ghost', 0)}, null, this);
        this.collidr3 = this.physics.add.overlap(this.righthold, this.ghost3, () => {this.ghost3.destroy(this.ghost3.x,this.ghost3.y), this.killCount += 1,this.ghost3 = this.physics.add.sprite((Phaser.Math.Between(50,650)),(Phaser.Math.Between(0,408)),'ghost', 0)}, null, this);
        if (this.collidr = true)
        this.hero.on('animationcomplete', () => {
            this.hero.setSize(this.hero.realWidth, this.hero.realHeight, true)
            this.killText.setText('Kill Count:' + this.killCount)
            this.physics.world.removeCollider(this.collidr)
            this.physics.world.removeCollider(this.collidr2)
            this.physics.world.removeCollider(this.collidr3)
            this.physics.add.collider(this.hero, this.ghost1,this.death,null,this)
            this.physics.add.collider(this.hero, this.ghost2,this.death,null,this)
            this.physics.add.collider(this.hero, this.ghost3,this.death,null,this)
            this.hero.play('idleRight')});
    }

    //charmovement
    if (this.hero.body.blocked.down && this.lock == false){
        this.hero.setSize(16,33)
        this.hero.body.velocity.x = this.cursors.left.isDown ? (this.cursors.right.isDown ? 0 : -1 * gameOptions.playerSpeed) : (this.cursors.right.isDown ? gameOptions.playerSpeed : 0);
    
        }

    if (this.spaceKey.isDown && this.hero.body.blocked.down && this.lock == false)
    {
        
        this.hero.play('jumpRight');
        this.hero.body.velocity.y = -310;
        if (this.hero.body.touching.down = true){
            this.hero.play('idleRight')
        }
        
    }

    if(this.cursors.left.isDown && this.hero.body.blocked.down && this.lock == false ){
        this.hero.play('Left',true);
        this.hero.body.blocked.down && this.cursors.left.on('up', () =>
            this.hero.play('idleLeft'),
            
        );

    }
    else if (this.cursors.right.isDown && this.hero.body.blocked.down && this.lock == false){
        this.hero.play('Right',true);
        this.hero.body.blocked.down && this.cursors.right.on('up', ()  =>
            this.hero.play('idleRight'),  
            
            
        ); 
    }


}


}
