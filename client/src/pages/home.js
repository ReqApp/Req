import React from 'react';
//import PropTypes from 'prop-types';
import Header from '../components/header';
import Slider from '../components/slider';
//import Team from '../components/team';
import { About } from '../pages/about';
import Footer from '../components/footer';


const home = (<div>
    <Header/>
    <Slider/>
    <About/>
    <Footer/>
</div>);

export class HomePage extends React.Component{
    render(){
        return home;
    }
}

export default HomePage;