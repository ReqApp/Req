import React, { Component } from 'react'
import {FooterLogo} from '../footer/footerLogo';
import {FooterSocialLinks} from '../footer/footerSocialLinks';
import {Services} from '../footer/services';
import {FooterPageLinks} from '../footer/footerPageLinks';
import {ReqAddress} from '../footer/reqAddress';

export default class Footer extends Component {
  render() {
    return (
      <div>
      <footer className="footer">
        <div className="footer_top">
          <div className="container">
            <div className="row">
              <div className="col-xl-4 col-md-6 col-lg-4">
                <div className="footer_widget">
                  <FooterLogo/>
                  <p>
                    Firmament morning sixth subdue darkness
                    creeping gathered divide.
                  </p>
                  <FooterSocialLinks/>
                </div>
              </div>
              <div className="col-xl-2 offset-xl-1 col-md-6 col-lg-3">
                <Services/>
              </div>
              <div className="col-xl-2 col-md-6 col-lg-2">
                <FooterPageLinks/>
              </div>
              <div className="col-xl-3 col-md-6 col-lg-3">
                <ReqAddress/>
              </div>
            </div>
          </div>
        </div>
        <div className="copy-right_text">
          <div className="container">
            <div className="footer_border" />
            <div className="row">
              <div className="col-xl-12">
                <p className="copy_right text-center">
                  {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                  Copyright © All rights reserved | This template is made with <i className="fa fa-heart-o" aria-hidden="true" /> by <a href="https://colorlib.com" target="_blank">Colorlib</a>
                  {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    )
  }
}