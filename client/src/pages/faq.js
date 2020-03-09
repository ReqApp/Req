import React,{Component} from 'react';
import Faq from 'react-faq-component';
import Header from '../components/header';
import Footer from '../components/footer';
import {Spacing} from '../spacing';

const aboutLink = <a style = "color:#0000FF" href = "/about">About</a>

const faqDetails = {
    title: "FAQ (How to bet on our webstite)",
    rows:[
        {
          title: "What is Req about?",
          content: `Feel free to check out our <a style = "color:#0000FF" href = "/about">About</a> page for more info!`
        },
        {
          title: "How to I place a bet?",
          content: `Simply click on the "Place a Bet" button and fill out the details of your social bet`
        },
        {
          title: "Can I place a bet based on location?",
          content: `Yes you can, it is a feature that can be switched on or off when one places a bet `
        },
        {
          title: "Is my data safe?",
          content: `Yes it is, as your data is fully encrypted and cleaned on a monthly basis`
        }
    ],
}

export class FAQ extends React.Component{
    render(){
        return(
            <div>
                <Header/>
                <Spacing/>
                <section className="accordion-section clearfix mt-3" aria-label="Question Accordions">
                  <div className ="container">
                    <Faq data={faqDetails} styles = {{
                                            bgColor: '#28AE60',
                                            titleTextColor: 'black',
                                            rowTitleColor: 'black',
                                            rowContentColor: 'black'
                                                                  }}/>
                  </div>  
                </section>
                <Footer/>
            </div>
        );
    }
}
