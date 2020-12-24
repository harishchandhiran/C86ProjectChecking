import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AppStackNavigator } from './AppStackNavigator'
import ExchangeScreen from '../screens/ExchangeScreen'

export const AppTabNavigator = createBottomTabNavigator({
  Donate : {
    screen: AppStackNavigator,
    navigationOptions :{
      tabBarLabel : "Donate",
    }
  },
  Exchange: {
    screen: ExchangeScreen,
    navigationOptions :{
      tabBarLabel : "Exchange",
    }
  }
});