import React from 'react';
import { Text, View } from 'react-native';
import { Container, Header, Title, Left, Right, Body, H1, Content, Button, Footer} from 'native-base';
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
            <Button transparent onPress={this.props.handleLogOut}>
                <Text>Logout</Text>
            </Button>
            </Footer>
        </Container>
        )
    }
}