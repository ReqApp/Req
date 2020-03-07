import React from 'react';
import { StyleSheet, Text, View, Image, TextInput} from 'react-native';
import { Container, Header, Title, Left, Right, Body, Card, CardItem, H1, H2, H3, Content, Button, Icon} from 'native-base';
import Constants from "expo-constants";
import openSocket from 'socket.io-client';
import styles from './styles.js';

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
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Dashboard</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
        <H1 style={styles.userName}>{this.state.userName}</H1>
        <Card>
          <CardItem>
            <H3>Your location:</H3>
          </CardItem>
          <CardItem>
            <Text>Latitude: {location.lat}</Text>
          </CardItem>
          <CardItem>
            <Text>Longitude: {location.lng}</Text>
          </CardItem>
          <CardItem>
            <Button iconLeft onPress={this.sendCoords} bordered style={styles.posButton}>
              <Icon type="MaterialIcons" name="room"/>
              <Text style={styles.posButtonText}>Update Position</Text>
            </Button>
          </CardItem>
        </Card>
        <View style={styles.container}>
          <Text>{this.state.userName}</Text>
        </View>
        </Content>
      </Container>
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

