import React from 'react';
import { Text, View } from 'react-native';
import { CardItem, H3, Icon,} from 'native-base';
import styles from './locationCardStyles.js';

export default class LocationCardLayout extends React.Component{
    render(){
        const {location} = this.props;
        return(
            <View style={styles.center}>
                <CardItem>
                    <H3>Your Location:</H3>
                </CardItem>
                <CardItem>
                    <Icon type='MaterialIcons' name="room"/>
                </CardItem>
                <CardItem style={styles.item}>
                    <Text>Latitude: {location.lat}</Text>
                </CardItem>
                <CardItem style={styles.item}>
                    <Text>Longitude: {location.lng}</Text>
                </CardItem>
            </View>
        )
    }
}