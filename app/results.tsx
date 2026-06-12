import { StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ResultsScreen() {
  const { score, total } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const scoreNum = Number(score) || 0;
  const totalNum = Number(total) || 1;
  const percentage = Math.round((scoreNum / totalNum) * 100);

  let message = "Good effort!";
  let iconName = "thumbs-up";
  let iconColor = "#FF9800"; // Orange

  if (percentage >= 80) {
    message = "Excellent work!";
    iconName = "trophy";
    iconColor = "#4CAF50"; // Green
  } else if (percentage < 50) {
    message = "Keep practicing!";
    iconName = "book-reader";
    iconColor = "#F44336"; // Red
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.card}>
        <FontAwesome5 name={iconName} size={64} color={iconColor} style={styles.icon} />
        <Text style={styles.title}>Quiz Completed</Text>
        
        <View style={styles.scoreContainer}>
          <Text style={[styles.percentage, { color: iconColor }]}>{percentage}%</Text>
          <Text style={styles.scoreText}>You scored {scoreNum} out of {totalNum}</Text>
        </View>

        <Text style={styles.message}>{message}</Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#2196F3' }]} 
        onPress={() => router.replace('/')}
      >
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20
  },
  card: {
    padding: 40,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  percentage: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    opacity: 0.8,
  },
  message: {
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 50,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
