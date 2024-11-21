import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('@/assets/images/beginner.png'),
    description: 'Learn the basics of Forex trading.',
  },
  {
    id: '2',
    image: require('@/assets/images/intermediate.png'),
    description: 'Take your trading to the next level.',
  },
  {
    id: '3',
    image: require('@/assets/images/expert.png'),
    description: 'Master advanced trading techniques.',
  },
];

export default function StartScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleStartLearning = () => {
    router.push('/(tabs)');
  };

  const renderItem = ({ item }: { item: typeof slides[0] }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6A11CB', '#2575FC']}
        style={styles.gradientBackground}
      />
      <Text style={styles.title}>ForeCourse</Text>
      <FlatList
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        style={styles.slider}
      />
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleStartLearning}>
        <Ionicons name="book-outline" size={24} color="#407BFF" />
        <Text style={styles.buttonText}>Start Learning</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  slider: {
    flexGrow: 0,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 300,
    width: 290,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#407BFF',
    width: 12,
    height: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#407BFF',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
