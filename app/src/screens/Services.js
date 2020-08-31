import React from 'react'
import { View, Text, StyleSheet, Header } from 'react-native'


export default function Services() { 

    return (
      <View style={styles.container}>
        <Text>Services!</Text>
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
  