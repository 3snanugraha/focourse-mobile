import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, ActivityIndicator, TouchableOpacity, ScrollView, RefreshControl, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import AuthManager from '@/services/Auth';
import Markdown from 'react-native-markdown-display';
import { useRouter } from 'expo-router';

interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  image: string;
}

export default function ExploreDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      router.push('/');
    } else {
      fetchCourseAndLessons();
    }
  }, [id]);

  const fetchCourseAndLessons = async () => {
    setLoading(true);
    try {
      const authManager = AuthManager;

      // Fetch course details
      const courseData = await authManager.fetchRecord('Courses', id as string);
      const formattedCourse: Course = {
        id: courseData.id,
        title: courseData.Judul,
        description: courseData.Deskripsi,
        level: courseData.Level,
        image: `${process.env.EXPO_PUBLIC_DB_HOST}/api/files/${courseData.collectionId}/${courseData.id}/${courseData.Banner}`,
      };
      setCourse(formattedCourse);

      // Fetch lessons for this course
      const lessonRecords = await authManager.fetchCollection('Lesson', {
        filter: `Courses_ID="${id}"`,
      });

      const formattedLessons: Lesson[] = lessonRecords.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.Judul,
        content: lesson.Konten || '', // Ensure content is a string
        order: lesson.Urutan,
      }));
      setLessons(formattedLessons.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching course or lessons:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourseAndLessons();
  };

  const toggleLesson = (lessonId: string) => {
    setSelectedLessonId(prevId => 
      prevId === lessonId ? null : lessonId
    );
  };

  const renderLoadingState = () => (
    <ThemedView style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#407BFF" />
      <Text style={styles.loadingText}>
        {loading ? 'Loading course details...' : 'Course not found.'}
      </Text>
    </ThemedView>
  );

  const renderLessonContent = (lesson: Lesson) => {
    const safeMarkdownContent = lesson.content || '';

    return (
      <ScrollView 
        style={styles.lessonContentWrapper}
        contentContainerStyle={styles.lessonContentScrollView}
      >
        <Markdown
          style={{
            body: styles.markdownBody,
            heading1: styles.markdownHeading,
            paragraph: styles.markdownParagraph,
          }}
        >
          {safeMarkdownContent}
        </Markdown>
      </ScrollView>
    );
  };

  const renderLessonItem = (lesson: Lesson) => {
    const isSelected = selectedLessonId === lesson.id;
  
    return (
      <View key={lesson.id} style={styles.lessonContainer}>
        <TouchableOpacity
          style={[
            styles.lessonItem, 
            isSelected && styles.lessonItemSelected
          ]}
          onPress={() => toggleLesson(lesson.id)}
        >
          <Text style={styles.lessonOrder}>
            {`Lesson ${lesson.order}`}
          </Text>
          <Text style={styles.lessonName}>
            {lesson.title}
          </Text>
        </TouchableOpacity>
        
        {/* Render lesson content directly below the lesson item when selected */}
        {isSelected && renderLessonContent(lesson)}
      </View>
    );
  };

  if (loading || !course) {
    return renderLoadingState();
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Course Image and Info */}
        <Image 
          source={{ uri: course.image }} 
          style={styles.courseImage} 
          resizeMode="contain" 
        />
        
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>
            {course.title}
          </Text>
          <Text style={styles.courseDescription}>
            {course.description}
          </Text>
          <Text style={styles.courseLevel}>
            {`Level: ${course.level}`}
          </Text>
        </View>

        {/* Lessons List */}
        <ScrollView
          style={styles.lessonListContainer}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor="#407BFF" 
            />
          }
        >
          <Text style={styles.lessonTitle}>
            Lessons:
          </Text>
          {lessons.map((lesson) => renderLessonItem(lesson))}
        </ScrollView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  courseImage: {
    width: '40%',
    height: 200,
    alignSelf: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  courseInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lessonListContainer: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  lessonContainer: {
    marginBottom: 15,
  },
  lessonItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lessonContentWrapper: {
    backgroundColor: '#f9f9f9',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  lessonContentScrollView: {
    padding: 15,
  },
  lessonItemSelected: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  markdownBody: {
    fontSize: 16,
    color: '#333',
  },
  markdownHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  markdownParagraph: {
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  courseDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  courseLevel: {
    fontSize: 14,
    color: '#407BFF',
    fontWeight: '600',
  },
  lessonOrder: {
    fontSize: 14,
    color: '#407BFF',
    fontWeight: 'bold',
  },
  lessonName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});