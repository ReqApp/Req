import React, { Component } from 'react'
import './form.css';

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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        <button type="submit" className="button button-block">Get Started</button>
=======
=======
>>>>>>> Stashed changes
        <div className="image-upload">
          <h2>Add a Photo <button type="submit" className="button-image-upload">Upload an Image</button></h2>
        </div>
        <button type="submit" className="button button-block">Get Started</button>      
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      </div>
    )
  }
}