import React from 'react'
import * as BABYLON from 'babylonjs'
import './game.less'
import bgImg from '../assets/img/background.jpg'
import elfUrl from '../assets/babylon/elf/elf.babylon'
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
        let camera = new BABYLON.ArcRotateCamera("camera1",  0, 0, 0, new BABYLON.Vector3(0, 0, -0), scene);
        camera.setPosition(new BABYLON.Vector3(0, 0, 20));
        camera.attachControl(this.engine.getRenderingCanvas());
        new BABYLON.Layer("bg", bgImg, scene, true);
        this.loadBabyLon(scene)
        // return scene
    }
    
    loadBabyLon = (scene) =>{
        console.log('scene', scene)
        let loader = new BABYLON.AssetsManager(scene);
        let elf = loader.addMeshTask('elf', '', elfUrl, '')
        elf.onSuccess = (t) =>{
            console.log('t', t)
        }
        elf.onError = (err) =>{
            console.log('err', err)
        }
        loader.onFinish = (task) =>{
            console.log('taske', task)
        }
        loader.load()

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