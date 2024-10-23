// src/screens/ProcessingOptionsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import Button from '../components/Button';
import Loading from '../components/Loading';

const ProcessingOption = ({ option, selected, onSelect, delay }) => {
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.optionContainer,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onSelect}
      >
        <LinearGradient
          colors={selected 
            ? [COLORS.gradientStart, COLORS.gradientEnd]
            : ['#fff', '#fff']
          }
          style={styles.option}
        >
          <View style={[
            styles.optionIconContainer,
            selected && styles.selectedIconContainer
          ]}>
            <Icon
              name={option.icon}
              size={24}
              color={selected ? COLORS.white : COLORS.primary}
            />
          </View>
          
          <Text style={[
            styles.optionTitle,
            selected && styles.selectedText
          ]}>
            {option.title}
          </Text>
          
          <Text style={[
            styles.optionDescription,
            selected && styles.selectedText
          ]}>
            {option.description}
          </Text>

          {option.premium && (
            <View style={styles.premiumBadge}>
              <Icon name="star" size={12} color={COLORS.warning} />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}

          {selected && (
            <View style={styles.checkmarkContainer}>
              <Icon name="check-circle" size={20} color={COLORS.white} />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ProcessingSummary = ({ selectedOptions, totalPrice }) => (
  <View style={styles.summaryContainer}>
    <View style={styles.summaryHeader}>
      <Text style={styles.summaryTitle}>Processing Summary</Text>
      <Text style={styles.summaryCount}>
        {selectedOptions.length} {selectedOptions.length === 1 ? 'option' : 'options'} selected
      </Text>
    </View>
    {selectedOptions.map((option) => (
      <View key={option.id} style={styles.summaryItem}>
        <Icon name={option.icon} size={20} color={COLORS.primary} />
        <Text style={styles.summaryItemText}>{option.title}</Text>
        <Text style={styles.summaryItemPrice}>${option.price}</Text>
      </View>
    ))}
    <View style={styles.summaryTotal}>
      <Text style={styles.summaryTotalText}>Total</Text>
      <Text style={styles.summaryTotalPrice}>${totalPrice}</Text>
    </View>
  </View>
);

const ProcessingOptionsScreen = ({ navigation, route }) => {
  const { images } = route.params;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [processing, setProcessing] = useState(false);

  const processingOptions = [
    {
      id: 'virtualStaging',
      title: 'Virtual Staging',
      description: 'Add furniture and decor',
      icon: 'home',
      price: 29.99,
      premium: true,
    },
    {
      id: 'redecorating',
      title: 'Redecorating',
      description: 'Change colors and materials',
      icon: 'edit-2',
      price: 19.99,
    },
    {
      id: 'virtualTour',
      title: '360° Virtual Tour',
      description: 'Create immersive experiences',
      icon: 'compass',
      price: 39.99,
      premium: true,
    },
    {
      id: 'decluttering',
      title: 'Room Decluttering',
      description: 'Remove unwanted items',
      icon: 'trash-2',
      price: 14.99,
    },
    {
      id: 'logoRemoval',
      title: 'Logo Removal',
      description: 'Remove watermarks and logos',
      icon: 'image',
      price: 9.99,
    },
    {
      id: '3dProjection',
      title: '3D Projection',
      description: 'Create 3D visualizations',
      icon: 'box',
      price: 49.99,
      premium: true,
    },
  ];

  const toggleOption = (optionId) => {
    setSelectedOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const getTotalPrice = () => {
    return selectedOptions
      .map(id => processingOptions.find(opt => opt.id === id))
      .reduce((sum, option) => sum + option.price, 0)
      .toFixed(2);
  };

  const handleProcess = async () => {
    if (selectedOptions.length === 0) {
      Alert.alert('Error', 'Please select at least one processing option');
      return;
    }

    try {
      setProcessing(true);
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      navigation.navigate('ResultsDisplay', {
        images,
        selectedOptions: selectedOptions.map(id => 
          processingOptions.find(opt => opt.id === id)
        ),
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to process images');
    } finally {
      setProcessing(false);
    }
  };

  if (processing) {
    return <Loading message="Processing your images..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.previewSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.previewScroll}
          >
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.uri }}
                style={styles.previewImage}
              />
            ))}
          </ScrollView>
          <Text style={styles.previewCount}>
            {images.length} {images.length === 1 ? 'image' : 'images'} selected
          </Text>
        </View>

        <Text style={styles.title}>Enhancement Options</Text>
        <Text style={styles.subtitle}>
          Select the enhancements you'd like to apply
        </Text>

        <View style={styles.optionsGrid}>
          {processingOptions.map((option, index) => (
            <ProcessingOption
              key={option.id}
              option={option}
              selected={selectedOptions.includes(option.id)}
              onSelect={() => toggleOption(option.id)}
              delay={index * 100}
            />
          ))}
        </View>

        {selectedOptions.length > 0 && (
          <ProcessingSummary
            selectedOptions={selectedOptions.map(id => 
              processingOptions.find(opt => opt.id === id)
            )}
            totalPrice={getTotalPrice()}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Price:</Text>
          <Text style={styles.price}>
            ${getTotalPrice()}
          </Text>
        </View>
        <Button
          title={processing ? 'Processing...' : 'Process Images'}
          onPress={handleProcess}
          gradient
          loading={processing}
          disabled={selectedOptions.length === 0 || processing}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  previewSection: {
    marginBottom: SIZES.padding * 2,
  },
  previewScroll: {
    padding: SIZES.base,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: SIZES.radius,
    marginRight: SIZES.padding,
  },
  previewCount: {
    ...FONTS.body4,
    color: COLORS.gray500,
    marginTop: SIZES.base,
    textAlign: 'center',
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionContainer: {
    width: '48%',
    marginBottom: SIZES.padding,
  },
  option: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    minHeight: 180,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  selectedIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  optionTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  optionDescription: {
    ...FONTS.body4,
    color: COLORS.gray500,
  },
  selectedText: {
    color: COLORS.white,
  },
  premiumBadge: {
    position: 'absolute',
    top: SIZES.base,
    right: SIZES.base,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: SIZES.base,
    paddingVertical: 2,
    borderRadius: SIZES.radius,
  },
  premiumText: {
    ...FONTS.body5,
    color: COLORS.warning,
    marginLeft: 2,
  },
  checkmarkContainer: {
    position: 'absolute',
    bottom: SIZES.base,
    right: SIZES.base,
  },
  summaryContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginTop: SIZES.padding,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  summaryTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  summaryCount: {
    ...FONTS.body4,
    color: COLORS.gray500,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base,
  },
  summaryItemText: {
    ...FONTS.body3,
    color: COLORS.text,
    flex: 1,
    marginLeft: SIZES.base,
  },
  summaryItemPrice: {
    ...FONTS.body3,
    color: COLORS.text,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.padding,
    paddingTop: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  summaryTotalText: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  summaryTotalPrice: {
    ...FONTS.h2,
    color: COLORS.primary,
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    paddingBottom: Platform.OS === 'ios' ? 34 : SIZES.padding,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  priceLabel: {
    ...FONTS.body3,
    color: COLORS.gray500,
  },
  price: {
    ...FONTS.h2,
    color: COLORS.primary,
  },
});

export default ProcessingOptionsScreen;