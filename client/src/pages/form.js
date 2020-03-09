import React, { Component } from 'react';
import SignUp from '../components/login_signup/signup';
import SocialLinks from '../components/login_signup/sociallinks';
import LogIn from '../components/login_signup/login';
import Form_Func from '../components/login_signup/form_func';
import Form_Func2 from '../components/login_signup/form_func2';

export class Form extends Component {
  render() {
    return (
	  <div>
      <div className="form" >
      <Form_Func2>
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
        </Form_Func2>
      </div> 
	 </div>
    )
  }
}

export default Form;