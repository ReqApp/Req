import React from 'react';
import { StyleSheet, Text, View, Image, Button, TextInput} from 'react-native';
import { Container, Header, Content, Form, Item, Input } from 'native-base';
import Constants from "expo-constants";
import openSocket from 'socket.io-client';

export default class Dashboard extends React.Component{
  constructor(props){
    super(props);
    // Get server URL to add backend connectivity for Expo
    // TODO localhost
    const {manifest} = Constants;
    const url = `http://${manifest.debuggerHost.split(':').shift()}:9000`;

    this.state = {
      hasLocation: false,
      gettingTime: true,
      serverURL: url,
      userName : "user",
      time: null,
      location: {
        lat: 0,
        lng: 0
      }
    }
    this.handlePos = this.handlePos.bind(this);
    // Setup socket to server
    this.socket = openSocket(url);
    this.sendCoords = this.sendCoords.bind(this);
  }

  componentDidMount(){
      navigator.geolocation.getCurrentPosition(this.handlePos);
      fetch(this.state.serverURL + '/users/profile', {
        method: 'GET',
        credentials : "same-origin" 
      }).then(res => res.text()).then(res => this.setState({userName : res})).catch(err => console.log(err));
  }

  handlePos(pos){
    this.setState({hasLocation : true, location : {lat: pos.coords.latitude, lng: pos.coords.longitude}});
  }

  sendCoords(){
    // Send user name as identifier to match user to position
    this.socket.emit('userPosition', { user_name : "testUser", location : this.state.location});
  }

  render(){
    const {hasLocation, location} = this.state;
    return(
      <View style={styles.container}>
        <Text>{this.state.userName}</Text>
        <Button title="Send Coords" onPress={this.sendCoords}></Button>
      </View>
    )

    /*if(hasLocation){
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
    }*/
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