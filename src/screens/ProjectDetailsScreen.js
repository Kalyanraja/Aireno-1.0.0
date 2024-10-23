// src/screens/ProjectDetailsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import Button from '../components/Button';
import Loading from '../components/Loading';

const { width } = Dimensions.get('window');

const ProjectDetail = ({ label, value, icon }) => (
  <View style={styles.detailItem}>
    <View style={styles.detailIcon}>
      <Icon name={icon} size={20} color={COLORS.primary} />
    </View>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const ProcessingOption = ({ option }) => (
  <View style={styles.optionItem}>
    <View style={[styles.optionIcon, { backgroundColor: option.color + '20' }]}>
      <Icon name={option.icon} size={20} color={option.color} />
    </View>
    <Text style={styles.optionText}>{option.title}</Text>
  </View>
);

const ProjectDetailsScreen = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock project data
      const mockProject = {
        id: projectId,
        title: 'Modern Living Room Design',
        date: 'March 15, 2024',
        status: 'Completed',
        author: 'John Doe',
        description: 'Complete renovation and virtual staging of the living room space with modern furniture and enhanced lighting.',
        beforeImage: 'https://via.placeholder.com/400',
        afterImage: 'https://via.placeholder.com/400',
        processingOptions: [
          { id: '1', title: 'Virtual Staging', icon: 'home', color: COLORS.primary },
          { id: '2', title: 'Lighting Enhancement', icon: 'sun', color: COLORS.warning },
          { id: '3', title: 'Color Correction', icon: 'edit-2', color: COLORS.success },
          { id: '4', title: 'Decluttering', icon: 'trash-2', color: COLORS.error },
        ],
        details: {
          processingTime: '2.5 hours',
          imageSize: '15.2 MB',
          resolution: '4K Ultra HD',
          enhancementLevel: 'Premium',
          aiModel: 'Enhanced v2.0',
          lastModified: 'Today at 2:30 PM',
        },
        statistics: {
          improvements: 85,
          elements: 24,
          revisions: 3,
        }
      };

      setProject(mockProject);
    } catch (error) {
      Alert.alert('Error', 'Failed to load project details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my renovated ${project.title}!`,
        url: project.afterImage,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share project');
    }
  };

  const handleDownload = async () => {
    try {
      setProcessing(true);
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Images downloaded successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to download images');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              setProcessing(true);
              // Simulate deletion
              await new Promise(resolve => setTimeout(resolve, 1000));
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete project');
              setProcessing(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.title}>{project.title}</Text>
            <View style={styles.headerDetails}>
              <View style={styles.statusContainer}>
                <View 
                  style={[
                    styles.statusDot,
                    { backgroundColor: project.status === 'Completed' ? COLORS.success : COLORS.warning }
                  ]}
                />
                <Text style={styles.statusText}>{project.status}</Text>
              </View>
              <Text style={styles.dateText}>{project.date}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Project Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{project.description}</Text>
          </View>

          {/* Image Comparison */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Before & After</Text>
            <View style={styles.comparisonContainer}>
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: project.beforeImage }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.imageLabel}>
                  <Text style={styles.imageLabelText}>Before</Text>
                </View>
              </View>
              <View style={styles.imageSeparator} />
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: project.afterImage }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.imageLabel}>
                  <Text style={styles.imageLabelText}>After</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Applied Enhancements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Applied Enhancements</Text>
            <View style={styles.optionsGrid}>
              {project.processingOptions.map(option => (
                <ProcessingOption key={option.id} option={option} />
              ))}
            </View>
          </View>

          {/* Project Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Icon name="trending-up" size={24} color={COLORS.success} />
                <Text style={styles.statValue}>{project.statistics.improvements}%</Text>
                <Text style={styles.statLabel}>Improvement</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="layers" size={24} color={COLORS.warning} />
                <Text style={styles.statValue}>{project.statistics.elements}</Text>
                <Text style={styles.statLabel}>Elements</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="refresh-cw" size={24} color={COLORS.primary} />
                <Text style={styles.statValue}>{project.statistics.revisions}</Text>
                <Text style={styles.statLabel}>Revisions</Text>
              </View>
            </View>
          </View>

          {/* Project Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Details</Text>
            <View style={styles.detailsContainer}>
              <ProjectDetail
                label="Processing Time"
                value={project.details.processingTime}
                icon="clock"
              />
              <ProjectDetail
                label="Image Size"
                value={project.details.imageSize}
                icon="file"
              />
              <ProjectDetail
                label="Resolution"
                value={project.details.resolution}
                icon="maximize"
              />
              <ProjectDetail
                label="Enhancement Level"
                value={project.details.enhancementLevel}
                icon="award"
              />
              <ProjectDetail
                label="AI Model"
                value={project.details.aiModel}
                icon="cpu"
              />
              <ProjectDetail
                label="Last Modified"
                value={project.details.lastModified}
                icon="calendar"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleShare}
            disabled={processing}
          >
            <Icon name="share-2" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, styles.deleteButton]}
            onPress={handleDelete}
            disabled={processing}
          >
            <Icon name="trash-2" size={24} color={COLORS.error} />
          </TouchableOpacity>
        </View>
        <Button
          title={processing ? 'Processing...' : 'Download Images'}
          onPress={handleDownload}
          gradient
          loading={processing}
          disabled={processing}
          style={styles.downloadButton}
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: SIZES.padding * 2,
    paddingTop: Platform.OS === 'ios' ? SIZES.padding * 4 : SIZES.padding * 2,
  },
  headerContent: {
    marginTop: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.white,
    marginBottom: SIZES.base,
  },
  headerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SIZES.base,
  },
  statusText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  dateText: {
    ...FONTS.body4,
    color: COLORS.white,
    opacity: 0.8,
  },
  content: {
    padding: SIZES.padding,
  },
  section: {
    marginBottom: SIZES.padding * 2,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.padding,
  },
  description: {
    ...FONTS.body3,
    color: COLORS.gray500,
    lineHeight: 22,
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  imageContainer: {
    width: (width - SIZES.padding * 5) / 2,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.radius,
  },
  imageLabel: {
    position: 'absolute',
    bottom: SIZES.base,
    left: SIZES.base,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: SIZES.base,
    paddingVertical: 2,
    borderRadius: SIZES.radius,
  },
  imageLabelText: {
    ...FONTS.body5,
    color: COLORS.white,
  },
  imageSeparator: {
    width: 1,
    backgroundColor: COLORS.gray200,
    marginHorizontal: SIZES.padding,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SIZES.base,
  },
  optionItem: {
    width: '50%',
    padding: SIZES.base,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  optionText: {
    ...FONTS.body4,
    color: COLORS.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...FONTS.h2,
    color: COLORS.text,
    marginVertical: SIZES.base,
  },
  statLabel: {
    ...FONTS.body4,
    color: COLORS.gray500,
  },
  detailsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
    marginBottom: SIZES.base,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    ...FONTS.body4,
    color: COLORS.gray500,
  },
  detailValue: {
    ...FONTS.body3,
    color: COLORS.text,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    paddingBottom: Platform.OS === 'ios' ? 34 : SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  actionButtons: {
    flexDirection: 'row',
    marginRight: SIZES.padding,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  deleteButton: {
    borderColor: COLORS.error + '50',
  },
  downloadButton: {
    flex: 1,
  },
});

export default ProjectDetailsScreen;