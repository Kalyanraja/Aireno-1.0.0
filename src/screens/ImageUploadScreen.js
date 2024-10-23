// src/screens/ImageUploadScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import Button from '../components/Button';
import Loading from '../components/Loading';

const UploadOption = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.uploadOption} onPress={onPress}>
    <View style={styles.uploadIconContainer}>
      <Icon name={icon} size={30} color={COLORS.primary} />
    </View>
    <Text style={styles.uploadTitle}>{title}</Text>
    <Text style={styles.uploadSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const ImageUploadScreen = ({ navigation }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImagePicker = useCallback(async (type) => {
    const options = {
      mediaType: 'photo',
      maxWidth: 2000,
      maxHeight: 2000,
      quality: 0.7,
      selectionLimit: 5,
    };

    try {
      if (type === 'camera') {
        const result = await ImagePicker.launchCamera(options);
        if (result.assets) {
          handleImageSelection(result.assets);
        }
      } else {
        const result = await ImagePicker.launchImageLibrary({
          ...options,
          selectionLimit: 5 - selectedImages.length,
        });
        if (result.assets) {
          handleImageSelection(result.assets);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  }, [selectedImages.length]);

  const handleImageSelection = (assets) => {
    if (selectedImages.length + assets.length > 5) {
      Alert.alert('Limit Exceeded', 'You can only upload up to 5 images');
      return;
    }
    setSelectedImages(prev => [...prev, ...assets]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleContinue = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('Error', 'Please select at least one image');
      return;
    }

    try {
      setUploading(true);
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      navigation.navigate('ProcessingOptions', {
        images: selectedImages,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Upload Images</Text>
        <Text style={styles.subtitle}>
          Choose up to 5 images to enhance
        </Text>

        {selectedImages.length === 0 ? (
          <View style={styles.uploadOptions}>
            <UploadOption
              icon="camera"
              title="Take Photo"
              subtitle="Use your camera"
              onPress={() => handleImagePicker('camera')}
            />
            <UploadOption
              icon="image"
              title="Choose from Gallery"
              subtitle="Select from your photos"
              onPress={() => handleImagePicker('gallery')}
            />
          </View>
        ) : (
          <View style={styles.selectedImagesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectedImagesScroll}
            >
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.selectedImageContainer}>
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.selectedImage}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                  >
                    <Icon name="x" size={20} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              ))}
              {selectedImages.length < 5 && (
                <TouchableOpacity
                  style={styles.addMoreButton}
                  onPress={() => handleImagePicker('gallery')}
                >
                  <Icon name="plus" size={30} color={COLORS.primary} />
                  <Text style={styles.addMoreText}>Add More</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Icon name="info" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Supported formats: JPG, PNG{'\n'}
            Maximum file size: 10MB per image
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={uploading ? 'Uploading...' : 'Continue'}
          onPress={handleContinue}
          gradient
          loading={uploading}
          disabled={selectedImages.length === 0 || uploading}
        />
      </View>

      {uploading && <Loading message="Uploading images..." />}
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
  title: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.gray500,
    marginBottom: SIZES.padding * 2,
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding * 2,
  },
  uploadOption: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  uploadTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  uploadSubtitle: {
    ...FONTS.body4,
    color: COLORS.gray500,
    textAlign: 'center',
  },
  selectedImagesContainer: {
    marginVertical: SIZES.padding,
  },
  selectedImagesScroll: {
    padding: SIZES.base,
  },
  selectedImageContainer: {
    marginRight: SIZES.padding,
  },
  selectedImage: {
    width: 120,
    height: 120,
    borderRadius: SIZES.radius,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMoreButton: {
    width: 120,
    height: 120,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMoreText: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginTop: SIZES.base,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding,
  },
  infoText: {
    ...FONTS.body4,
    color: COLORS.gray500,
    marginLeft: SIZES.base,
  },
  footer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
});

export default ImageUploadScreen;