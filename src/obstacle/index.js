class Obstacle {
    constructor(game) {
        this.game = game
        this.obstacles = [] //所有障碍
        this.gifts = [] //所有礼物
    }
    /**
     * 计算两个数之间的随机数
     * @param min 
     * @param max
     */
    randomNumber(min, max) {
        if (min === max) return min
        return Math.floor(Math.random() * (max - min) + min);
    }
    /**
     * 循环障碍 gift, obstacle
     * 
     */
    recycle() {
        // recycle gifts
        console.log('recyle------------', this.gifts.length, this.obstacles.length)
        for (let g = 0; g < this.gifts.length; g++) {
            let gift = this.gifts[g]
            if (gift.position.z < this.game.player.position.z - 20) {
                gift.dispose()
                this.obstacles.splice(g, 1)
                // g--
            }
        }
        // recycle obstacles
        for (let o = 0; o < this.obstacles.length; o++) {
            let obstacle = this.obstacles[o]
            if (obstacle.position.z < this.game.player.position.z - 10) {
                console.log('obs', obstacle)
                obstacle.dispose()
                this.gifts.splice(o, 1)
                // o--
            }
        }
    }
    /**
     * 1 障碍随机放置
     */
    send() {
        // player position   ？ +50
        let zpos = this.game.player.position.z + 50
        // 随机数模式
        let p = []
        for (let i = 0; i < 9; i++) {
            p.push(this.randomNumber(-1, 4))
        }
        this.sendPattern(p, zpos)
    }
    /**
     * 2 放置 1rock, 0 nothing, -1 gift, 2 bigrock, 3 snowman
     * @param pattern 随机数组
     * @param zpos player position z
     */
    sendPattern(pattern, zpos) {
        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] == 1) {
                // rock
                let rock = this.game.assets['rock'].meshes.createInstance('rock' + i)
                rock.rotation.y = Math.random() * 4;
                // rock.isVisible = true;
                rock.setEnabled(true);
                rock.position.x = this.game.lanes.getLanePositionX(i % 3);
                rock.position.z = zpos;
                this.obstacles.push(rock);
            } else if (pattern[i] == 2) {
                // big rock


            } else if (pattern[i] == 3) {
                // snowman
                let snowman = this.game.assets['snowman'].meshes.clone('snowman' + i)
                snowman.setEnabled(true);
                snowman.position.x = this.game.lanes.getLanePositionX(i % 3);
                snowman.position.y = 1;
                snowman.position.z = zpos;
                this.obstacles.push(snowman);
            } else if (pattern[i] == -1) {
                // gift

            }
            if ((i + 1) % 3 == 0) {
                zpos += 5;
            }

        }
    }
}
export default Obstacle