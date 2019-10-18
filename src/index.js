import React from 'react'
import ReactDom from 'react-dom'
import HomePage from './home'
import './index.less'
class App extends React.Component {
    render(){
        return (
            <div className="out-container">
                <HomePage />
            </div>
        )
    }
}
ReactDom.render(<App/>,document.getElementById("app"))