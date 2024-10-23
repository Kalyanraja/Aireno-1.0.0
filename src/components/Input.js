// src/components/Input.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const Input = ({
  label,
  icon,
  error,
  password,
  style,
  onFocus = () => {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(password);
  const inputAnim = new Animated.Value(0);

  const handleFocus = () => {
    onFocus();
    setIsFocused(true);
    Animated.spring(inputAnim, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(inputAnim, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = inputAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.gray300, COLORS.primary]
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View style={[
        styles.inputContainer,
        { borderColor },
        error && styles.errorInput
      ]}>
        {icon && (
          <Icon
            name={icon}
            style={styles.icon}
            size={20}
            color={isFocused ? COLORS.primary : COLORS.gray500}
          />
        )}
        <TextInput
          {...props}
          secureTextEntry={hidePassword}
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={COLORS.gray400}
        />
        {password && (
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            <Icon
              name={hidePassword ? 'eye-off' : 'eye'}
              style={styles.icon}
              size={20}
              color={COLORS.gray500}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.padding,
  },
  label: {
    ...FONTS.body4,
    color: COLORS.gray500,
    marginBottom: SIZES.base,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    paddingHorizontal: SIZES.padding,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    ...FONTS.body3,
    color: COLORS.text,
    marginLeft: SIZES.base,
  },
  icon: {
    marginRight: 10,
  },
  errorInput: {
    borderColor: COLORS.error,
  },
  errorText: {
    ...FONTS.body4,
    color: COLORS.error,
    marginTop: SIZES.base,
  },
});

export default Input;