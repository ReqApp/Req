import React, {Component} from 'react';

export class SocialLinks extends React.Component{
    render(){
        return(<div className="socail_links">
        <ul>
          <li>
            <a href="#">
              <i className="ti-facebook" />
            </a>
          </li>
          <li>
            <a href="#">
              <i className="ti-twitter-alt" />
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