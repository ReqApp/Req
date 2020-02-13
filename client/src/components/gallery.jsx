import React, { Component } from 'react'

export default class Gallery extends Component {
  render() {
    return (
      <div>
      <div className="gallery_area">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="section_title text-center mb-50">
                <h3>Our Recent Works</h3>
                <p>These cases are perfectly simple and easy to distinguish. In a free <br /> hour, when our power of choice is untrammelled.</p>
              </div>
            </div>
          </div>
          <div className="row grid">
            <div className="col-xl-4 col-lg-6 grid-item cat1 col-md-6">
              <div className="single-gallery mb-20">
                <div className="portfolio-img">
                  <img src="/img/gallery/1.png" alt="" />
                </div>
                <div className="gallery_hover">
                  <a href="portfolio_details.html" className="hover_inner">
                    <h3>Product Branding</h3>
                    <span>Branding</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 grid-item cat3 cat4 col-md-6">
              <div className="single-gallery mb-20">
                <div className="portfolio-img">
                  <img src="/img/gallery/2.png" alt="" />
                </div>
                <div className="gallery_hover">
                  <a href="portfolio_details.html" className="hover_inner">
                    <h3>Product Branding</h3>
                    <span>Branding</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 grid-item cat4 col-md-6">
              <div className="single-gallery mb-20">
                <div className="portfolio-img">
                  <img src="/img/gallery/3.png" alt="" />
                </div>
                <div className="gallery_hover">
                  <a href="portfolio_details.html" className="hover_inner">
                    <h3>Product Branding</h3>
                    <span>Branding</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-xl-8 col-lg-6 grid-item cat2 col-md-6">
              <div className="single-gallery mb-20">
                <div className="portfolio-img">
                  <img src="/img/gallery/4.png" alt="" />
                </div>
                <div className="gallery_hover">
                  <a href="portfolio_details.html" className="hover_inner">
                    <h3>Product Branding</h3>
                    <span>Branding</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 grid-item cat2 col-md-6">
              <div className="single-gallery mb-20">
                <div className="portfolio-img">
                  <img src="/img/gallery/5.png" alt="" />
                </div>
                <div className="gallery_hover">
                  <a href="portfolio_details.html" className="hover_inner">
                    <h3>Product Branding</h3>
                    <span>Branding</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="More_Works_btn text-center">
                <a className="boxed-btn3-green-2" href="#">More Works</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}