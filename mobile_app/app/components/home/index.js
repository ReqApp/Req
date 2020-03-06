import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, Alert} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Button } from 'native-base';
import Constants from "expo-constants";

export default class Home extends React.Component {
    constructor(props){
        const {manifest} = Constants;
        const url = `http://${manifest.debuggerHost.split(':').shift()}:9000`;
        super(props);
        this.state = {
            user_name: "",
            password: "",
            url : url
        }
        this.login = this.login.bind(this);
    }


    login(){    
        const {user_name, password} = this.state;
        if(user_name === 'Admin' && password === 'Admin'){
            this.props.navigation.navigate('Dashboard');
        }else{
            Alert.alert("Error: Username password incorrect");
        }
    }
    render() {
      return (
        <Container>
          <Header />
          <Content>
            <Form>
            <Item>
                <Input placeholder="Username" onChangeText={text => this.setState({user_name : text})}/>
            </Item>
            <Item last>
                <Input placeholder="Password" secureTextEntry={true} onChangeText={text => this.setState({password : text})}/>
            </Item>
            <Button onPress={this.login}>
                <Text>Login</Text>
            </Button>
            </Form>
          </Content>
        </Container>
      );
    }
  }