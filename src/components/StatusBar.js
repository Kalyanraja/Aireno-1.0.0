// src/components/StatusBar.js
import React from 'react';
import { StatusBar as RNStatusBar, View, Platform, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 40 : RNStatusBar.currentHeight;

const StatusBar = ({ backgroundColor, barStyle = 'light-content', translucent = true }) => {
  return (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <RNStatusBar
        animated={true}
        backgroundColor={backgroundColor}
        barStyle={barStyle}
        translucent={translucent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});

export default StatusBar;