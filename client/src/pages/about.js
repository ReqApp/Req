import React,{Component} from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import {Spacing} from '../spacing';


export class About extends React.Component{
    render(){
        return(
            <div>
                <Header/>
                <Spacing/>
                <div className="container">
                     <h1>ABOUT THAT TIME ITS HIGH NOON!!!</h1>
                 </div>
                <Footer/>
            </div>
        )
    }
}