import React, { Component } from 'react';
import './form.css';

export default class LogIn extends Component {
  render() {
    return (
      <div>
        <div className="field-wrap">
          <label>
            Email Address<span className="req">*</span>
          </label>
          <input type="email" required autoComplete="off" />
        </div>
        <div className="field-wrap">
          <label>
            Password<span className="req">*</span>
          </label>
          <input type="password" required autoComplete="off" />
        </div>
        <p className="forgot"><a href="#">Forgot Password?</a></p>
        <button className="button button-block">Log In</button>
      </div>
    )
  }
}