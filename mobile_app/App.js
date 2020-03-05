import React from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import Constants from "expo-constants";
import openSocket from 'socket.io-client';

export default class App extends React.Component{
  constructor(props){
    super(props);
    // Get server URL to add backend connectivity for Expo
    const {manifest} = Constants;
    const url = `http://${manifest.debuggerHost.split(':').shift()}:9000`;

    this.state = {
      hasLocation: false,
      gettingTime: true,
      serverURL: url,
      time: null,
      location: {
        lat: 0,
        lng: 0
      }
    }
    this.handlePos = this.handlePos.bind(this);
    // Setup socket to server
    this.socket = openSocket(url);
  }

  componentDidMount(){
      navigator.geolocation.getCurrentPosition(this.handlePos);
      this.socket.emit("testConnection");
  }

  handlePos(pos){
    this.setState({hasLocation : true, location : {lat: pos.coords.latitude, lng: pos.coords.longitude}});
  }

  render(){
    const {hasLocation, location} = this.state;
    if(hasLocation){
      this.socket.emit("retrievedUserPos", location);
      return(
        <View style={styles.container}>
          <Image style={{width: 60, height: 60}} source={{uri : 'https://raw.githubusercontent.com/IamCathal/Req/fullBetIntegration/express/public/images/android-chrome-512x512.png?token=AN5LIZW3VQ4EK2UKIB63YWC6L3FTG'}} />
          <Text>Your Location:</Text>
          <Text>Latitude: {location.lat}</Text>
          <Text>Longitude: {location.lng}</Text>

        </View>
      )
    }else{
    return (
      <View style={styles.container}>
        <Text>Could not find your location</Text>
        <Text>Test</Text>
      </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
