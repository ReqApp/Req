import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { Card, CardItem, H3, Button, Toast} from 'native-base';
import Constants from "expo-constants";
import openSocket from 'socket.io-client';
import styles from './styles.js';
import Layout from './layout.js';
import LocationCardLayout from './locationCardLayout.js';

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
      },
    }
    // Bind methods to class
    this.handlePos = this.handlePos.bind(this);
    this.handleLocationError = this.handleLocationError.bind(this);
    this.sendCoords = this.sendCoords.bind(this);
    this.getUser = this.getUser.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    // Setup socket to server
    this.socket = openSocket(url);
  }

  componentDidMount(){
    this.getUser();
    // Get user location
    const locationOptions = {
      enableHighAccuracy: true,
    }
    navigator.geolocation.watchPosition(this.handlePos, this.handleLocationError, locationOptions);

    // Listen for response from front-end
    this.socket.on('response', (data) => {
      const {userName} = this.state;
      if(data.user === userName){
        Toast.show({
          text: "Location Received!",
          duration: 3000,
          type: "success"
        });
        }
    });
  }

  getUser(){
    let {serverURL, errors } = this.state;
    this.setState({gettingUser : true});
    fetch(serverURL + '/users/isSignedIn', {
      method: 'POST',
      credentials : "include" 
    })
    .then(res => res.json())
    .then(res => {
      errors.userNotRetrived = false;
      this.setState({userName : res.body, gettingUser: false, errors : errors});
    }).catch(err => {
      errors.userNotRetrived = true;
      this.setState({errors : errors, gettingUser : false});

    });
  }

  handlePos(pos){
    // Handle inaccurate location case
    let {errors} = this.state;
    if(pos.coords.accuracy > 100){
      errors.locationInaccurate = true;
      this.setState({errors : errors});
    }else{
      errors.locationInaccurate = false;
      errors.locationNotRetrieved = false;
      this.setState({gettingLocation : false, location : {lat: pos.coords.latitude, lng: pos.coords.longitude}, errors : errors});
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
    const {userName, location} = this.state;
    this.socket.emit('userPosition', { user_name : userName, location : location});
  }

  handleLogOut(){
    this.props.navigation.navigate('Home');
  }

  render(){
    console.disableYellowBox = true;
    const {errors, location, userName, gettingLocation, gettingUser} = this.state;

    if(gettingUser){
      return(
          <View style={styles.loadingUser}>
            <ActivityIndicator size='large'/>
          </View>
      )
    }
    else if(errors.userNotRetrived){
      return(
        <View style={styles.loadingUser}>
          <Text style={styles.errorText}>Could not retrieve user information</Text>
          <Button bordered style={styles.retrieveUser} onPress={this.getUser}>
            <Text>Try Again</Text>
          </Button>
        </View>
      )
    }
    else if(gettingLocation){
      let gettingLocationCard = 
        <Card style={styles.card}>
          <CardItem>
            <H3>Getting Your Location</H3>
          </CardItem>
          <CardItem>
            <ActivityIndicator size='large' />
          </CardItem>
        </Card>;
      return(
        <Layout locationCard={gettingLocationCard} userName={userName}/>
      )
    }
    else if(errors.locationNotRetrieved){
      Toast.show({
        text: "Location data not available",
        buttonText: "Okay",
        duration: 10000,
        type: "warning"
      });
      let locationCard = <Card style={styles.card}>
        <LocationCardLayout location={location} />
        <CardItem>
            <Button disabled style={styles.posButton}>
                <Text style={styles.buttonText}>Update Position</Text>
            </Button>
        </CardItem>
      </Card>;
      return(
        <Layout locationCard={locationCard} userName={userName}/>
      )
    }
    else if(errors.locationInaccurate){
      Toast.show({
        text: "Location inaccurate",
        buttonText: "Okay",
        duration: 10000,
        type: "warning"
      });
      let locationCard = <Card style={styles.card}>
        <LocationCardLayout location={location} />
        <CardItem>
            <Button disabled style={styles.posButton}>
                <Text style={styles.buttonText}>Update Position</Text>
            </Button>
        </CardItem>
      </Card>;
      return(
        <Layout locationCard={locationCard} userName={userName}/>
      )
    }
    else{
      let locationCard =             
      <Card style={styles.card}>
        <LocationCardLayout location={location} />
        <CardItem>
            <Button style={styles.posButton} onPress={this.sendCoords} light>
                <Text style={styles.buttonText}>Update Position</Text>
            </Button>
        </CardItem>
      </Card>;
      return(
        <Layout locationCard={locationCard} userName={userName} handleLogOut={this.handleLogOut}/>
      )
    }
  }
}

