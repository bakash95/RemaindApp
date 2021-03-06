import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Remainder } from './components/remainder/addRemainder';

import { locale } from 'expo-localization'
import i18n from 'i18n-js'

const App = () => {
  i18n.locale = locale
  return (
    <SafeAreaView style={styles.baseContainer}>
      <Remainder />
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10
  }
});
