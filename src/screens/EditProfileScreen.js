// src/screens/EditProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'react-native-image-picker';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profilePicture);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });

  const handleImagePicker = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.7,
    };

    try {
      const result = await ImagePicker.launchImageLibrary(options);
      if (result.assets?.[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const updateData = {
        ...formData,
        profilePicture: profileImage,
      };
      await updateUser(updateData);
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Updating profile..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={handleImagePicker}
          >
            <Image
              source={{ uri: profileImage || 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
            />
            <View style={styles.editImageButton}>
              <Icon name="camera" size={20} color={COLORS.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Tap to change photo</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <Input
            label="Full Name"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            icon="user"
            placeholder="Enter your full name"
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            icon="mail"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={false} // Email usually shouldn't be editable
          />

          <Input
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
            icon="phone"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <Input
            label="Location"
            value={formData.location}
            onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
            icon="map-pin"
            placeholder="Enter your location"
          />

          <Input
            label="Bio"
            value={formData.bio}
            onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
            icon="file-text"
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={4}
            style={styles.bioInput}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Update Profile"
            onPress={handleUpdate}
            gradient
            loading={loading}
            style={styles.updateButton}
          />
          
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            outlined
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.padding,
  },
  imageSection: {
    alignItems: 'center',
    marginVertical: SIZES.padding * 2,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  changePhotoText: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginTop: SIZES.padding,
  },
  form: {
    marginBottom: SIZES.padding * 2,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  actions: {
    marginBottom: Platform.OS === 'ios' ? 40 : SIZES.padding,
  },
  updateButton: {
    marginBottom: SIZES.base,
  },
  cancelButton: {
    marginTop: SIZES.base,
  },
});

export default EditProfileScreen;