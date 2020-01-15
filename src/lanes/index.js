import laneImg from '../assets/img/ground.jpg'
class Lane {
    constructor({game}){
         const { scene } = game;
         this.scene = scene;
         this.game = game;
         this.lanes = [];         
         this.nblanes = 3;
         this.maxNumber = 10;
         this.lastZPostion = 0;
         this.length = 10;
         let footPath = new BABYLON.StandardMaterial('', this.scene);
         footPath.diffuseTexture = new BABYLON.Texture(laneImg, this.scene);
         footPath.diffuseTexture.vScale = 2;
         for (var i = 0; i<this.nblanes; i++){
            for (var l=0; l<this.maxNumber; l++) {
                var g = BABYLON.Mesh.CreateGround("lane", 3, this.length, 1, this.scene);
                g.material = footPath;
                g.receiveShadows = true;
                this.lanes.push(g);
            }
            console.log('lanes', this.lanes)
        }
        this.init();
     }
     init(){
        this.lastZPosition = ((this.lanes.length-1)%this.maxNumber) * this.length + this.length/2;
        var interval = 4;
        var cp = interval * -1 * (this.nblanes/2);
    
        for (var i = 0; i<this.lanes.length; i++){
            var l = this.lanes[i];
            l.position.x = cp;
            l.position.y = 0.1;
            l.position.z = (i%this.maxNumber) * this.length + this.length/2;
    
            if ((i+1) % this.maxNumber == 0) {
                cp += interval;
            }
        }
     }
     getLanePositionX(index){
        return this.lanes[index * this.maxNumber].position.x
     }
 }
 export default Lane