import React, {createRef, Component} from 'react';
import { Map, Marker, Popup, TileLayer, Circle, CircleMarker} from "react-leaflet";
import {Button, Nav, Navbar, NavDropdown, Form, FormControl, Jumbotron, Container, Row, Col, Tabs, Tab, Dropdown, Modal} from 'react-bootstrap/';
//import openSocket from 'socket.io-client';
//import './findLocationBets.css';

// TODO lift state so that location is found in location bets.js

// Map component
export default class DisplayMap extends React.Component{
    constructor(props){
        super(props);
        this.state = {
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
        // After lifting state
        const {hasLocation, userLocation, accurate, loadingData, data} = this.props;
        console.log(userLocation);
  
        // Check if userlocation found
        var userMarker = null;
        if(hasLocation){
          userMarker = <Marker 
                          position={userLocation}>
                          <Popup 
                            closeButton={false} 
                            ref={this.openPopUp}>
                            <h6>You are here</h6>
                            <Button>Select</Button>
                          </Popup>
                        </Marker>;
        }
  
        // Check if bet regions found
        var betRegionsMap = null;
        // Check if regions are loaded from server
        if(!loadingData){
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
        if(hasLocation){
          if(accurate){
            return(
                <Map style={styles.fullMap}
                  center={userLocation}
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
          }else{
            return(
              <Map style={styles.fullMap}
                center={userLocation}
                length={4}
                zoom={8}>
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </Map>
            )
          }
        }
        return null;
    }

    miniMap(){
      //const {regionDetails} = this.props;
      let size = {
        width: '100%',
        height: '250px'
      }
      let center = null;
      let circle = null;

      if(this.props.height){
        size.height = this.props.height;
      }
      if(this.props.regionDetails){
        center = { lat: this.props.regionDetails.latitude, lng: this.props.regionDetails.longitude};
        circle = <Circle center={center} radius={this.props.regionDetails.radius}/>
      }
      if(this.props.userLocation && this.props.radius){
        center = this.props.userLocation;
        circle = <Circle center={center} radius={this.props.radius}/>
      }
      //let center = { lat: regionDetails.latitude, lng: regionDetails.longitude};
      let marker = <Marker position={center}/>
      // let circle = <Circle center={center} radius={regionDetails.radius}/>
      return (
          <Map style={size}
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

const styles = {
  fullMap : {
    width: '100%',
    height: '70vh',
    padding: '5px'
  },
  miniMap : {
    width: '100%',
    height: '250px'
  }
};
