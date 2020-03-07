import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, Image, Button} from 'react-native';
import { Root } from 'native-base';
import Constants from "expo-constants";
import openSocket from 'socket.io-client';
import { createStackNavigator } from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Home from './app/components/home';
import Dashboard from './app/components/dashboard/dashboard.js'

const RootStack = createStackNavigator({
  Home: {
    screen: Home
  },
  Dashboard: {
    screen: Dashboard
  },
}, { headerMode: 'none' });

const App = createAppContainer(RootStack);

export default () => <Root><App /></Root>;

// export default class App extends React.Component{
//   constructor(props){
//     super(props);
//     // Get server URL to add backend connectivity for Expo
//     // TODO localhost
//     const {manifest} = Constants;
//     const url = `http://${manifest.debuggerHost.split(':').shift()}:9000`;

//     this.state = {
//       hasLocation: false,
//       gettingTime: true,
//       serverURL: url,
//       time: null,
//       location: {

//         lat: 0,
//         lng: 0
//       }
//     }
//     this.handlePos = this.handlePos.bind(this);
//     this.handleLogin = this.handleLogin.bind(this);
//     // Setup socket to server
//     this.socket = openSocket(url);
//     this.sendCoords = this.sendCoords.bind(this);
//   }

//   componentDidMount(){
//       navigator.geolocation.getCurrentPosition(this.handlePos);
//   }

//   handlePos(pos){
//     this.setState({hasLocation : true, location : {lat: pos.coords.latitude, lng: pos.coords.longitude}});
//   }

//   handleLogin(){
//     //fetch(this.state.serverURL + "/getTime").then((res) => res.json()).then((res) => console.log(res));
//     fetch(this.state.serverURL + '/users/login', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         user_name : "testUser",
//         password : "gremlinsunderthebridge"
//       })
//     }).then((res) => res.json()).then((res) => {
//       console.log(res)
//     }).bind(this).catch(err => console.log(err));
//   }

//   sendCoords(){
//     // Send user name as identifier to match user to position
//     this.socket.emit('userPosition', { user_name : "testUser", location : this.state.location});
//   }

//   render(){
//     const {hasLocation, location} = this.state;
//     return(
//       <View style={styles.container}>
//         <Text>Test</Text>
//         <Button title="Send Coords" onPress={this.sendCoords}></Button>
//       </View>
//     )

//     /*if(hasLocation){
//       this.socket.emit("retrievedUserPos", location);
//       return(
//         <View style={styles.container}>
//           <Image style={{width: 60, height: 60}} source={{uri : 'https://raw.githubusercontent.com/IamCathal/Req/fullBetIntegration/express/public/images/android-chrome-512x512.png?token=AN5LIZW3VQ4EK2UKIB63YWC6L3FTG'}} />
//           <Text>Your Location:</Text>
//           <Text>Latitude: {location.lat}</Text>
//           <Text>Longitude: {location.lng}</Text>

//         </View>
//       )
//     }else{
//     return (
//       <View style={styles.container}>
//         <Text>Could not find your location</Text>
//         <Text>Test</Text>
//       </View>
//       )
//     }*/
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
