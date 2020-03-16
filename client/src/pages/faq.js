import React,{Component} from 'react';
import Faq from 'react-faq-component';
import Header from '../components/header';
import Footer from '../components/footer';
import {Spacing} from '../spacing';

const aboutLink = <a style = "color:#0000FF" href = "/about">About</a>
const title = "Req FAQ, A Real life based betting app developed as part of a 2nd year software engineering module."
const cathal ="<a href ='https://github.com/IamCathal', style='color:#0366d6'>Cathal O'Callaghan</a>"
const eoin = "<a href ='https://github.com/EoinMcArdle99', style='color:#0366d6'>Eoin Mc Ardle</a>"
const karl = "<a href ='https://github.com/filthyhound', style='color:#0366d6'>Karl Gordon</a>"
const rory = "<a href ='https://github.com/Rorysweeney99', style='color:#0366d6'>Rory Sweeney</a>"
const faqDetails = {
    title: <b>{title}</b>,
    rows:[
        {
          title: <b>What is Req?</b>,
          content: "The goal of our app is to combine a community driven network with a focus on geolocation to stand out from the crowd in terms of the modern social media app."
                    +"With Req, users can bet on anything and everything."
                    +"Users create bets that are tied to real world locations in such a way that if someone wants take part in a bet they have to physically be in the set location of the bet."
        },
        {
          title: <b>How does it work?</b>,
          content: "Uses who create bets are incentivized to attract the most amount of people through a 10% cut of the total amount of coins placed."
                  +"If a bet has not been resolved within 24 hours of it's set deadline the creator of the bet is punished and all bets are returned."
                  +"Until the bet has been completed identifying information such as usernames are not disclosed as a measure to combat creators resolving their bets in favor of someone they know." 
                  +"Bet creators can also set their own payout percentages for the 1st, 2nd and 3rd place winners." 
                  +"This has resulted in some interesting payouts such as 1st and 3rd place getting nothing but 2nd place wins the whole pot."
                  +"<br/>"
                  +"Alongside user made bets there are a handful of official bets set by Req." 
                  +"One of the most interesting ones involves guessing how many times a big red button has been clicked by all users in a 24 hour time frame."
                  +"This big red button sits on browsing page for bets and user's are encouraged to click or not click to their hearts content."
                  +"The counter for the amount of global clicks is not made public until the bet has been finalized."
        },
        {
          title: <b>What stack is Req using?</b>,
          content: "For the front end we're using pure React with material ui." 
                  +"On the backend we're primarily using express for the routing of requests and main functionality."
                  +"There are also some maintenance scripts for tasks such as sending emails, automating Req bets and gathering data for Req bets that are written in a mix of python and go."
                  +"<br/>"
                  +"In terms of hosting we are deploying to AWS thanks to the $30 in credits given out to all verified GitHub student developers."
        },
        {
          title: <b>Who made Req?</b>,
          content: "<ul><li>"+cathal+"</li><li>"+eoin+"</li><li>"+karl+"</li><li>"+rory+"</li></ul>"
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
