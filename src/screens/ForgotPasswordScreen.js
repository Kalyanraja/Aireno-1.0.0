// src/screens/ForgotPasswordScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword, isLoading, error } = useAuth();

  const handleSubmit = async () => {
    if (email.trim()) {
      await forgotPassword(email);
      setIsSubmitted(true);
    }
  };

  if (isLoading) {
    return <Loading message="Sending reset instructions..." />;
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address to receive password reset instructions
          </Text>
        </View>

        {isSubmitted ? (
          <View style={styles.successContainer}>
            <Icon name="mail" size={50} color={COLORS.primary} />
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successMessage}>
              We've sent password reset instructions to your email address
            </Text>
            <Button
              title="Back to Login"
              onPress={() => navigation.navigate('Auth')}
              gradient
              style={styles.backToLoginButton}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              icon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              error={error}
            />

            <Button
              title="Send Instructions"
              onPress={handleSubmit}
              gradient
              loading={isLoading}
              disabled={!email.trim()}
              style={styles.submitButton}
            />

            <TouchableOpacity
              style={styles.returnButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.returnText}>Return to Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SIZES.padding,
  },
  backButton: {
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    marginBottom: SIZES.padding,
  },
  header: {
    marginBottom: SIZES.padding * 2,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.gray500,
  },
  form: {
    marginTop: SIZES.padding,
  },
  submitButton: {
    marginTop: SIZES.padding,
  },
  returnButton: {
    marginTop: SIZES.padding,
    alignItems: 'center',
  },
  returnText: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  successTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
  },
  successMessage: {
    ...FONTS.body3,
    color: COLORS.gray500,
    textAlign: 'center',
    marginBottom: SIZES.padding * 2,
  },
  backToLoginButton: {
    width: '100%',
  },
});

export default ForgotPasswordScreen;