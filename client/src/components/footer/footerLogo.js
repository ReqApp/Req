import React, {Component} from 'react';
import logo from '../home_page/images/reqlogo.jpg';

export class FooterLogo extends React.Component{
    render(){
        return(<div className="footer_logo">
        <a href="#">
          <img style={{width: '150px', height: '150px'}} src={logo} alt="" />
        </a>
      </div>);
    }
}