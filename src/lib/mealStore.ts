
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Meal, MealType } from './types';

interface MealStore {
  meals: Meal[];
  selectedMealId: string | null;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  updateMeal: (id: string, updates: Partial<Omit<Meal, 'id'>>) => void;
  removeMeal: (id: string) => void;
  setSelectedMealId: (id: string | null) => void;
  spinWheel: () => Promise<Meal | null>;
  getMealById: (id: string) => Meal | undefined;
  filterMeals: (type?: MealType, searchTerm?: string, favorites?: boolean) => Meal[];
}

// Helper to generate random ID
const generateId = () => Math.random().toString(36).substring(2, 10);

export const useMealStore = create<MealStore>()(
  persist(
    (set, get) => ({
      meals: [],
      selectedMealId: null,

      addMeal: (mealData) => {
        const meal = { 
          id: generateId(), 
          ...mealData,
        };
        set((state) => ({ 
          meals: [...state.meals, meal]
        }));
        return meal;
      },

      updateMeal: (id, updates) => {
        set((state) => ({
          meals: state.meals.map((meal) => 
            meal.id === id ? { ...meal, ...updates } : meal
          ),
        }));
      },

      removeMeal: (id) => {
        set((state) => ({
          meals: state.meals.filter((meal) => meal.id !== id),
          selectedMealId: state.selectedMealId === id ? null : state.selectedMealId,
        }));
      },

      setSelectedMealId: (id) => {
        set({ selectedMealId: id });
      },

      spinWheel: async () => {
        return new Promise((resolve) => {
          const { meals } = get();
          if (meals.length === 0) {
            resolve(null);
            return;
          }
          
          // Simulate spinning delay
          setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * meals.length);
            const selectedMeal = meals[randomIndex];
            set({ selectedMealId: selectedMeal.id });
            
            // Update the lastEaten date
            get().updateMeal(selectedMeal.id, { lastEaten: new Date() });
            resolve(selectedMeal);
          }, 3000); // 3 seconds for the animation
        });
      },

      getMealById: (id) => {
        return get().meals.find(meal => meal.id === id);
      },

      filterMeals: (type, searchTerm = '', favorites = false) => {
        const { meals } = get();
        return meals.filter(meal => {
          const matchesType = !type || meal.type === type;
          const matchesSearch = !searchTerm || 
            meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            meal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
          const matchesFavorite = !favorites || meal.favorite;
          return matchesType && matchesSearch && matchesFavorite;
        });
      },
    }),
    {
      name: 'spinner-eats-storage',
    }
  )
);
