import React from 'react';
import { LogoTitle, Button, Text, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons'

const Stack = createStackNavigator();

export default function DefaultLayout(props) { 

    return (
        <Stack.Screen
            name={ props.name }
            component={ props.component }
            options={{
                headerTitle: props => { 
                    return (
                        <Text style={ styles.title }>{ props.name }</Text>
                    )
                },
                headerStyle: { 
                    backgroundColor: '#5a2a95'
                },
                headerTintColor: 'white',
                headerTitleAlign: 'center',
                headerRight: () => (
                    <FontAwesome
                        name='bell-o'
                        onPress={() => alert('This is a button!')}
                        color='#fff'
                        size={20}
                        style={ styles.notification }
                    />
                ),
            }}
        />
    )
};


const styles = StyleSheet.create({ 
    title: { 
        textTransform: 'uppercase', 
        color:'white'
    },
    notification: { 
        marginRight: 25,
    },

})