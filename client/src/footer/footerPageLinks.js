import React,{Component} from 'react';

export class FooterPageLinks extends React.Component{
  render(){
        return(
        <div className="footer_widget">        
        <h3 className="footer_title">
          Useful Links
        </h3>        
        <ul>
          <li><a href='/about'>About </a></li>
          <li><a href='/maps'>Map Viewer</a></li>
          <li><a href='faq'>FAQ</a></li>
        </ul>        
      </div>);
    }
}