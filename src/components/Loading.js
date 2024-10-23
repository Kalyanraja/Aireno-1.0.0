// src/components/Loading.js
import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const Loading = ({ message, fullScreen }) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={COLORS.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  container: {
    padding: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    ...FONTS.body4,
    color: COLORS.gray500,
    marginTop: SIZES.base,
    textAlign: 'center',
  },
});

export default Loading;