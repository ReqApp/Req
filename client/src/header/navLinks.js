import React,{Component} from 'react';

export class NavLinks extends React.Component{
    render(){
        return(
            <div className="main-menu  d-none d-lg-block">
            <nav>
                <ul id="navigation">
                    <li><a className="active" href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/faq">FAQ</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
            </div>
        );
    }
}