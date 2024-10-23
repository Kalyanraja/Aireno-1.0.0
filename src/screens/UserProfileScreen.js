// src/screens/UserProfileScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  RefreshControl
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import Button from '../components/Button';

const { width, height } = Dimensions.get('window');

const AnimatedStatistic = ({ label, value, icon }) => {
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animationValue, {
      toValue: 1,
      tension: 30,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statisticCard,
        {
          transform: [
            {
              scale: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
          ],
          opacity: animationValue,
        },
      ]}
    >
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statisticGradient}
      >
        <Icon name={icon} size={24} color={COLORS.white} />
        <Text style={styles.statisticValue}>{value}</Text>
        <Text style={styles.statisticLabel}>{label}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const ProjectCard = ({ project, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.projectCard, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Image source={{ uri: project.image }} style={styles.projectImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.projectGradient}
        >
          <View style={styles.projectContent}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <View style={styles.projectDetails}>
              <Text style={styles.projectDate}>{project.date}</Text>
              <View style={styles.projectStatus}>
                <View 
                  style={[
                    styles.statusDot, 
                    { backgroundColor: project.status === 'Completed' ? COLORS.success : COLORS.warning }
                  ]} 
                />
                <Text style={styles.statusText}>{project.status}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const UserProfileScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [user] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    profilePicture: 'https://via.placeholder.com/150',
    role: 'Premium Member',
    stats: [
      { label: 'Projects', value: '23', icon: 'folder' },
      { label: 'Saved', value: '45', icon: 'bookmark' },
      { label: 'Credits', value: '1.2k', icon: 'star' }
    ],
    projects: [
      {
        id: '1',
        title: 'Modern Living Room',
        date: 'Mar 15, 2024',
        status: 'Completed',
        image: 'https://via.placeholder.com/300'
      },
      {
        id: '2',
        title: 'Kitchen Renovation',
        date: 'Mar 12, 2024',
        status: 'In Progress',
        image: 'https://via.placeholder.com/300'
      },
      {
        id: '3',
        title: 'Master Bedroom',
        date: 'Mar 10, 2024',
        status: 'Completed',
        image: 'https://via.placeholder.com/300'
      }
    ]
  });

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [280, 120],
    extrapolate: 'clamp'
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [1, 0.9],
    extrapolate: 'clamp'
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight, opacity: headerOpacity }]}>
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Icon name="edit-2" size={20} color={COLORS.white} />
            </TouchableOpacity>
            
            <View style={styles.profileInfo}>
              <Image
                source={{ uri: user.profilePicture }}
                style={styles.profilePicture}
              />
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
                <View style={styles.roleBadge}>
                  <Icon name="award" size={16} color={COLORS.white} />
                  <Text style={styles.roleText}>{user.role}</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Statistics Section */}
        <View style={styles.statsContainer}>
          {user.stats.map((stat, index) => (
            <AnimatedStatistic
              key={index}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </View>

        {/* Projects Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Projects</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllProjects')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {user.projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onPress={() => navigation.navigate('ProjectDetails', { project })}
            />
          ))}
        </View>

        {/* Settings Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          {[
            { icon: 'settings', title: 'Account Settings', screen: 'AccountSettings' },
            { icon: 'bell', title: 'Notifications', screen: 'Notifications' },
            { icon: 'lock', title: 'Privacy & Security', screen: 'Privacy' },
            { icon: 'help-circle', title: 'Help & Support', screen: 'Support' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.settingItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Icon name={item.icon} size={22} color={COLORS.primary} />
              <Text style={styles.settingText}>{item.title}</Text>
              <Icon name="chevron-right" size={22} color={COLORS.gray400} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={() => navigation.navigate('Auth')}
          outlined
          style={styles.logoutButton}
        />

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: COLORS.primary,
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight + 10,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  editButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 10,
    right: SIZES.padding,
    padding: SIZES.base,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.padding,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  nameContainer: {
    marginLeft: SIZES.padding,
  },
  name: {
    ...FONTS.h2,
    color: COLORS.white,
    marginBottom: SIZES.base / 2,
  },
  email: {
    ...FONTS.body4,
    color: COLORS.white,
    opacity: 0.8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
    marginTop: SIZES.base,
  },
  roleText: {
    ...FONTS.body4,
    color: COLORS.white,
    marginLeft: SIZES.base / 2,
  },
  content: {
    flex: 1,
    marginTop: 200,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    backgroundColor: COLORS.background,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    marginTop: SIZES.padding,
  },
  statisticCard: {
    width: (width - SIZES.padding * 4) / 3,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  statisticGradient: {
    padding: SIZES.padding,
    alignItems: 'center',
  },
  statisticValue: {
    ...FONTS.h2,
    color: COLORS.white,
    marginVertical: SIZES.base,
  },
  statisticLabel: {
    ...FONTS.body4,
    color: COLORS.white,
    opacity: 0.8,
  },
  sectionContainer: {
    marginTop: SIZES.padding * 2,
    paddingHorizontal: SIZES.padding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  seeAllText: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  projectCard: {
    marginBottom: SIZES.padding,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  projectImage: {
    width: '100%',
    height: 180,
  },
  projectGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.padding,
  },
  projectContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  projectTitle: {
    ...FONTS.h3,
    color: COLORS.white,
    flex: 1,
  },
  projectDetails: {
    alignItems: 'flex-end',
  },
  projectDate: {
    ...FONTS.body4,
    color: COLORS.white,
    opacity: 0.8,
  },
  projectStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.base,
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
  },
  settingText: {
    ...FONTS.body3,
    color: COLORS.text,
    flex: 1,
    marginLeft: SIZES.padding,
  },
  logoutButton: {
    marginHorizontal: SIZES.padding,
    marginTop: SIZES.padding * 2,
    marginBottom: SIZES.padding,
  },
  settingsSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  analyticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  analyticsItem: {
    alignItems: 'center',
    flex: 1,
  },
  analyticsValue: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: SIZES.base / 2,
  },
  analyticsLabel: {
    ...FONTS.body4,
    color: COLORS.gray500,
  },
  activityContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  activityTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  activityInfo: {
    flex: 1,
  },
  activityDescription: {
    ...FONTS.body3,
    color: COLORS.text,
  },
  activityTime: {
    ...FONTS.body4,
    color: COLORS.gray500,
    marginTop: SIZES.base / 2,
  },
  premiumBadge: {
    position: 'absolute',
    top: SIZES.padding,
    right: SIZES.padding,
    backgroundColor: COLORS.warning,
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  premiumText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  progressSection: {
    marginTop: SIZES.padding,
  },
  progressTitle: {
    ...FONTS.body3,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.base,
  },
  progressStatsText: {
    ...FONTS.body4,
    color: COLORS.gray500,
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SIZES.padding,
  },
  achievementCard: {
    width: (width - SIZES.padding * 3) / 2,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
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
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  achievementTitle: {
    ...FONTS.body3,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.base / 2,
  },
  achievementProgress: {
    ...FONTS.body4,
    color: COLORS.gray500,
    textAlign: 'center',
  },
  subscriptionCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  subscriptionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  subscriptionBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  subscriptionBadgeText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  subscriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  subscriptionIcon: {
    marginRight: SIZES.base,
  },
  subscriptionText: {
    ...FONTS.body3,
    color: COLORS.text,
  },
  upgradeButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  upgradeButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
  }
});

export default UserProfileScreen;