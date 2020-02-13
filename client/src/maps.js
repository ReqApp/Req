import React, {createRef, Component} from 'react';
import ReactDOM from 'react-dom';
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { geolocated } from "react-geolocated";
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
        }
        this.mapRef = React.createRef();

    }

    handleClick = () => {
      const map = this.mapRef.current
      if (map != null) {
        map.leafletElement.locate()
      }
    }
  
    handleLocationFound = (e: Object) => {
      this.setState({
        hasLocation: true,
        latlng: e.latlng,
      })
    }

    render() {
        const marker = this.state.hasLocation ? (
          <Marker position={this.state.latlng}>
            <Popup>You are here</Popup>
          </Marker>
        ) : null
    
        return (
          <Map
            center={this.state.latlng}
            length={4}
            onClick={this.handleClick}
            onLocationfound={this.handleLocationFound}
            ref={this.mapRef}
            zoom={13}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {marker}
          </Map>
        )
      }
}

export default DisplayMap;