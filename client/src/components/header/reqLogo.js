import React,{Component} from 'react';

export class ReqLogo extends React.Component{
    render(){
        return(
            <div className="logo">
                <a href="index.html">
                    <img style={{width: '50px', height: '50px'}} src="/img/reqlogo.jpg" alt="" />
                </a>
            </div>
        );
    }
}