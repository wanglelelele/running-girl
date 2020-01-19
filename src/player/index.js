import * as BABYLON from 'babylonjs'

export default class Player extends BABYLON.TransformNode {
    constructor({ game }) {
        super(game)
        this.height = 0.75;
        const { meshes, skeleton } = game.assets.elf
        meshes.forEach(mesh => {
            BABYLON.Tags.AddTagsTo(mesh, 'elf')
            mesh.parent = this
            mesh.material.emissiveTexture = mesh.material.diffuseTexture
            mesh.setEnabled(true)
        })
        this.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
        this.position.y = this.height;
        this.rotation.y = Math.PI + Math.PI / 8;
        this.skeleton = skeleton;
        this.game = game;
        this.init()
        const gravity = -0.015;
        this.getScene().registerBeforeRender(() => {
            if (this.isJumping > 0) {
                this.speed += gravity;
                this.position.y += this.speed;
                if (this.position.y <= this.height) {
                    this.position.y = this.height;
                    this.isJumping = false;
                    if (!this.dead) {
                        this.getScene().beginAnimation(this.skeleton, 0, 21, true, 1.0)
                    }
                }
            }
            this.position.x += 0.5 * this.direction
            if (this.direction < 0) {
                if (this.position.x <= this.destinationX) {
                    this.position.x = this.destinationX
                    this.direction = 0
                }
            }
            if (this.direction > 0) {
                if (this.position.x >= this.destinationX) {
                    this.position.x = this.destinationX;
                    this.direction = 0;
                }
            }
        })
        window.addEventListener('keydown', (e) => {
            if (e.key == 'w') {
                this.jump()
            }
            if (e.key == 'a' && this.direction == 0) {
                this.left()
            }
            if (e.key == 'd' && this.direction == 0) {
                this.right()
            }
        })
    }
    init = () => {
        this.dead = false;
        this.speed = 0;
        this.isJumping = 0;
        this.destinationX = -1;
        this.direction = 0;
        this.position.z = 0;
        this.currrentLane = Math.floor(this.game.lanes.nblanes / 2);
        this.getScene().beginAnimation(this.skeleton, 0, 21, true, 1.5)

    }
    jump = () => {
        if (!this.dead) {
            const height = 0.3;
            if (this.isJumping >= 0 && this.isJumping < 4) {
                this.isJumping++
                this.speed = height;
                if (this.isJumping == 1) {
                    this.getScene().beginAnimation(this.skeleton, 22, 48, false, 1.0, () => {
                        // this.getScene().beginAnimation(this.skeleton, 0, 21, true, 1.0)
                    })
                } else {
                    this.getScene().beginAnimation(this.skeleton, 49, 73, false, 0.75, () => {
                        // this.getScene().beginAnimation(this.skeleton, 0, 21, true, 1.0)
                    })
                }
            }
        }
    }
    left = () => {
        if (!this.dead) {
            if (this.currrentLane > 0) {
                this.currrentLane--;
                this.direction = -1;
                this.destinationX = this.game.lanes.getLanePositionX(this.currrentLane)
            }
        }
    }
    right = () => {
        if (!this.dead) {
            if (this.currrentLane < this.game.lanes.nblanes - 1) {
                this.currrentLane++;
                this.direction = 1;
                this.destinationX = this.game.lanes.getLanePositionX(this.currrentLane)
            }
        }
    }
    die = (callback) => {
        this.dead = true;
        this.height = 1;
        //this.getScene().stopAnimation(this.skeleton);
        this.getScene().beginAnimation(this.skeleton, 74, 138, false, 1.0, callback);
    }
    isCollidingWith = (otherMeshes) => {
        const children = this.getChildren()
        let isColliding = false
        children.forEach(child => {
            if (child.matchesTagsQuery('elf')) {
                let otherChildren = otherMeshes.getChildren()
                if (otherChildren && otherChildren.length) {
                    for (let i = 0; i < otherChildren.length; i++) {
                        return isColliding = child.intersectsMesh(otherChildren[i], false)
                    }
                } else {
                    return isColliding = child.intersectsMesh(otherMeshes, false)
                }
            }
        })
        return isColliding
    }
}