import React from 'react'
import { View, Text, StyleSheet, Header } from 'react-native'


export default function Picture() { 

    return (
      <View style={styles.container}>
        <Text>Pictures!</Text>
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
  