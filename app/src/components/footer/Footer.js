import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Main from '../../screens/Main'
import Hello from '../../screens/Hello'

const Tab = createBottomTabNavigator();

export default function Footer() {
  return (
    <Tab.Navigator>
        <Tab.Screen name='Main' component={Main} />
        <Tab.Screen name='Hello' component={Hello} />
    </Tab.Navigator>
  );
}