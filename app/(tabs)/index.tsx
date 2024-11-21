import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  image: string;
}

// Mock data
const mockCourses = [
  {
    id: '1',
    title: 'Introduction to Forex',
    description: 'Learn the basics of Forex trading.',
    level: 'Beginner',
    image: '@/assets/images/beginner.png',
  },
  {
    id: '2',
    title: 'Intermediate Forex Strategies',
    description: 'Enhance your trading skills.',
    level: 'Intermediate',
    image: '@/assets/images/intermediate.png',
  },
  {
    id: '3',
    title: 'Expert Forex Tactics',
    description: 'Master the art of Forex trading.',
    level: 'Expert',
    image: '@/assets/images/expert.png',
  },
];

export default function CoursesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredCourses(
      mockCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(query.toLowerCase()) ||
          course.description.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const renderCourseCard = ({ item }: { item: Course }) => (
    <View style={styles.courseCard}>
      <Image source={{ uri: item.image }} style={styles.courseImage} />
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
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/banner.jpeg')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </ThemedView>
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={renderCourseCard}
        contentContainerStyle={styles.listContainer}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  searchContainer: {
    margin: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: '#407BFF',
    borderWidth: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center', // Agar elemen dalam card terpusat
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
