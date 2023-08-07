import menuScene from '../scripts/scenes/Menu.js'
import gameScene from '../scripts/scenes/Game.js'
import endScene from '../scripts/scenes/End.js'



let mScene = new menuScene();
let gScene = new gameScene();
let eScene = new endScene();



var gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: 0x000000,
        parent: "game-parent",
        width: 800,
        height: 608,
        scale: {
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
            default: "arcade",
            arcade: {
                debug: false,
                gravity: {
                    y: 0
                }
                
            }
        }
    }

let game = new Phaser.Game(gameConfig);

game.scene.add('menuScene', mScene);
game.scene.add('gameScene', gScene);
game.scene.add('endScene', eScene);



game.scene.start('menuScene');