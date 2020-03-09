import React from 'react';
//import PropTypes from 'prop-types';
import Header from '../components/home_page/header'
import Slider from '../components/home_page/slider'
import Team from '../components/home_page/team'
import About from '../components/home_page/about'
import Footer from '../components/home_page/footer'

const home = (<div>
    <Header/>
    <Slider/>
    <About/>
    <Team/>
    <Footer/>
</div>);

export class HomePage extends React.Component{
    render(){
        return home;
    }
}

export default HomePage;