import React, {createRef, Component} from 'react';
import ReactDOM from 'react-dom';
import { Map, Marker, Popup, TileLayer, Circle, CircleMarker} from "react-leaflet";
import {Button, Nav, Navbar, NavDropdown, Form, FormControl, Jumbotron, Container, Row, Col, Tabs, Tab, Dropdown, Modal} from 'react-bootstrap/';
import './index.css';

class DisplayMap extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            hasLocation : false,
            latlng: {
                lat: 51.505,
                lng: -0.09
            },
            loadingRegions : true,
            betRegions : null,
        }
    }

    componentDidMount(){
        if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition((userPosition => {
            console.log(userPosition);
            if(userPosition.coords.accuracy > 400){
              this.setState({hasLocation : true, latlng : {lat : 53.28211, lng : -9.062186}});
            }else{
              this.setState({hasLocation : true, latlng : { lat : userPosition.coords.latitude, lng : userPosition.coords.longitude }});
            }
            fetch("http://localhost:9000/getBettingRegions?lat=" +  this.state.latlng.lat + "&lng=" + this.state.latlng.lng).then(regions => regions.json()).then(regions => this.setState({loadingRegions : false, betRegions : regions})).catch(err => err);
          }));
        }else{
          console.log("Not supported")
        }
    }

    scrollToRegion(regionID){
      this.props.scrollToRegion(regionID);
    }

    render() {
      const {hasLocation} = this.state; 
      const {shownRegion, loadingRegions, betRegions} = this.props;

      // Check if userlocation found
      var userMarker = null;
      if(hasLocation){
        userMarker = <Marker position={this.state.latlng}><Popup><h6>You are here</h6><Button>Select</Button></Popup></Marker>;
      }

      // Check if bet regions found
      var betRegionsMap = null;
      if(!loadingRegions){
        if(Array.isArray(betRegions) && betRegions.length){
          betRegionsMap = [];
          if(shownRegion != null){  
            for(var i = 0; i < betRegions.length; i++){
              var center = [betRegions[i].latitude, betRegions[i].longitude];
              betRegionsMap.push(<Marker key={betRegions[i]._id} position={center}><Popup><h6>{betRegions[i].region_name}</h6><Button onClick={this.scrollToRegion(betRegions[i]._id)}>See info</Button></Popup></Marker>);
              if(betRegions[i]._id === shownRegion){
                betRegionsMap.push(<Circle key={"circle:" + betRegions[i]._id} center={center} radius={betRegions[i].radius} color='blue'/>);
              }
            } 
          }else{
            for(var i = 0; i < betRegions.length; i++){
              var center = [betRegions[i].latitude, betRegions[i].longitude];
              betRegionsMap.push(<Marker key={betRegions[i]._id} position={center}><Popup><h6>{betRegions[i].region_name}</h6><Button onClick={this.scrollToRegion(betRegions[i]._id)}>See Info</Button></Popup></Marker>);
            }
          }
        }
      }
      return(
        <div>
          <Map
            center={this.state.latlng}
            length={4}
            zoom={15}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userMarker}
            {betRegionsMap}
          </Map>
          </div>
      )
    }
    
}

export default DisplayMap;