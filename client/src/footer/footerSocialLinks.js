import React from 'react';

export class FooterSocialLinks extends React.Component{
    render(){
        return(<div className="social_links">
        <ul>
          <li>
            <a href="#">
              <i className="fa fa-facebook" />
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-linkedin" />
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-instagram" />
            </a>
          </li>
        </ul>
      </div>);
    }
}