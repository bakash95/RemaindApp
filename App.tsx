import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Remainder } from './components/add-remainder/addRemainder';

const App = () => {
  return (
    <SafeAreaView style={styles.baseContainer}>
      <Remainder/>
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
    flexDirection: 'column',
    paddingLeft : 10,
    paddingRight : 10
  }
});
