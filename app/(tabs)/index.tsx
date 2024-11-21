import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
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
}

export default function CoursesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCourses = async () => {
    try {
      const authManager = AuthManager;
      const records = await authManager.fetchCollection('Courses'); // Ambil data dari koleksi 'Courses'
      setCourses(
        records.map((course: any) => ({
          id: course.id,
          title: course.Judul,
          description: course.Deskripsi,
          level: course.Level,
          image: `${process.env.EXPO_PUBLIC_DB_HOST}/api/files/${course.collectionId}/${course.id}/${course.Banner}`,
        }))
      );
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase())
    );
    setCourses(filtered);
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
        <ThemedText type="defaultSemiBold" style={styles.startButtonText}>
          Start Course
        </ThemedText>
      </TouchableOpacity>
    </View>
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
          ListHeaderComponent={
            <View>
              <Image
                source={require('@/assets/images/banner.jpeg')}
                style={styles.reactLogo}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search courses..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={handleSearch}
              />
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
});
