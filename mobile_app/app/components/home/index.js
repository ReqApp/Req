import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, Alert} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Button, Label, Left, Right, Body, Title} from 'native-base';
import Constants from "expo-constants";
import styles from './styles.js';

export default class Home extends React.Component {
    constructor(props){
        const {manifest} = Constants;
        const url = `http://${manifest.debuggerHost.split(':').shift()}:9000`;
        super(props);
        this.state = {
            user_name: "",
            password: "",
            serverURL : url
        }
        this.login = this.login.bind(this);
    }


    login(){    
        const {user_name, password} = this.state;
        fetch(this.state.serverURL + '/users/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_name : user_name,
            password : password
          })
        }).then((res) => res.json()).then((res) => {
          if(res.status === "success"){
            this.props.navigation.navigate('Dashboard');
          }else{
            Alert.alert("Incorrect username or password");
          }
        }).catch(err => Alert.alert("Could not login"));
    }
    render() {
      return (
        <Container>
            <Header>
            <Left />
            <Body>
              <Title>Login</Title>
            </Body>
            <Right />
          </Header>
          <Content>
            <Image source={require('./logo.png')} style={styles.logo}/>
            <Form>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input onChangeText={text => this.setState({user_name : text})}/>
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input secureTextEntry={true} onChangeText={text => this.setState({password : text})}/>
            </Item>
            <Button onPress={this.login} block primary style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </Button>
            </Form>
          </Content>
        </Container>
      );
    }
  }

  // const styles = StyleSheet.create({
  //   button: {
  //     marginTop: 20,
  //     width: '80%',
  //     justifyContent: 'center',
  //     alignSelf: 'center'
  //   },
  //   buttonText:{
  //     color: 'white'
  //   },
  //   logo: {
  //     marginTop: 20,
  //     alignSelf: 'center',
  //     height: 50,
  //     width: 50
  //   }
  // });