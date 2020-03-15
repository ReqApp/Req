import React from 'react';
//import PropTypes from 'prop-types';
<<<<<<< Updated upstream
import Header from '../components/home_page/header'
import Slider from '../components/home_page/slider'
import Team from '../components/home_page/team'
import About from '../components/home_page/about'
import Footer from '../components/home_page/footer'
=======
import Header from '../components/header'
import Slider from '../components/home_page/slider/slider'
// import Team from '../components/team'
import {About} from '../pages/about'
import Footer from '../components/footer'

>>>>>>> Stashed changes

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