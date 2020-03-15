import React, { Component } from 'react';
import './about.css';
import about from './images/about.png';

export default class About extends Component {
  render() {
    return (
      <div>
        <br />
      <div className="about_area ">
        <div className="container-fluid p-0">
          <div className="row no-gutters align-items-center">
            <div className="col-xl-6 col-lg-6">
              <div className="about_image">
              <img  src={about} alt="" />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="about_info">
                <h3>Making Betting Great Again</h3>
                <p>words, words,words,words,words,words,words,words,words,<br /> words, words,words,words,words,words,words,words,words, <br /> words, words,words,words,words,words,words,words,words.</p>
                <ul>
                  <li> Free and Easy to start </li>
                  <li> Localized bets add to excitement </li>
                  <li> Only betting app that doesn't lose you money</li>
                </ul>
                <div className="about_btn">
                  <a className="boxed-btn3-green-2" href="#">About Us</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
    </div>
    )
  }
}