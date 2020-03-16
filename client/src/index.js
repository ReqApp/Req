import React, {Component } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import './index.css';
import FindBetPage from './LocationBettingPage/findLocationBets.js';
import Bets from './pages/bets.js';
import {HomePage} from './pages/home';
import {DisplayMap} from './pages/maps';
import {FAQ} from './pages/faq';
import {About} from './pages/about';
import {Profile} from './pages/profile';

class App extends React.Component{
   render(){
       return(
                <Switch>               
                   <Route exact path="/maps">
                        <DisplayMap/>
                   </Route>
                   <Route exact path="find_bets">
                        <FindBetPage/>
                    </Route>
                   <Route exact path="/bets">
                       <Bets/>
                   </Route>
                   <Route exact path="/faq">
                       <FAQ/>
                   </Route>
                   <Route exact path="/about">
                       <About/>
                   </Route>
                   <Route path="/profile">
                       <Profile/>
                   </Route>
                   <Route exact path="/">
                       <HomePage/>
                   </Route>
               </Switch>
       );
   } 
};

ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
)

// import App from './App';
// import * as serviceWorker from './serviceWorker';


// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
