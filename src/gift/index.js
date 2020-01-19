import * as BABYLON from 'babylonjs'

export default class Gift extends BABYLON.AbstractMesh {
    constructor(game, i) {
        super()
        let { assets } = game
        this.scene = game.scene
        let gift = game.assets['gift'].meshes.clone('gift' + i)
        BABYLON.Tags.AddTagsTo(gift, 'gift')
        gift.parent = this

        const recycle = ()=> {
            if (this.position.z < game.player.position.z - 20) {
                this.dispose();
                this.getScene().unregisterBeforeRender(recycle);
            }
        };
        this.scene.registerBeforeRender(recycle);
        this.giftRotAnim = new BABYLON.Animation('rot_animation', 'rotation.y', 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
        this.giftRotAnim.setKeys([
            { frame: 0, value: 0 },
            { frame: 25, value: Math.PI / 2 },
            { frame: 50, value: Math.PI },
            { frame: 75, value: 3 * Math.PI / 2 },
            { frame: 100, value: 2 * Math.PI },
        ])
        this.animations.push(this.giftRotAnim);
        this.start()
        // this.giftJumpAnim = new BABYLON.Animation('jump_animation', 'position.y', 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
        // this.giftJumpAnim.setKeys([
        //     { frame: 0, value: 0.5 },
        //     { frame: 25, value: 0.75 },
        //     { frame: 50, value: 0.5 },
        // ])
        // this.giftScalAnim = new BABYLON.Animation('scal_animation', 'scaling', 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
        // this.giftScalAnim.setKeys([
        //     { frame: 0, value: new BABYLON.Vector3(1, 1, 1) },
        //     { frame: 25, value: new BABYLON.Vector3(0.75, 0.75, 0.75) },
        //     { frame: 50, value: new BABYLON.Vector3(1, 1, 1) },
        // ])
        // this.animationGroup = new BABYLON.AnimationGroup('group')
        // this.animationGroup.speedRatio = 1.8
        // this.animationGroup.addTargetedAnimation(this.giftRotAnim, this)
        // this.animationGroup.addTargetedAnimation(this.giftJumpAnim, this)
        // this.animationGroup.addTargetedAnimation(this.giftScalAnim, this)
        // this.start()
    }

    start() {
        this.scene.beginAnimation(this, 0, 100, true);
        // this.animationGroup.play(true)
    }
}