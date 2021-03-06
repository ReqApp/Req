import React from 'react';
import { Text, Alert} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Button, Label, Left, Right, Body, Title, H2} from 'native-base';
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
            //this.setState({user_name : "", password: ""});
            this.props.navigation.navigate('Dashboard');
          }else{
            Alert.alert("Incorrect username or password");
          }
        }).catch(err => Alert.alert("Could not login"));
    }

    updatePassword = (text) => {
      this.setState({password : text});
    }

    updateUsername = (text) => {
      this.setState({user_name : text});
    }

    render() {
      console.disableYellowBox = true;  
      return (
        <Container>
            <Header>
            <Left />
            <Body>
              <Title>Req</Title>
            </Body>
            <Right />
          </Header>
          <Content>
            <Form>
            <H2 style={styles.title}>Login</H2>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input onChangeText={this.updateUsername}/>
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input secureTextEntry={true} onChangeText={this.updatePassword}/>
            </Item>
            <Button onPress={this.login} block light style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </Button>
            </Form>
          </Content>
        </Container>
      );
    }
  }