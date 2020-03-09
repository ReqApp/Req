import React, {createRef, Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import './index.css';
import Bets from './pages/bets.js';
import {HomePage} from './pages/home';
import {DisplayMap} from './pages/maps';
import {FAQ} from './pages/faq';
import {Form} from './pages/form';

class App extends Component{
   render(){
       return(
               <Switch>                  
                   <Route path='/maps'>
                        <DisplayMap/>
                   </Route>
                   <Route path='/bets'>
                       <Bets/>
                   </Route>
                   <Route path='/faq'>
                       <FAQ/>
                   </Route>
                   <Route path='/login'>
						<Form/>
				   </Route>
                   <Route path='/'>
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
