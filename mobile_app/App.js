import React from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';

export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      hasLocation: false,
      location: {
        lat: 0,
        lng: 0
      }
    }
    this.handlePos = this.handlePos.bind(this);
  }

  componentDidMount(){
      navigator.geolocation.getCurrentPosition(this.handlePos);
  }

  handlePos(pos){
    this.setState({hasLocation : true, location : {lat: pos.coords.latitude, lng: pos.coords.longitude}});
  }

  render(){
    const {hasLocation, location} = this.state;
    if(hasLocation){
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
