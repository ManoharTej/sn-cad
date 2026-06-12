import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { useQuizStore, Question } from '@/store/useQuizStore';
import { FontAwesome5 } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';

export default function QuizScreen() {
  const { mode, topic } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const getMockExam = useQuizStore(state => state.getMockExam);
  const getWeakQuestions = useQuizStore(state => state.getWeakQuestions);
  const getModuleQuestions = useQuizStore(state => state.getModuleQuestions);
  const recordAnswer = useQuizStore(state => state.recordAnswer);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);

  useEffect(() => {
    if (mode === 'weak') {
      setQuestions(getWeakQuestions());
    } else if (mode === 'topic') {
      setQuestions(getModuleQuestions(topic as string || 'General'));
    } else {
      setQuestions(getMockExam());
    }
  }, [mode, topic]);

  if (questions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Loading or no questions available...</Text>
      </View>
    );
  }

  const currentQ = questions[currentIndex];
  // Convert 'A', 'B', 'C' to 0, 1, 2
  const correctLetters = currentQ.answer.split('').filter(c => /[A-Z]/.test(c));
  const correctIndices = correctLetters.map(c => c.charCodeAt(0) - 65);
  const isMulti = correctIndices.length > 1;

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    
    if (isMulti) {
      if (selectedIndices.includes(index)) {
        setSelectedIndices(selectedIndices.filter(i => i !== index));
      } else {
        setSelectedIndices([...selectedIndices, index]);
      }
    } else {
      setSelectedIndices([index]);
    }
  };

  const handleSubmit = () => {
    if (selectedIndices.length === 0) return;
    setIsSubmitted(true);
    
    // Check if exactly the correct ones are selected
    const isCorrect = selectedIndices.length === correctIndices.length && 
                      selectedIndices.every(i => correctIndices.includes(i));
                      
    if (isCorrect) setSessionScore(prev => prev + 1);
    
    // Save to global store
    recordAnswer(currentQ.id, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedIndices([]);
      setIsSubmitted(false);
    } else {
      router.replace({ pathname: '/results', params: { score: sessionScore, total: questions.length } });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <FontAwesome5 name="arrow-left" size={20} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Question {currentIndex + 1} of {questions.length}</Text>
        <View style={{width: 20}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.questionCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={styles.questionText}>{currentQ.question}</Text>
          {isMulti && (
            <Text style={styles.multiSelectText}>(Select {correctIndices.length} options)</Text>
          )}
        </View>

        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedIndices.includes(idx);
          const isCorrectAns = correctIndices.includes(idx);
          
          let bgColor = isDark ? '#333' : '#eee';
          let borderColor = 'transparent';
          
          if (isSubmitted) {
            if (isCorrectAns) {
              bgColor = '#4CAF50'; // Green = Correct
            } else if (isSelected && !isCorrectAns) {
              bgColor = '#F44336'; // Red = Wrong selection
            }
          } else if (isSelected) {
            bgColor = '#2196F3'; // Blue = Selected
          }

          return (
            <TouchableOpacity 
              key={idx} 
              style={[styles.optionCard, { backgroundColor: bgColor, borderColor }]}
              onPress={() => handleSelectOption(idx)}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, { color: (isSelected || (isSubmitted && (isCorrectAns || isSelected))) ? '#fff' : (isDark ? '#fff' : '#000') }]}>
                {String.fromCharCode(65 + idx)}. {opt}
              </Text>
            </TouchableOpacity>
          );
        })}

        {isSubmitted && (
          <View style={[styles.explanationCard, { backgroundColor: isDark ? '#2c2c2c' : '#e3f2fd' }]}>
            <Text style={styles.explanationTitle}>Explanation</Text>
            <Text style={styles.explanationText}>{currentQ.explanation || 'No explanation provided.'}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {!isSubmitted ? (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#4CAF50', opacity: selectedIndices.length === 0 ? 0.5 : 1 }]} onPress={handleSubmit} disabled={selectedIndices.length === 0}>
            <Text style={styles.actionBtnText}>Submit Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2196F3' }]} onPress={handleNext}>
            <Text style={styles.actionBtnText}>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'transparent' },
  backBtn: { padding: 10 },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  questionCard: { padding: 20, borderRadius: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  questionText: { fontSize: 18, lineHeight: 28 },
  multiSelectText: { marginTop: 10, color: '#FF9800', fontWeight: 'bold' },
  optionCard: { padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1 },
  optionText: { fontSize: 16, lineHeight: 24 },
  explanationCard: { padding: 20, borderRadius: 16, marginTop: 20 },
  explanationTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#2196F3' },
  explanationText: { fontSize: 16, lineHeight: 24 },
  footer: { padding: 20, backgroundColor: 'transparent' },
  actionBtn: { padding: 18, borderRadius: 12, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
