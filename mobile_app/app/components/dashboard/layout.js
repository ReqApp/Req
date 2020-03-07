import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { Container, Header, Title, Left, Right, Body, Card, CardItem, H1, H2, H3, Content, Button, Icon, Footer} from 'native-base';
import styles from './layoutStyles.js';

export default class layout extends React.Component{
    render(){
        const {locationCard, userName} = this.props;
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
            {locationCard}
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