import { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { useQuizStore } from '@/store/useQuizStore';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons';

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const questions = useQuizStore((state) => state.questions);
  
  const totalQuestions = questions.length;
  const attempted = questions.filter(q => q.attempts > 0).length;
  const totalCorrect = questions.reduce((sum, q) => sum + q.correct, 0);
  const totalAttempts = questions.reduce((sum, q) => sum + q.attempts, 0);
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <Text style={styles.title}>CAD Mastery</Text>
        <Text style={styles.subtitle}>Smart Prep Engine</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
           <Text style={styles.statValue}>{attempted}/{totalQuestions}</Text>
           <Text style={styles.statLabel}>Attempted</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
           <Text style={styles.statValue}>{accuracy}%</Text>
           <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#2196F3' }]} 
          onPress={() => router.push({ pathname: '/quiz', params: { mode: 'mock' } })}
        >
          <FontAwesome5 name="clipboard-list" size={24} color="#fff" style={styles.icon} />
          <View style={{ backgroundColor: 'transparent', flex: 1 }}>
            <Text style={styles.buttonText}>Take Mock Exam</Text>
            <Text style={styles.buttonSubText}>60 random questions</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#FF5722' }]} 
          onPress={() => router.push({ pathname: '/quiz', params: { mode: 'weak' } })}
        >
          <FontAwesome5 name="dumbbell" size={24} color="#fff" style={styles.icon} />
          <View style={{ backgroundColor: 'transparent', flex: 1 }}>
            <Text style={styles.buttonText}>Practice Weak Areas</Text>
            <Text style={styles.buttonSubText}>Focus on incorrect answers</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#9C27B0' }]} 
          onPress={() => router.push('/modules')}
        >
          <FontAwesome5 name="layer-group" size={24} color="#fff" style={styles.icon} />
          <View style={{ backgroundColor: 'transparent', flex: 1 }}>
            <Text style={styles.buttonText}>Module Practice</Text>
            <Text style={styles.buttonSubText}>20 questions per CAD domain</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#FFC107' }]} 
          onPress={() => router.push('/flashcards')}
        >
          <FontAwesome5 name="clone" size={24} color="#fff" style={styles.icon} />
          <View style={{ backgroundColor: 'transparent', flex: 1 }}>
            <Text style={styles.buttonText}>Flashcards</Text>
            <Text style={styles.buttonSubText}>Review questions with flip animations</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50', // ServiceNow-ish Green
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  statBox: {
    flex: 1,
    marginHorizontal: 8,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
  actionsContainer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  icon: {
    marginRight: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonSubText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
});
