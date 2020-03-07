import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { Container, Header, Title, Left, Right, Body, Card, CardItem, H1, H2, H3, Content, Button, Icon, Footer} from 'native-base';
import styles from './layoutStyles.js';

export default class layout extends React.Component{
    render(){
        const {location, userName} = this.props;
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
            <View style={styles.nameContainer}>
            <H1 style={styles.userName}>{userName}</H1>
            </View>
            <Card style={styles.card}>
            <CardItem>
                <H3>Your location:</H3>
            </CardItem>
            <CardItem>
                <Icon name="navigate"/>
            </CardItem>
            <CardItem>
                <Text>Latitude: {location.lat}</Text>
            </CardItem>
            <CardItem>
                <Text>Longitude: {location.lng}</Text>
            </CardItem>
            <CardItem>
                <Button style={styles.posButton}>
                    <Text style={styles.buttonText}>Update Position</Text>
                </Button>
            </CardItem>
            </Card>
            </Content>
            <Footer>
            <Button transparent>
                <Text>Logout</Text>
            </Button>
            </Footer>
        </Container>
        )
    }
}