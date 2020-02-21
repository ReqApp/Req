import React, { Component } from 'react'
import SocialLinks from './sociallinks';

export default class SignUp extends Component {
  render() {
    return (
      <div>
        <div className="top-row">
          <div className="field-wrap">
            <label>
              First Name<span className="req">*</span>
            </label>
            <input type="text" required autoComplete="off" />
          </div>
          <div className="field-wrap">
            <label>
              Last Name<span className="req">*</span>
            </label>
            <input type="text" required autoComplete="off" />
          </div>
        </div>
        <div className="field-wrap">
          <label>
            Email Address<span className="req">*</span>
          </label>
          <input type="email" required autoComplete="off" />
        </div>
        <div className="field-wrap">
          <label>
            Set A Password<span className="req">*</span>
          </label>
          <input type="password" required autoComplete="off" />
        </div>
        <button type="submit" className="button button-block">Get Started</button>
      </div>
    )
  }
}