// src/screens/ProjectsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import Loading from '../components/Loading';
import Error from '../components/Error';

const { width } = Dimensions.get('window');

const ProjectItem = ({ project, onPress }) => {
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
      activeOpacity={0.8}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.projectItem,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <Image
          source={{ uri: project.imageUrl }}
          style={styles.projectImage}
        />
        <View style={styles.projectContent}>
          <View style={styles.projectHeader}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Icon 
              name={project.isFavorite ? 'heart' : 'heart'}
              size={20}
              color={project.isFavorite ? COLORS.error : COLORS.gray400}
            />
          </View>
          <Text style={styles.projectDate}>{project.date}</Text>
          <View style={styles.projectDetails}>
            <View style={styles.statusContainer}>
              <View 
                style={[
                  styles.statusDot,
                  { backgroundColor: project.status === 'Completed' ? COLORS.success : COLORS.warning }
                ]}
              />
              <Text style={styles.statusText}>{project.status}</Text>
            </View>
            <View style={styles.detailsRight}>
              <Icon name="image" size={16} color={COLORS.gray500} />
              <Text style={styles.detailText}>{project.imagesCount}</Text>
            </View>
          </View>
          {project.processing && (
            <View style={styles.processingBadge}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.processingText}>Processing...</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const FilterChip = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[
      styles.filterChip,
      active && styles.activeFilterChip
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.filterLabel,
        active && styles.activeFilterLabel
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const ProjectsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'completed', label: 'Completed' },
    { id: 'processing', label: 'Processing' },
    { id: 'saved', label: 'Saved' },
  ];

  const fetchProjects = async () => {
    try {
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockProjects = [
        {
          id: '1',
          title: 'Modern Living Room',
          date: '2 days ago',
          status: 'Completed',
          imageUrl: 'https://via.placeholder.com/300',
          isFavorite: true,
          imagesCount: 4,
        },
        // Add more mock projects
      ];

      setProjects(mockProjects);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProjects();
  };

  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return project.status === 'Completed';
    if (activeFilter === 'processing') return project.processing;
    if (activeFilter === 'saved') return project.isFavorite;
    return true;
  }).filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !refreshing) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={fetchProjects} />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.gray500} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search projects..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {filters.map(filter => (
            <FilterChip
              key={filter.id}
              label={filter.label}
              active={activeFilter === filter.id}
              onPress={() => setActiveFilter(filter.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Projects List */}
      <FlatList
        data={filteredProjects}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProjectItem
            project={item}
            onPress={() => navigation.navigate('ProjectDetails', { projectId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={50} color={COLORS.gray400} />
            <Text style={styles.emptyText}>No projects found</Text>
          </View>
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Upload')}
      >
        <Icon name="plus" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    height: 50,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.base,
    ...FONTS.body3,
  },
  filtersContainer: {
    marginBottom: SIZES.padding,
  },
  filtersScroll: {
    paddingHorizontal: SIZES.padding,
  },
  filterChip: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginRight: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterLabel: {
    ...FONTS.body4,
    color: COLORS.gray500,
  },
  activeFilterLabel: {
    color: COLORS.white,
  },
  listContent: {
    padding: SIZES.padding,
  },
  projectItem: {
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
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
  },
  projectContent: {
    padding: SIZES.padding,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  projectDate: {
    ...FONTS.body4,
    color: COLORS.gray500,
    marginTop: SIZES.base,
  },
  projectDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.base,
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
    color: COLORS.gray500,
  },
  detailsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    ...FONTS.body4,
    color: COLORS.gray500,
    marginLeft: SIZES.base,
  },
  processingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding,
  },
  processingText: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginLeft: SIZES.base,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding * 2,
  },
  emptyText: {
    ...FONTS.body3,
    color: COLORS.gray500,
    marginTop: SIZES.padding,
  },
  fab: {
    position: 'absolute',
    right: SIZES.padding,
    bottom: SIZES.padding,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default ProjectsScreen;