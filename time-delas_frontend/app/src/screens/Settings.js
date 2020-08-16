import React from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'


export default function Settings() { 

    return (
      <View style={styles.container}>
        <Text>Settings!</Text>
        <TextInput 
              placeholder='Password'
            />
      </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }
  });
  