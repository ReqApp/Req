import React from 'react';
import ReactDOM  from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './index.css';
import FindLocationBets from './pages/findLocationBets.js';
import SignIn from './pages/login';
import Register from './pages/register'
import ResetPassword from './pages/resetPassword';
import ForgotPassword from './pages/forgotPassword'; 
import VerifyAccount from './pages/verifyAccount';
import {Profile} from './pages/profile';
import Payment from './stripePayment.js';
import {Error404} from './error404';
import Dashboard from './pages/dashboard.js';
import {Home} from './pages/homePage';
import {Tutorial} from './pages/tutorial';
import {FAQ} from './pages/faq';

class App extends React.Component{
    render(){
        return(
                 <Switch>               
                    <Route exact path='/create-location-bet'>
                        <FindLocationBets mode='create' />
                    </Route>
                    <Route exact path='/'>
                        <Home />
                    </Route>
                    <Router exact path='/tutorial'>
                        <Tutorial />
                    </Router>
                    <Router exact path='/faq'>
                        <FAQ />
                    </Router>
                    <Route exact path='/find-location-bets'>
                         <FindLocationBets mode='find'/>
                     </Route>
                    <Route path='/users/profile'>
                        <Profile/>
                    </Route>
                    <Route exact path='/payment'>
                         <Payment/>
                    </Route>
                    <Route exact path='/users/login'>
                         <SignIn/>
                    </Route>
                    <Route exact path='/users/dashboard'>
                        <Dashboard />
                    </Route>
                    <Route exact path='/users/register'>
                         <Register/>
                    </Route>
                    <Route exact path='/users/forgotPassword'>
                         <ForgotPassword/>
                    </Route>
                    <Route exact path='/users/resetPassword'>
                         <ResetPassword/>
                    </Route>
                    <Route exact path='/users/verifyAccount'>
                         <VerifyAccount/>
                    </Route>
                    <Route exact path='/'>
                        <HomePage/>
                    </Route>
                    {/*This will call the error404 for any page that doesn't match any of the path*/}
                    <Route>
                        <Error404/>
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
