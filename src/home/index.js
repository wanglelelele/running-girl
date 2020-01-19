import React from 'react'
import './home.less'

// 游戏组件
import Game from '../game'
class Home extends React.Component {
    state = {
        isStart: false,
        isShowWrapper: true,
        isShowWrapperFadeout: false
    }
    startGame = () => {
        this.setState({isStart: true})
        setTimeout(() => {
            this.setState({isShowWrapperFadeout: true})
        }, 1000);
    }
    onWrapperAnimationEnd = () => {
        this.setState({isShowWrapper: false})
    }
    render() {
        let {isStart, isShowWrapper, isShowWrapperFadeout} = this.state
        return (
            <div className="home-page">
                {isShowWrapper && <div
                    onAnimationEnd={this.onWrapperAnimationEnd}
                    className={isShowWrapperFadeout
                    ? "fade-out wrapper"
                    : "wrapper"}>
                    <div className="orientationWrapper">
                        Please turn your device in landscape mode
                    </div>
                    <div className="contentWrapper">
                        <div className="title">Christmas runner</div>

                        <div className="subtitle top">Collect as many gifts as you can !</div>
                        <div className="play" onClick={this.startGame}>play</div>
                        <div
                            className={isStart
                            ? "play playRipple rippleEffect"
                            : "play playRipple"}></div>
                        <div className="subtitle bottom">
                            Play with arrow keys to move left or right
                            <br/>Space to jump
                        </div>

                        <div className="author">
                            Made with
                            <i className="fa fa-heart"></i>
                            by
                            <a href="http://twitter.com/Temechon">Julian</a>, (3D assets by
                            <a href="http://twitter.com/jbledowski">JB</a>
                            and Sarah)<br/>
                            Powered by
                            <a className="red" href="http://www.babylonjs.com">Babylon.js</a>
                        </div>

                    </div>
                </div>}
               
                {/* 游戏 */}
                {!isShowWrapper && <Game/>}
            </div>
        )
    }
}
export default Home