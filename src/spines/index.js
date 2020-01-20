export default class Spines {
    constructor(game) {
        this.game = game
        this.gates = []
        this.maxNumber = 25
        this.lastZPostion = 0
        this.lastZPostionGates = 0
    }
    init() {
        this.lastZPostion = 0
        this.lastZPostionGates = 0
        for (let i = 0; i < 2 * this.maxNumber; i += 2) {
            let g1 = this.gates[i]
            g1.position = new BABYLON.Vector3(this.game.player.position.x - this.game.lanes.nblanes / 2 * 5, 1, this.lastZPostionGates)
            let g2 = this.gates[i + 1]
            g2.position = new BABYLON.Vector3(this.game.player.position.x + this.game.lanes.nblanes / 2 * 5, 1, this.lastZPostionGates)
            this.lastZPostionGates += 9
        }
    }
    recycle(){
        const limit = this.game.player.position.z - 20
        for(let i = 0; i < this.gates.length; i ++ ){
            let gate = this.gates[i]
            if(gate.position.z < limit){
                gate.position.z += 150
                break
            }
        }
    }
    plant() {
        for (let i = 0; i < this.maxNumber; i++) {
            let g1 = this.game.assets['gate'].meshes.createInstance('gate')
            let g2 = this.game.assets['gate'].meshes.createInstance('gate')
            this.gates.push(g1, g2)
        }
    }
}