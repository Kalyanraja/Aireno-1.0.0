// src/screens/ResultsDisplayScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import Button from '../components/Button';

const { width, height } = Dimensions.get('window');

const ResultCard = ({ result, index, onShare }) => {
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: index * 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay: index * 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.resultCard,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.resultCardGradient}
      >
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>{result.title}</Text>
          <TouchableOpacity onPress={() => onShare(result)}>
            <Icon name="share-2" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <Animated.Image
          source={{ uri: result.imageUrl }}
          style={styles.resultImage}
          resizeMode="cover"
        />

        <View style={styles.resultInfo}>
          <Text style={styles.resultDescription}>
            {result.description}
          </Text>
          <View style={styles.resultStats}>
            <View style={styles.statItem}>
              <Icon name="cpu" size={16} color={COLORS.white} />
              <Text style={styles.statText}>
                {result.processingTime}s
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="hard-drive" size={16} color={COLORS.white} />
              <Text style={styles.statText}>
                {result.fileSize}MB
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const BeforeAfterSlider = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(width / 2);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const newPosition = Math.min(Math.max(gesture.moveX, 0), width);
        setSliderPosition(newPosition);
      },
    })
  ).current;

  return (
    <View style={styles.beforeAfterContainer}>
      <View style={styles.imageContainer}>
        <Animated.Image
          source={{ uri: afterImage }}
          style={[styles.comparisonImage, { width }]}
        />
        <Animated.Image
          source={{ uri: beforeImage }}
          style={[
            styles.comparisonImage,
            {
              width: sliderPosition,
              position: 'absolute',
            },
          ]}
        />
        <Animated.View
          style={[
            styles.sliderLine,
            {
              transform: [{ translateX: sliderPosition - 1 }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.sliderHandle} />
        </Animated.View>
      </View>
      <View style={styles.comparisonLabels}>
        <Text style={styles.comparisonLabel}>Before</Text>
        <Text style={styles.comparisonLabel}>After</Text>
      </View>
    </View>
  );
};

const ResultsDisplayScreen = ({ navigation, route }) => {
  const { media, selectedOptions } = route.params;
  const [activeTab, setActiveTab] = useState('enhanced');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const results = selectedOptions.map((option, index) => ({
    id: index,
    title: `Enhanced with ${option}`,
    description: `Your image has been professionally enhanced using our advanced ${option} technology.`,
    imageUrl: media.uri,
    processingTime: (Math.random() * 5 + 1).toFixed(1),
    fileSize: (Math.random() * 10 + 1).toFixed(1),
  }));

  const handleShare = (result) => {
    // Implement share functionality
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Enhanced Results</Text>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'enhanced' && styles.activeTab]}
            onPress={() => setActiveTab('enhanced')}
          >
            <Text style={[styles.tabText, activeTab === 'enhanced' && styles.activeTabText]}>
              Enhanced
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'compare' && styles.activeTab]}
            onPress={() => setActiveTab('compare')}
          >
            <Text style={[styles.tabText, activeTab === 'compare' && styles.activeTabText]}>
              Compare
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <Animated.ScrollView
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'enhanced' ? (
          results.map((result, index) => (
            <ResultCard
              key={result.id}
              result={result}
              index={index}
              onShare={handleShare}
            />
          ))
        ) : (
          <BeforeAfterSlider
            beforeImage={media.uri}
            afterImage={media.uri}
          />
        )}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <Button
          title="Save All Results"
          gradient
          onPress={() => {}}
          style={styles.saveButton}
        />
        <Button
          title="View Profile"
          outlined
          onPress={() => navigation.navigate('UserProfile')}
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
  header: {
    padding: SIZES.padding * 2,
    paddingBottom: SIZES.padding,
    borderBottomLeftRadius: SIZES.radius * 2,
    borderBottomRightRadius: SIZES.radius * 2,
  },
  headerTitle: {
    ...FONTS.h1,
    color: COLORS.white,
    marginBottom: SIZES.padding,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: SIZES.radius,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.base,
    alignItems: 'center',
    borderRadius: SIZES.radius - 4,
  },
  activeTab: {
    backgroundColor: COLORS.white,
  },
  tabText: {
    ...FONTS.body3,
    color: COLORS.white,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  resultCard: {
    marginBottom: SIZES.padding,
    borderRadius: SIZES.radius * 2,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  resultCardGradient: {
    padding: SIZES.padding,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  resultTitle: {
    ...FONTS.h3,
    color: COLORS.white,
  },
  resultImage: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.radius,
  },
  resultInfo: {
    marginTop: SIZES.padding,
  },
  resultDescription: {
    ...FONTS.body4,
    color: COLORS.white,
    opacity: 0.8,
  },
  resultStats: {
    flexDirection: 'row',
    marginTop: SIZES.padding,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  statText: {
    ...FONTS.body4,
    color: COLORS.white,
    marginLeft: SIZES.base,
  },
  beforeAfterContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    overflow: 'hidden',
    marginBottom: SIZES.padding,
  },
  imageContainer: {
    height: 400,
    width: '100%',
  },
  comparisonImage: {
    height: '100%',
  },
  sliderLine: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderHandle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  comparisonLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
  },
  comparisonLabel: {
    ...FONTS.body3,
    color: COLORS.text,
  },
  footer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  saveButton: {
    marginBottom: SIZES.base,
  },
});

export default ResultsDisplayScreen;