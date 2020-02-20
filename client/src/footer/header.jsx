import React, { Component } from 'react'

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
                  <div className="social_media_links">
                    <a href="#">
                      <i className="fa fa-linkedin" />
                    </a>
                    <a href="#">
                      <i className="fa fa-facebook" />
                    </a>
                    <a href="#">
                      <i className="fa fa-google-plus" />
                    </a>
                  </div>
                </div>
                <div className="col-xl-6 col-md-6">
                  <div className="short_contact_list">
                    <ul>
                      <li><a href="#"> <i className="fa fa-envelope" /> info@docmed.com</a></li>
                      <li><a href="#"> <i className="fa fa-phone" /> 1601-609 6780</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="sticky-header" className="main-header-area">
            <div className="container">
              <div className="header_bottom_border">
                <div className="row align-items-center">
                  <div className="col-xl-3 col-lg-2">
                    <div className="logo">
                      <a href="index.html">
                        <img style={{width: '50px', height: '50px'}} src="/img/reqlogo.jpg" alt="" />
                      </a>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-7">
                    <div className="main-menu  d-none d-lg-block">
                      <nav>
                        <ul id="navigation">
                          <li><a className="active" href="index.html">Home</a></li>
                          <li><a href="about.html">About</a></li>
                          <li><a href="about.html">FAQ</a></li>
                          <li><a href="contact.html">Contact</a></li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3 d-none d-lg-block">
                    <div className="Appointment">
                      <div className="search_button">
                        <a href="#">
                          <i className="ti-search" />
                        </a>
                      </div>
                      <div className="book_btn d-none d-lg-block">
                        <a className="popup-with-form" href="#test-form">Make a Bet</a>
                      </div>
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