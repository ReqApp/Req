import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { Container, Header, Title, Left, Right, Body, Card, CardItem, H1, H2, H3, Content, Button, Icon, Footer} from 'native-base';
import Constants from "expo-constants";
import openSocket from 'socket.io-client';
import styles from './styles.js';
import Layout from './layout.js';

export default class Dashboard extends React.Component{
  constructor(props){
    super(props);
    // Get server URL to add backend connectivity for Expo
    // TODO localhost
    const {manifest} = Constants;
    const url = `http://${manifest.debuggerHost.split(':').shift()}:9000`;
    this.state = {
      gettingLocation: true,
      gettingUser: true,
      serverURL: url,
      userName : "user",
      errors: {
        userNotRetrived: false,
        locationNotRetrieved: false,
        locationInaccurate: false
      },
      location: {
        lat: 0,
        lng: 0
      }
    }
    // Bind methods to class
    this.handlePos = this.handlePos.bind(this);
    this.handleLocationError = this.handleLocationError.bind(this);
    this.sendCoords = this.sendCoords.bind(this);
    // Setup socket to server
    this.socket = openSocket(url);
  }

  componentDidMount(){
    // Get user details from server
    fetch(this.state.serverURL + '/users/profile', {
      method: 'GET',
      credentials : "same-origin" 
    }).then(res => res.text()).then(res => this.setState({userName : res, gettingUser: false})).catch(err => {
      // Handle user not retrieved case
      let {errors}= this.state;
      errors.userNotRetrived = true;
      this.setState({errors : errors});
    });

    // Get user location
    const locationOptions = {
      enableHighAccuracy: true,
    }
    navigator.geolocation.getCurrentPosition(this.handlePos, this.handleLocationError, locationOptions);
  }

  handlePos(pos){
    // Handle inaccurate location case
    if(pos.coords.accuracy > 500){
      let {errors} = this.state;
      errors.locationInaccurate = true;
      this.setState({errors : errors});
    }else{
      this.setState({gettingLocation : false, location : {lat: pos.coords.latitude, lng: pos.coords.longitude}});
    }
  }

  handleLocationError(err){
    // Handle locaton not retrieved case
    let {errors} = this.state;
    errors.locationNotRetrieved = true;
    this.setState({errors : errors});
  }

  sendCoords(){
    // Send user name as identifier to match user to position
    this.socket.emit('userPosition', { user_name : "testUser", location : this.state.location});
  }

  render(){
    const {errors, location, userName, gettingLocation, gettingUser} = this.state;

    if(gettingUser){
      return(
          <View style={styles.loadingUser}>
            <ActivityIndicator size='large' color='black'/>
          </View>
      )
    }
    // else if(gettingLocation){
      
    // }
    else{
      return(
        <Layout location={location} userName={userName} />
      )
    }
  }
}

