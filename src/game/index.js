import React from 'react'
import * as BABYLON from 'babylonjs'
import './game.less'
import '../assets/babylon/elf/elf.jpg'
import '../assets/babylon/elf/elf.fbx'
import '../assets/babylon/gift/giftCM.jpg'
import '../assets/babylon/gate/cloture.jpg'

import bgImg from '../assets/img/background.jpg'
import snowImg from '../assets/img/snow.png'
import elfUrl from '../assets/babylon/elf/elf.babylon'
import snowmanUrl from '../assets/babylon/snowman/snowman.babylon'
import giftUrl from '../assets/babylon/gift/gift.babylon'
import rockUrl from '../assets/babylon/rock/rochers.babylon'
import gateUrl from '../assets/babylon/gate/gate.babylon'
import grassUrl from '../assets/img/grass2.jpg'
import Player from '../player'
import Lanes from '../lanes'
import Obstacle from '../obstacle'
import Spines from '../spines'

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.obstacleTimer = -1
        this.obstacleSpawnTime = 2000
        this.gamespeed = 0
        this.score = 0
        this.scoreRef = React.createRef();
    }
    state = {
        isShowReady: true
    }
    gamespeed = 0;
    assets = [];

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

    doStart = () => {
        this.score = 0
        // Check if collision between player and obstacles
        const checkCollisions = () => this.ob.obstacles.forEach(obstacle => {
            if (this.player.isCollidingWith(obstacle)) {
                this.dead()
                this.scene.unregisterBeforeRender(checkCollisions);
            }
        })
        this.scene.registerBeforeRender(checkCollisions);
        this.score = 0;
        this.gamespeed = 0;

        // Init player
        this.player.init();
        this.player.position.x = this.lanes.getMiddleX();
        this.lanes.init();
        this.spines.init()
        let top = this.player.position.clone();
        top.y += 10;
        top.z -= 10;
        this.snow.emitter = top;

        // 删除障碍
        let obstacles = this.ob.obstacles;
        obstacles.forEach(function (o) {
            o.dispose();
        });
        this.ob.obstacles = [];
        this.obstacleTimer = -1;
        // remove all gifts
        let gifts = this.ob.gifts;
        gifts.forEach(function (g) {
            g.dispose();
        });
        this.ob.gifts = [];
        this.setState({ isShowReady: false }, () => {
            this.gamespeed = 0.2;
            this.obstacleTimer = this.obstacleSpawnTime
        })
    }

    initScene = () => {
        let scene = new BABYLON.Scene(this.engine);
        let camera = new BABYLON.ArcRotateCamera("", -2.34432, 1.08, 20, new BABYLON.Vector3(0, 0, 6), scene);
        camera.attachControl(this.engine.getRenderingCanvas());
        var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
        h.intensity = 0.3;
        new BABYLON.Layer("bg", bgImg, scene, true);
        // 启动
        this.scene = scene
        this.loadBabyLon(scene)

        // return scene
    }

    loadBabyLon = (scene) => {
        let loader = new BABYLON.AssetsManager(scene);
        // girl
        let elf = loader.addMeshTask('elf', '', elfUrl, '')
        elf.onSuccess = (t) => {
            this.assets[t.name] = { meshes: t.loadedMeshes, skeleton: t.loadedSkeletons[0] };
        }
        elf.onError = (err) => {
            console.log('err', err)
        }
        // snowman only one mesh
        let snowman = loader.addMeshTask('snowman', '', snowmanUrl, '')
        snowman.onSuccess = (t) => {
            let snowmanMesh = new BABYLON.Mesh("snowman", this.scene)
            t.loadedMeshes.forEach(function (m) {
                m.parent = snowmanMesh;
            })
            snowmanMesh.scaling.scaleInPlace(0.075)
            snowmanMesh.rotation.y = -Math.PI / 2
            snowmanMesh.setEnabled(false)
            this.assets[t.name] = { meshes: snowmanMesh }
        }
        // rock only one mesh
        const rockTask = loader.addMeshTask('rock', '', rockUrl, '')
        rockTask.onSuccess = task => {
            const { name, loadedMeshes } = task
            const rock = loadedMeshes[0]
            rock.convertToFlatShadedMesh()
            rock.position.y = 0.5
            rock.material.subMaterials[0].emissiveColor = BABYLON.Color3.White()
            rock.material.subMaterials[1].diffuseColor = BABYLON.Color3.FromInts(66, 87, 108)
            rock.setEnabled(false)
            this.assets[name] = {
                meshes: rock
            }
        }
        // gift only one mesh
        const giftTask = loader.addMeshTask('gift', '', giftUrl, '')
        giftTask.onSuccess = t => {
            t.loadedMeshes[0].setEnabled(false)
            t.loadedMeshes[0].position.y = 1;
            t.loadedMeshes[0].material.emissiveTexture = t.loadedMeshes[0].material.diffuseTexture;
            this.assets[t.name] = { meshes: t.loadedMeshes[0] };

        }
        // gate only one mesh
        const gateTask = loader.addMeshTask('gate', '', gateUrl, '')
        gateTask.onSuccess = t => {
            t.loadedMeshes[0].setEnabled(false)
            t.loadedMeshes[0].rotation.y = Math.PI / 2
            this.assets[t.name] = { meshes: t.loadedMeshes[0] }
        }


        loader.onFinish = (task) => {
            this.initGame()

            this.scene.executeWhenReady(() => {
                // $(".ready").show();
                // $(".score").show();

                this.engine.runRenderLoop(() => {
                    this.scene.render();
                });

            });
            // this.engine.runRenderLoop(() => {
            //     scene.render()
            // })
        }
        loader.load()
    }
    initGame = () => {
        this.lanes = new Lanes({ game: this })
        this.snow = this.initParticles()
        this.player = new Player({ game: this })
        this.ob = new Obstacle(this);
        this.spines = new Spines(this)
        this.spines.plant();

        // RECYCLE ELEMENTS
        this.scene.registerBeforeRender(() => {
            this.lanes.recycle();
            this.ob.recycle();
            this.spines.recycle()
        });
        // FLOOR GRASS
        let floor = BABYLON.Mesh.CreateGround('floor', 1, 1, 1, this.scene)
        floor.position.x = this.lanes.getMiddleX()
        floor.scaling = new BABYLON.Vector3(12 * this.lanes.nblanes, 1, 200)
        floor.position.z = 50
        floor.material = new BABYLON.StandardMaterial('', this.scene)
        floor.material.zOffset = 1
        floor.material.diffuseTexture = new BABYLON.Texture(grassUrl, this.scene)
        floor.material.specularColor = BABYLON.Color3.Black()
        floor.material.diffuseTexture.uScale = 10
        floor.material.diffuseTexture.vScale = 30
        floor.receiveShadows = true
        
        // MOVING FORWARD
        this.scene.registerBeforeRender(() => {
            let delta = this.engine.getDeltaTime(); // 1/60*1000
            var deltap = delta * 60 / 1000;
            this.player.position.z += this.gamespeed * deltap;
            this.scene.activeCamera.target.z = this.player.position.z + 1;
            this.snow.emitter.z = this.player.position.z - 10;
            floor.position.z = this.player.position.z + 50
            floor.material.diffuseTexture.vOffset += this.gamespeed * 0.15 * deltap;

            // console.log('obstacleTimer' + this.obstacleTimer)
            if (this.obstacleTimer != -1) {
                this.obstacleTimer -= this.engine.getDeltaTime();
                if (this.obstacleTimer <= 0 && !this.player.dead) {
                    this.ob.send();
                    this.obstacleTimer = this.obstacleSpawnTime;
                }
            }
        })
        // CHECK GIFT
        const checkGifts = () => {
            let gifts = this.ob.gifts
            gifts.forEach((gift, i) => {
                if (this.player.isCollidingWith(gift)) {
                    this.addScore()
                    gift.dispose()
                    gifts.splice(i, 1)
                }
            })
        }
        this.scene.registerBeforeRender(checkGifts)


        // INIT POSITION
        this.doStart()

    }
    initPosition = () => {
        this.score = 0;
        this.gamespeed = 0;
        // Init player
        // this.player.init();
        // this.player.position.x = this.lanes.getMiddleX();
        // this.sapinous.init();
        // this.lanes.init();
        // let top = this.player.position.clone();
        // top.y += 10;
        // top.z -= 10;
        // this.snow.emitter = top;
        // Remove all obstacles
        let obstacles = this.ob.obstacles;
        obstacles.forEach(function (o) {
            o.dispose();
        });
        this.ob.obstacles = [];
        this.obstacleTimer = -1;
        // remove all gifts
        let gifts = this.ob.gifts;
        gifts.forEach(function (g) {
            g.dispose();
        });
        this.ob.gifts = [];
    }
    initParticles = () => {
        let snow = new BABYLON.ParticleSystem('particle', 2000, this.scene);
        snow.particleTexture = new BABYLON.Texture(snowImg, this.scene);
        let source = BABYLON.Mesh.CreateBox("source", 1.0, this.scene);
        snow.emitter = new BABYLON.Vector3(0, 10, 0);
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
        snow.maxAngularSpeed = 2 * Math.PI;
        snow.updateSpeed = 0.005;
        snow.start()
        return snow
    }
    dead = () => {
        this.gamespeed = 0
        this.player.die(() => {
            this.setState({ isShowReady: true })
            // this.doStart()
        })
    }
    addScore = () => {
        this.score++
        // let scoreDom = document.querySelector('.score')
        // console.log('score---', this.scoreRef.current)
        this.scoreRef.current.innerHTML = this.score
    }
    render() {
        let { isShowReady } = this.state
        return (
            <div className="game-page">
                {isShowReady && <div className="ready" onClick={this.doStart}>
                    Space to start!
                </div>}
                {<div className="score" ref={this.scoreRef}>
                    0
                </div>}
                <canvas id="renderCanvas"></canvas>
                <div></div>
            </div>

        )
    }

}
export default Game