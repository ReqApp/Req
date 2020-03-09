import React,{Component} from 'react';

export class ReqAddress extends React.Component{
    render(){
        return(<div className="footer_widget">
        <h3 className="footer_title">
          Address
        </h3>
        <ul>
          <li>NUIG, University Rd, Galway, Ireland</li>
          <li>087 123-4567</li>
          <li><a href="#"> reqnuig@gmail.com</a></li>
        </ul>
      </div>);
    }
}