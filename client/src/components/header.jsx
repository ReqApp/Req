import React, { Component } from 'react'
import {ContactList} from '../header/headerContactList';
import {ReqLogo} from '../header/reqLogo';
import {NavLinks} from '../header/navLinks';
import { HeaderSocialLinks } from '../header/headerSocialLinks';
import { HeaderBetButton } from '../header/headerBetButton';
import {SearchButton} from '../header/searchButton';
import './component_css/header.css';

export default class Header extends Component {
  render() {
    return (
      <div>
      <header>
        <div className="header-area ">
          <div className="header-top_area d-none d-lg-block">
            <div className="container">
              <div className="row">
                <div className="col-xl-6 col-md-6 ">
                <HeaderSocialLinks/>
                </div>
                <div className="col-xl-6 col-md-6">
                  <ContactList/>
                </div>
              </div>
            </div>
          </div>
          <div id="sticky-header" className="main-header-area">
            <div className="container">
              <div className="header_bottom_border">
                <div className="row align-items-center">
                  <div className="col-xl-3 col-lg-2">
                    <ReqLogo/>
                  </div>
                  <div className="col-xl-6 col-lg-7">
                    <NavLinks/>
                  </div>
                  <div className="col-xl-3 col-lg-3 d-none d-lg-block">
                    <div className="Appointment">
                      <SearchButton/>
                      <HeaderBetButton/>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mobile_menu d-block d-lg-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
    )
  }
}