import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Question {
  id: string | number;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  topic?: string;
  difficulty?: string;
  attempts: number;
  correct: number;
  wrong: number;
  lastSeen?: number; // timestamp
}

interface QuizState {
  questions: Question[];
  loadQuestions: (questions: Question[]) => void;
  recordAnswer: (id: string | number, isCorrect: boolean) => void;
  getWeakQuestions: () => Question[];
  getMockExam: () => Question[];
  getModuleQuestions: (moduleName: string) => Question[];
  getFlashcards: () => Question[];
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      questions: [],
      
      loadQuestions: (newQuestions) => set((state) => {
        // Force reload questions to get trimmed explanations
        return { 
            questions: newQuestions.map(q => {
                const existing = state.questions.find(eq => eq.id === q.id);
                return {
                    ...q, 
                    attempts: existing?.attempts || 0, 
                    correct: existing?.correct || 0, 
                    wrong: existing?.wrong || 0,
                    lastSeen: existing?.lastSeen
                };
            }) 
        };
      }),

      recordAnswer: (id, isCorrect) => set((state) => ({
        questions: state.questions.map((q) =>
          q.id === id
            ? {
                ...q,
                attempts: q.attempts + 1,
                correct: isCorrect ? q.correct + 1 : q.correct,
                wrong: !isCorrect ? q.wrong + 1 : q.wrong,
                lastSeen: Date.now(),
              }
            : q
        ),
      })),

      getWeakQuestions: () => {
        const questions = get().questions;
        // Basic AI: weight = wrong_answers + 1. 
        // For simple Weakness Mode, we just sort by wrong descending and take some.
        // We can do weighted random sampling when pulling a full test.
        return [...questions].sort((a, b) => b.wrong - a.wrong).slice(0, 20);
      },

      getMockExam: () => {
        const questions = get().questions;
        // Shuffle and pick 60
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 60);
      },

      getModuleQuestions: (moduleName) => {
        const questions = get().questions;
        const filtered = questions.filter(q => q.topic === moduleName || moduleName === 'All');
        return filtered.sort(() => 0.5 - Math.random()).slice(0, 20);
      },

      getFlashcards: () => {
        // Return only single-answer questions for flashcards, randomized
        const singleAnswerQuestions = get().questions.filter(q => {
            const correctLetters = q.answer.split('').filter(c => /[A-Z]/.test(c));
            return correctLetters.length === 1;
        });
        return singleAnswerQuestions.sort(() => 0.5 - Math.random());
      }
    }),
    {
      name: 'quiz-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
