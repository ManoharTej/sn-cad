import { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import { useQuizStore, Question } from '@/store/useQuizStore';

const { width } = Dimensions.get('window');

export default function FlashcardsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const getFlashcards = useQuizStore(state => state.getFlashcards);
  const [cards, setCards] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const flipAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setCards(getFlashcards());
  }, []);

  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnimation, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      if (isFlipped) {
        // Reset flip instantly
        flipAnimation.setValue(0);
        setIsFlipped(false);
      }
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      if (isFlipped) {
        flipAnimation.setValue(0);
        setIsFlipped(false);
      }
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (cards.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Loading flashcards...</Text>
      </View>
    );
  }

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }], opacity: frontOpacity };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }], opacity: backOpacity };

  const currentQ = cards[currentIndex];
  
  // Extract correct answer text (assuming single answer)
  const correctLetterMatch = currentQ.answer.match(/[A-Z]/);
  let correctText = currentQ.answer;
  if (correctLetterMatch) {
      const correctIndex = correctLetterMatch[0].charCodeAt(0) - 65;
      if (currentQ.options && currentQ.options[correctIndex]) {
          correctText = currentQ.options[correctIndex];
      }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <FontAwesome5 name="arrow-left" size={20} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Flashcards</Text>
        <Text style={styles.counterText}>{currentIndex + 1} / {cards.length}</Text>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity activeOpacity={1} onPress={flipCard} style={styles.cardWrapper}>
          
          {/* Front of Card */}
          <Animated.View style={[styles.card, frontAnimatedStyle, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
            <View style={{ backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.cardTitle}>QUESTION</Text>
              <Text style={styles.questionTextCenter}>{currentQ.question}</Text>
            </View>
            <Text style={styles.flipHint}>Tap to flip</Text>
          </Animated.View>

          {/* Back of Card */}
          <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, { backgroundColor: isDark ? '#2c2c2c' : '#e3f2fd' }]}>
            <ScrollView style={{ backgroundColor: 'transparent', flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.cardTitle}>CORRECT ANSWER</Text>
              <View style={styles.correctBox}>
                <Text style={styles.answerText}>{correctText}</Text>
              </View>
              
              <View style={styles.divider} />
              
              <Text style={styles.cardTitle}>EXPLANATION</Text>
              <Text style={styles.explanationText}>{currentQ.explanation || 'No explanation provided.'}</Text>
            </ScrollView>
            <Text style={styles.flipHint}>Tap to flip back</Text>
          </Animated.View>
          
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.navBtn, { opacity: currentIndex === 0 ? 0.3 : 1 }]} 
          onPress={handlePrev} 
          disabled={currentIndex === 0}
        >
          <FontAwesome5 name="chevron-left" size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navBtn, { opacity: currentIndex === cards.length - 1 ? 0.3 : 1 }]} 
          onPress={handleNext} 
          disabled={currentIndex === cards.length - 1}
        >
          <FontAwesome5 name="chevron-right" size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'transparent' },
  backBtn: { padding: 10 },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  counterText: { fontSize: 16, opacity: 0.7 },
  cardContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cardWrapper: { width: width * 0.85, height: '85%' },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    padding: 24,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  cardBack: { top: 0, left: 0 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#2196F3', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' },
  questionTextCenter: { fontSize: 22, lineHeight: 32, fontWeight: '500', textAlign: 'center' },
  correctBox: { backgroundColor: 'rgba(76, 175, 80, 0.1)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#4CAF50' },
  answerText: { fontSize: 20, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center' },
  explanationText: { fontSize: 16, lineHeight: 26 },
  divider: { height: 1, backgroundColor: '#ccc', opacity: 0.3, marginVertical: 20 },
  flipHint: { textAlign: 'center', opacity: 0.5, marginTop: 10, fontSize: 14 },
  footer: { flexDirection: 'row', justifyContent: 'space-evenly', padding: 20, backgroundColor: 'transparent' },
  navBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(150,150,150,0.2)', justifyContent: 'center', alignItems: 'center' }
});
