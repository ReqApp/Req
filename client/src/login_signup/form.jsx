import React, { Component } from 'react';
import SignUp from './signup';
import SocialLinks from './sociallinks';
import LogIn from './login';
import Form_Func from './form_func';

export default class Log extends Component {
  render() {
    return (
	<body style={{background: '#28AE60'}}>
      <div className="form">
        <ul className="tab-group">
        <Form_Func>
          <li className="tab active"><a href="#signup">Sign Up</a></li>
          <li className="tab"><a href="#login">Log In</a></li>
        </Form_Func>
        </ul>
        <div className="tab-content">
          <div id="signup">   
            <h1>Sign Up for Free</h1>
            <br />
            <form action="/" method="post">
              <SignUp />
              <SocialLinks />
            </form>
          </div>
          <div id="login">   
            <h1>Welcome Back!</h1>
            <br />
            <form action="/" method="post">
              <LogIn />
            </form>
          </div>
        </div>
      </div> 
	 </body>
    )
  }
}