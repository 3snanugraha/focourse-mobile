import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import AuthManager from '@/services/Auth';


interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  image: string;
  language: string;
  totalLessons?: number;
}

export default function CoursesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  // Change to optional chaining or default value
  const [languageFilter, setLanguageFilter] = useState<string>('EN');
  const router = useRouter();

  const [originalCourses, setOriginalCourses] = useState<Course[]>([]);

  const fetchCourses = async () => {
    try {
      const authManager = AuthManager;
      const records = await authManager.fetchCollection('Courses');
      const formattedCourses = records.map((course: any) => ({
        id: course.id,
        title: course.Judul,
        description: course.Deskripsi,
        level: course.Level,
        language: course.Bahasa,
        image: `${process.env.EXPO_PUBLIC_DB_HOST}/api/files/${course.collectionId}/${course.id}/${course.Banner}`,
      }));
      
      // Filter courses to EN by default
      const filteredCourses = formattedCourses.filter(course => course.language === 'EN');
      
      setCourses(filteredCourses);
      setOriginalCourses(formattedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchCourses();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterCourses(query, languageFilter);
  };

  const handleLanguageFilter = (language: string) => {
    // If the current language is the same, reset to null
    const newLanguageFilter = languageFilter === language ? '' : language;
    setLanguageFilter(newLanguageFilter);
    filterCourses(searchQuery, newLanguageFilter);
  };

  const filterCourses = (query: string, language: string) => {
    let filteredCourses = originalCourses;

    if (query) {
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(query.toLowerCase()) ||
          course.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (language) {
      filteredCourses = filteredCourses.filter(
        (course) => course.language === language
      );
    }

    setCourses(filteredCourses);
  };

  const renderCourseCard = ({ item }: { item: Course }) => (
    <View style={styles.courseCard}>
      <Image source={{ uri: item.image }} style={styles.courseImage} resizeMode="contain" />
      <View style={styles.courseInfo}>
        <ThemedText type="defaultSemiBold" style={styles.courseTitle}>
          {item.title}
        </ThemedText>
        <Text style={styles.courseDescription}>{item.description}</Text>
        <Text style={styles.courseLevel}>Level: {item.level}</Text>
      </View>
      <TouchableOpacity style={styles.startButton}>
        <ThemedText 
          type="defaultSemiBold" 
          style={styles.startButtonText} 
          onPress={() => router.push(`/(tabs)/learning/${item.id}`)}
        >
          Start Course
        </ThemedText>
      </TouchableOpacity>
    </View>
  );

  const LanguageFilterButton = ({ language, flagEmoji }: { language: string, flagEmoji: string }) => (
    <TouchableOpacity 
      style={[
        styles.languageFilterButton, 
        languageFilter === language && styles.activeLanguageFilterButton
      ]}
      onPress={() => handleLanguageFilter(language)}
    >
      <Text 
        style={[
          styles.languageFilterButtonText, 
          languageFilter === language && styles.activeLanguageFilterButtonText
        ]}
      >
        {flagEmoji} {language}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#407BFF" />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          renderItem={renderCourseCard}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#407BFF']}
              tintColor="#407BFF"
            />
          }
          ListHeaderComponent={
            <View>
              <Image
                source={require('@/assets/images/banner.jpeg')}
                style={styles.reactLogo}
              />
              <View style={styles.searchAndFilterContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search courses..."
                  placeholderTextColor="#888"
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
                <View style={styles.languageFilterContainer}>
                  <LanguageFilterButton 
                    language="ID" 
                    flagEmoji="🇮🇩" 
                  />
                  <LanguageFilterButton 
                    language="EN" 
                    flagEmoji="🇬🇧" 
                  />
                </View>
              </View>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  reactLogo: {
    height: 180,
    width: '100%',
    marginTop: '7%',
    resizeMode: 'cover',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: '#407BFF',
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
  },
  courseImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  courseInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 18,
    marginBottom: 4,
    textAlign: 'center',
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  courseLevel: {
    fontSize: 12,
    color: '#407BFF',
  },
  startButton: {
    backgroundColor: '#407BFF',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  searchAndFilterContainer: {
    marginHorizontal: 16,
  },
  languageFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  languageFilterButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  activeLanguageFilterButton: {
    backgroundColor: '#407BFF',
  },
  languageFilterButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  activeLanguageFilterButtonText: {
    color: '#fff',
  },
});
