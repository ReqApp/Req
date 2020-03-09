import React, { Component } from 'react';
import './slider.css';

export default class Slider extends Component {
  render() {
    return (
      <div>
      <div className="slider_area">
        <div className="slider_active owl-carousel">
          <div className="single_slider  d-flex align-items-center slider_bg_1 overlay2">
            <div className="container">
              <div className="row">
                <div className="col-xl-12">
                  <div className="slider_text ">
                    <h3> Make Novelty <br />
                      Bets With Friends </h3>
                    <p>Nam libero tempore, cum soluta nobis est eligendi optio <br />
                      cumque nihil impedit quo minus.</p>
                    <div className="video_service_btn">
                      <a href="#" className="boxed-btn3">Place a bet now!</a>
                      <a href="#" className="boxed-btn3-white"> <i className="fa fa-play" />
                        Learn how to start</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="single_slider  d-flex align-items-center slider_bg_2 overlay2">
            <div className="container">
              <div className="row">
                <div className="col-xl-12">
                  <div className="slider_text ">
                    <h3> Create An <br />
                      Account Today ! </h3>
                    <p>Nam libero tempore, cum soluta nobis est eligendi optio <br />
                      cumque nihil impedit quo minus.</p>
                    <div className="video_service_btn">
                      <a href="#" className="boxed-btn3">Create An Account</a>
                      <a href="#" className="boxed-btn3-white"> <i className="fa fa-play" />
                        Already A Member ?</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="single_slider  d-flex align-items-center slider_bg_3 overlay2">
            <div className="container">
              <div className="row">
                <div className="col-xl-12">
                  <div className="slider_text ">
                    <h3> See Bets In <br />
                      Your Local Area</h3>
                    <p>Nam libero tempore, cum soluta nobis est eligendi optio <br />
                      cumque nihil impedit quo minus.</p>
                    <div className="video_service_btn">
                      <a href="#" className="boxed-btn3">Local Bets</a>
                      <a href="#" className="boxed-btn3-white"> <i className="fa fa-play" />
                        See How It Work</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}