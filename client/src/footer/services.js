import React,{Component} from 'react';

export class Services extends React.Component{
    render(){
        return(
            <div className="footer_widget">
                  <h3 className="footer_title">
                    Services
                  </h3>
                  <ul>
                    <li><a href="#">Design</a></li>
                    <li><a href="#">Development</a></li>
                    <li><a href="#">Marketing</a></li>
                    <li><a href="#">Consulting</a></li>
                    <li><a href="#">Finance</a></li>
                  </ul>
                </div>
        );
    }
}