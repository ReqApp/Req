import React, { Component } from 'react';
import './homemap.css';

export default class HomeMap extends Component {
  render() {
    return (
      <div>
          <div className="row">
            <div className="col- back_image">
              <div className="about_image">
                <h2>HopeFully get it working with actual maps</h2>
              </div>
            </div>
            <div className="col-4">
              <div className="about_info">
                <h1>Find <br />
                Current <br />
                Bets 
                In <br />
                Your <br/>
                Area !</h1>
              </div>
            </div>
          </div>
      </div>
    )
  }
}