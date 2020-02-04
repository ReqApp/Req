import React, {createRef, Component} from 'react';
import ReactDOM from 'react-dom';
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import './index.css';

/*
class ParentMap extends React.Component{
    constructor(props){
        super(props);
        this.userLocation = {
            locationFound : false,
            latlng : {
                lat : 0,
                lng : 0
            }
        }

    }

    render(){
        this.locateUser()
        return(
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
*/

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

ReactDOM.render(
    <DisplayMap />,
    document.getElementById('root')
)


/*
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
*/
  
/*
import App from './App';
import * as serviceWorker from './serviceWorker';
*/

//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
