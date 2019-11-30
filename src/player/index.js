import * as BABYLON from 'babylonjs'

export default class Player extends BABYLON.TransformNode {
    constructor({game}){
        super(game)
        this.height = 0.75;
        const { meshes, skeleton } = game.assets.elf
        meshes.forEach(mesh => {
            BABYLON.Tags.AddTagsTo(mesh, 'elf')
            mesh.parent = this
            console.log('meshes-----', mesh, mesh.parent, this)
            mesh.material.emissiveTexture = mesh.material.diffuseTexture
            mesh.setEnabled(true)
        })
        this.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
        this.position.y = this.height;
        this.rotation.y = Math.PI+Math.PI/8;
        this.skeleton = skeleton;
        this.game = game;
        this.init()

    }  
    init = () =>{
        this.dead = false;
        this.speed = 0;
        this.isJumping = 0;
        this.destinationX= -1;
        this.direction = 0;
        this.position.z = 0;
        // this.currrentLane = Math.floor(this.game.lanes.nblanes / 2);
    } 
}