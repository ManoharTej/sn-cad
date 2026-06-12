import { StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';

const modulesList = [
  { name: 'Designing & Creating an Application', weight: '20%', icon: 'pencil-ruler', color: '#4CAF50' },
  { name: 'Application User Interface', weight: '20%', icon: 'desktop', color: '#2196F3' },
  { name: 'Security & Restricting Access', weight: '20%', icon: 'shield-alt', color: '#F44336' },
  { name: 'Application Automation', weight: '20%', icon: 'cogs', color: '#FF9800' },
  { name: 'Working with External Data', weight: '10%', icon: 'database', color: '#9C27B0' },
  { name: 'Managing Applications', weight: '10%', icon: 'tasks', color: '#607D8B' }
];

export default function ModulesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <FontAwesome5 name="arrow-left" size={20} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>CAD Exam Domains</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.description}>
          Select a module to practice. Each module session consists of 20 random questions focused on that specific domain.
        </Text>

        {modulesList.map((mod, index) => (
          <TouchableOpacity 
            key={index}
            style={[styles.moduleCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff', borderLeftColor: mod.color }]}
            onPress={() => router.push({ pathname: '/quiz', params: { mode: 'topic', topic: mod.name } })}
          >
            <View style={[styles.iconContainer, { backgroundColor: mod.color }]}>
              <FontAwesome5 name={mod.icon} size={20} color="#fff" />
            </View>
            <View style={{ backgroundColor: 'transparent', flex: 1 }}>
              <Text style={styles.moduleName}>{mod.name}</Text>
              <Text style={styles.moduleWeight}>Exam Weight: {mod.weight}</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={16} color={isDark ? '#555' : '#ccc'} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'transparent' },
  backBtn: { padding: 10 },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  description: { fontSize: 16, marginBottom: 24, lineHeight: 24, opacity: 0.8 },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  moduleWeight: { fontSize: 14, opacity: 0.6 }
});
