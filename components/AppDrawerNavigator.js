import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import CustomSideBarMenu  from './CustomSideBarMenu';
import { AppTabNavigator } from './AppTabNavigator';
import SettingScreen from '../screens/SettingScreen';
import MyBarters from '../screens/MyBarters';
import NotificationScreen from '../screens/NotificationScreen';
import MyReceivedItems from "../screens/MyReceivedItems";

export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppTabNavigator
  },
  MyReceivedItems : {
    screen : MyReceivedItems
  },
  Notifications : {
    screen : NotificationScreen
  },
  MyBarters : {
    screen : MyBarters
  },
  Settings:{
    screen: SettingScreen
  },
},
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })