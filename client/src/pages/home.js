import React from 'react';
//import PropTypes from 'prop-types';
import Header from '../components/header';
import Slider from '../components/slider/slider';
import InfoBoxes from '../components/infoboxes/infoboxes';
import HomeMap from '../components/homemap/homemap';
import Team from '../components/team/team';
import Contact from '../components/contact/contact';
import Footer from '../components/footer';


const home = (<div>
    <Header/>
    <Slider/>
    <InfoBoxes/>
    <HomeMap/>
    <Team/>
    <Contact/>
    <Footer/>
</div>);

export class HomePage extends React.Component{
    render(){
        return home;
    }
}

export default HomePage;