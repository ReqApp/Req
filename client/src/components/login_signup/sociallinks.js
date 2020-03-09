import React, { Component } from 'react';
import './form.css';

export default class SocialLinks extends Component {
  render() {
    return (
      <div>        
       <br />
       <br />
         <h1>
           Or Sign Up Using
         </h1>
         <br />
            <div className="text-center social-btn">
              <a href="#" className="btn btn-primary btn-block"><i className="fa fa-facebook" /> Sign in with <b>Facebook</b></a>
              <a href="#" className="btn btn-info btn-block"><i className="fa fa-twitter" /> Sign in with <b>Twitter</b></a>
              <a href="#" className="btn btn-danger btn-block"><i className="fa fa-google" /> Sign in with <b>Google</b></a>
            </div>
    </div>
    )
  }
}