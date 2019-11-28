import React from 'react'
import * as BABYLON from 'babylonjs'
import './game.less'
import '../assets/babylon/elf/elf.jpg'
import '../assets/babylon/elf/elf.fbx'
import bgImg from '../assets/img/background.jpg'
import elfUrl from '../assets/babylon/elf/elf.babylon'
import snowImg from '../assets/img/snow.png'
import Player from '../player'

// import 'babylonjs-loaders';
// import snowmanUrl from '../assets/snowman/snowman.babylon'
// import giftUrl from '../assets/gift/gift.babylon'
// import rockUrl from '../assets/rock/rochers.babylon'

class Game extends React.Component {
    constructor(props){
        super(props)
        
    }
    state = {
        isShowReady: true
    }
    gamespeed = 0;
    assets  = [];

    componentDidMount() {
        let canvas = document.getElementById('renderCanvas')
        this.engine = new BABYLON.Engine(canvas, true);
        window.onresize = () => {
            this.engine.resize()
        }
        // 1 初始化场景
        // 2 加载babylon
        // 3 初始化mesh
        this.initScene()
    }

    doStart = () =>{
        this.setState({isShowReady: false})
    }

    initScene = () => {
        let scene = new BABYLON.Scene(this.engine);
        let camera = new BABYLON.ArcRotateCamera("", -2.34432, 1.08, 20, new BABYLON.Vector3(0,0,6), scene);
        camera.attachControl(this.engine.getRenderingCanvas());
        var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0,1,0), scene);
        h.intensity = 0.3;
        new BABYLON.Layer("bg", bgImg, scene, true);
        // 启动
        this.scene = scene
        this.loadBabyLon(scene)
        
        // return scene
    }
    
    loadBabyLon = (scene) =>{
        let loader = new BABYLON.AssetsManager(scene);
        let elf = loader.addMeshTask('elf', '', elfUrl, '')
        elf.onSuccess = (t) =>{
            this.assets[t.name] = {meshes: t.loadedMeshes, skeleton: t.loadedSkeletons[0]};
        }
        elf.onError = (err) =>{
            console.log('err', err)
        }
        loader.onFinish = (task) =>{
            console.log('taske', task)
            this.initGame()

            scene.executeWhenReady(()=> {
                // $(".ready").show();
                // $(".score").show();

                this.engine.runRenderLoop(()=>{
                    scene.render();
                });

            });
            // this.engine.runRenderLoop(() => {
            //     scene.render()
            // })
        }
        loader.load()
    }
    initGame = () =>{
        this.snow = this.initParticles()
        this.player = new Player({game: this})
        this.scene.registerBeforeRender(()=>{
            let delta = this.engine.getDeltaTime(); // 1/60*1000
            var deltap= delta * 60 /1000;
            this.player.position.z += this.gamespeed * deltap;
            this.scene.activeCamera.target.z = this.player.position.z+1;
            this.snow.emitter.z = this.player.position.z-10;
        })
    }
    initParticles = ()=>{
        let snow = new BABYLON.ParticleSystem('particle', 2000, this.scene);
        snow.particleTexture = new BABYLON.Texture(snowImg, this.scene);
        let source = BABYLON.Mesh.CreateBox("source", 1.0, this.scene);
        snow.emitter = new BABYLON.Vector3(0, 10, 3);
        snow.minLifeTime = 0.3
        snow.maxLifeTime = 2;
        snow.colorDead = new BABYLON.Color4(1, 1, 1, 0.0);
        snow.minSize = 0.1;
        snow.maxSize = 0.5;
        snow.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        snow.emitRate = 1000;
        snow.gravity = new BABYLON.Vector3(0, -9.81, 0);
        snow.minEmitPower = 1;
        snow.maxEmitPower = 3;
        snow.minEmitBox = new BABYLON.Vector3(-12, 0, -5);
        snow.maxEmitBox = new BABYLON.Vector3(12, 0, 60);
        snow.colorDead = new BABYLON.Color4(1, 1, 1, 0.0);
        snow.direction1 = new BABYLON.Vector3(-7, 8, 3);
        snow.direction2 = new BABYLON.Vector3(7, 8, -3);
        snow.minAngularSpeed = 0;
        snow.maxAngularSpeed = 2*Math.PI;
        snow.updateSpeed = 0.005;
        snow.start()
        // return snow
    }   
    render() {
        let {isShowReady} = this.state
        return (
            <div className="game-page">
                {isShowReady && <div className="ready" onClick={this.doStart}>
                    Space to start!
                </div>}
                <div className="score">
                    0
                </div>
                <canvas id="renderCanvas"></canvas>
                <div></div>
            </div>

        )
    }

}
export default Game