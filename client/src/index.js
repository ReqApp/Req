import React, {createRef, Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import Bets from'./bets.js';
import Header from './components/header'
import Slider from './components/slider'
import Team from './components/team'
import About from './components/about'
import Footer from './components/footer'

class App extends Component{
    render(){
        return(
            <div>
        <Header></Header>
        <Slider></Slider>
        <About></About>
        <Team></Team>
        <Footer></Footer>
            </div>
        );
    }
};

ReactDOM.render(
    <App />,
    document.getElementById('root')
)
/*
import App from './App';
import * as serviceWorker from './serviceWorker';
*/

//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
