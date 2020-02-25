import React, {createRef, Component} from 'react';
import { Map, Marker, Popup, TileLayer, Circle, CircleMarker} from "react-leaflet";
import {Button, Nav, Navbar, NavDropdown, Form, FormControl, Jumbotron, Container, Row, Col, Tabs, Tab, Dropdown, Modal} from 'react-bootstrap/';
import './findLocationBets.css'

// Map component
class DisplayMap extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            hasLocation : false,
            latlng: {
                lat: 51.505,
                lng: -0.09
            },
        }
    }

    // On mount gets user location and available bet regions
    componentDidMount(){
      // Check if geolocation available
      if(!this.props.miniMap){
        if(navigator.geolocation){
          // Check for accuracy
          navigator.geolocation.getCurrentPosition((userPosition => {
            if(userPosition.coords.accuracy > 400){
              // Set user's location
              this.setState({hasLocation : true, latlng : {lat : 53.28211, lng : -9.062186}});
            }else{
              // Manually set user location for testing
              this.setState({hasLocation : true, latlng : { lat : userPosition.coords.latitude, lng : userPosition.coords.longitude }});
            }
          }));
        }
        // Handle geolocation not supported
        else{
          console.log("Not supported")
        }
      }
    }

    // Allows user to select bet on map and view region card
    scrollToRegion(regionID) {
      this.props.scrollToRegion(regionID);
    }

    // Automatically open popup when loaded
    openPopUp(marker){
      if(marker && marker.leafletElement){
        setTimeout(() => {
          marker.leafletElement.openPopup();
        }, 200);
        
      }
    }

    fullMap(){
        // Get state and prop variables
        const {hasLocation} = this.state; 
        const {loading, data, view} = this.props;
  
        // Check if userlocation found
        var userMarker = null;
        if(hasLocation){
          userMarker = <Marker position={this.state.latlng}><Popup closeButton={false} ref={this.openPopUp}><h6>You are here</h6><Button>Select</Button></Popup></Marker>;
        }
  
        // Check if bet regions found
        var betRegionsMap = null;
        // Check if regions are loaded from server
        if(!loading){
          // Check if regions are available
          if(Array.isArray(data) && data.length){
            betRegionsMap = [];
            // Add map markers and popups
            for(var i = 0; i < data.length; i++){
              var center = [data[i].latitude, data[i].longitude];
              betRegionsMap.push(<Marker key={data[i]._id} position={center}><Popup><h6>{data[i].region_name}</h6><Button onClick={this.scrollToRegion.bind(this, data[i]._id)}>See Info</Button></Popup></Marker>);
            }
          }
        }
        return(
            <Map className="full-map"
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
        )
    }

    miniMap(){
      const {regionDetails} = this.props;
      let center = { lat: regionDetails.latitude, lng: regionDetails.longitude};
      let marker = <Marker position={center}/>
      let circle = <Circle center={center} radius={regionDetails.radius}/>
      return (
          <Map className="mini-map"
            center={center}
            zoom={13}>
            <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            {marker}
            {circle}
          </Map>
      )
    }

    render() {
      if(this.props.miniMap){
        return(
          this.miniMap()
        )
      }
      return(
        this.fullMap()
      )
    }
    
}

export default DisplayMap;