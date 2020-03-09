import React, { Component } from 'react';
import './team.css';

export default class Team extends Component {
  render() {
    return (
      <div>
        <br />
        <div className="service_area justify-content-center">
        <div className="container justify-content-center">
          <div className="row align-items-center">
            <div className="col-xl-12">
              <div className="section_title text-center mb-50">
                <h3>Meet the Team</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-6 col-md-offset-5" style={{float: 'none', margin: '0 auto'}}>
              <div className="single_service service_bg_1">
                <div className="service_hover">
                  <h3>Cathal Callaghan</h3>
                  <div className="hover_content">
                    <div className="hover_content_inner">
                      <h4>Cathal Callaghan</h4>
                      <p>A motivated and diligent individual with a keen interest in
                        the ever-expanding world of technology</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-md-offset-5" style={{float: 'none', margin: '0 auto'}}>
              <div className="single_service service_bg_2">
                <div className="service_hover">
                  <h3>Eoin McArdle</h3>
                  <div className="hover_content">
                    <div className="hover_content_inner">
                      <h4>Eoin McArdle</h4>
                      <p>Words words words, Words words words, Words words words, Words words words.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>	
        <div className="container justify-content-center">	
          <div className="row align-items-center">	
            <div className="col-xl-6 col-md-offset-5" style={{float: 'none', margin: '0 auto'}}>
              <div className="single_service service_bg_3">
                <div className="service_hover">
                  <h3>Karl Gordan</h3>
                  <div className="hover_content">
                    <div className="hover_content_inner">
                      <h4>Karl Gordan</h4>
                      <p>An aspiring student in computer science looking to use the new continuously attained skills in C, JavaScript, Python, Java and HTML to implement into my future career.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-md-offset-5" style={{float: 'none', margin: '0 auto'}}>
              <div className="single_service service_bg_4">
                <div className="service_hover">
                  <h3>Rory Sweeney</h3>
                  <div className="hover_content">
                    <div className="hover_content_inner">
                      <h4>Rory Sweeney</h4>
                      <p>I am an enthusiastic, driven second year undergraduate at National University of Ireland Galway (NUIG) , studying Computer Science &amp; Information Technology.</p>
                    </div>
                  </div>
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