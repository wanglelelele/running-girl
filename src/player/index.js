import * as BABYLON from 'babylonjs'

export default class Player{
    constructor({game}){
        console.log('game', game)
        const { meshes, skeleton } = game.assets.elf
        meshes.forEach(mesh => {
            BABYLON.Tags.AddTagsTo(mesh, 'elf')
            mesh.parent = this
            mesh.material.emissiveTexture = mesh.material.diffuseTexture
            mesh.setEnabled(true)
        })
    }   
}