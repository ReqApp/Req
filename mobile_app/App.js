import 'react-native-gesture-handler';
import React from 'react';
import { Root } from 'native-base';
import { createStackNavigator } from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Home from './app/components/home';
import Dashboard from './app/components/dashboard/dashboard.js'

// Setup navigation
const RootStack = createStackNavigator({
  Home: {
    screen: Home
  },
  Dashboard: {
    screen: Dashboard
  },
}, { headerMode: 'none' });
const App = createAppContainer(RootStack);

// Wrap with root for toasts
export default () => <Root><App /></Root>;
