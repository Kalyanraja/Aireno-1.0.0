// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import Error from '../components/Error';

const { width } = Dimensions.get('window');

const RecentProjectCard = ({ project, onPress }) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.projectCard,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <Image
          source={{ uri: project.imageUrl }}
          style={styles.projectImage}
        />
        <View style={styles.projectInfo}>
          <Text style={styles.projectTitle}>{project.title}</Text>
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
      </Animated.View>
    </TouchableOpacity>
  );
};

const QuickActionButton = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress}>
    <View style={styles.quickActionIcon}>
      <Icon name={icon} size={24} color={COLORS.primary} />
    </View>
    <Text style={styles.quickActionText}>{title}</Text>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    savedDesigns: 0,
  });

  const fetchHomeData = async () => {
    try {
      setError(null);
      // In a real app, you would fetch data from your API
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRecentProjects([
        {
          id: '1',
          title: 'Modern Living Room',
          date: '2 hours ago',
          status: 'Completed',
          imageUrl: 'https://via.placeholder.com/300',
        },
        {
          id: '2',
          title: 'Kitchen Renovation',
          date: '1 day ago',
          status: 'In Progress',
          imageUrl: 'https://via.placeholder.com/300',
        },
        // Add more projects as needed
      ]);

      setStats({
        totalProjects: 12,
        completedProjects: 8,
        savedDesigns: 15,
      });
    } catch (err) {
      setError('Failed to load home data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  if (loading && !refreshing) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={fetchHomeData} />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            source={{ uri: user?.profilePicture || 'https://via.placeholder.com/40' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <QuickActionButton
          icon="plus-square"
          title="New Project"
          onPress={() => navigation.navigate('Upload')}
        />
        <QuickActionButton
          icon="grid"
          title="My Projects"
          onPress={() => navigation.navigate('Projects')}
        />
        <QuickActionButton
          icon="bookmark"
          title="Saved"
          onPress={() => navigation.navigate('SavedProjects')}
        />
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalProjects}</Text>
          <Text style={styles.statLabel}>Total Projects</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.completedProjects}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.savedDesigns}</Text>
          <Text style={styles.statLabel}>Saved Designs</Text>
        </View>
      </View>

      {/* Recent Projects */}
      <View style={styles.recentProjects}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Projects</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {recentProjects.map(project => (
          <RecentProjectCard
            key={project.id}
            project={project}
            onPress={() => navigation.navigate('ProjectDetails', { projectId: project.id })}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingTop: Platform.OS === 'ios' ? 60 : SIZES.padding,
  },
  welcomeText: {
    ...FONTS.body3,
    color: COLORS.gray500,
  },
  userName: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SIZES.padding,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionText: {
    ...FONTS.body4,
    color: COLORS.gray500,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.base,
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
  statNumber: {
    ...FONTS.h2,
    color: COLORS.primary,
  },
  statLabel: {
    ...FONTS.body4,
    color: COLORS.gray500,
    marginTop: SIZES.base,
  },
  recentProjects: {
    padding: SIZES.padding,
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
  projectImage: {
    width: '100%',
    height: 200,
  },
  projectInfo: {
    padding: SIZES.padding,
  },
  projectTitle: {
    ...FONTS.h4,
    color: COLORS.text,
  },
  projectDate: {
    ...FONTS.body4,
    color: COLORS.gray500,
    marginTop: SIZES.base,
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
    color: COLORS.gray500,
  },
});

export default HomeScreen;