import React, { Component } from 'react';
import './infoboxes.css';
import { EuroSymbol, Explore, PeopleAltOutlined} from '@material-ui/icons';

export default class InfoBoxes extends Component {
  render() {
    return (
  <div>
    <div className="box_background">
      <h1 className="boxLinks_Header">Learn how to use REQ</h1>
      <br />
        <div className="container">
          <div className="row">
            <div className="col-xs-8 col-sm-4">
              <div className="single_service_wrap text-center">
              <div className="icons"><EuroSymbol className="icons" /></div>
              <br />
                <h2>Win Big</h2>
                <p>With Req the sky really<br />
                is the limit in terms of<br />
                what you can bet on.
                </p>
              </div>
            </div>
            <div className="col-xs-8 col-sm-4">
              <div className="single_service_wrap text-center">
              <div className="icons"><Explore className="icons" /></div>
              <br />
                <h2>Explore</h2>
                <p>Simply sitting at home 
                using Req won't net give
                you the full experience. Go 
                outside and explore on your
                search for the next jackpot
                </p>
              </div>
            </div>
            <div className="col-xs-8 col-sm-4">
              <div className="single_service_wrap text-center">
              <div className="icons"><PeopleAltOutlined className="icons" /></div>  
              <br />       
              <h2>Create</h2>       
              <p>All creators are credited 
                10% of all coins bets, 
                which incentivizes them 
                to create more bets.
                </p>
              </div>
            </div>
            <div className="col-xs-8 col-md-5">
              <div className="single_service_wrap text-center">
              <div className="icons"><PeopleAltOutlined className="icons" /></div>  
              <br />       
              <h2>Create</h2>       
              <p>All creators are credited 
                10% of all coins bets, 
                which incentivizes them 
                to create more bets.
                </p>
              </div>
            </div>
            <div className="col-xs-6 col-md-7">
              <div className="single_service_wrap text-center">
              <div className="icons"><PeopleAltOutlined className="icons" /></div>  
              <br />       
              <h2>Create</h2>       
              <p>All creators are credited 
                10% of all coins bets, 
                which incentivizes them 
                to create more bets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
  }
}