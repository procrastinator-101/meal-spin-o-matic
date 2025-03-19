
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SpinnerWheel from '@/components/SpinnerWheel';
import ResultDisplay from '@/components/ResultDisplay';
import { useMealStore } from '@/lib/mealStore';
import { Meal } from '@/lib/types';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const Spinner = () => {
  const { meals, selectedMealId, getMealById } = useMealStore();
  const [showResult, setShowResult] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const handleSpinComplete = (meal: Meal | null) => {
    setSelectedMeal(meal);
    setShowResult(true);
  };

  const handleDismissResult = () => {
    setShowResult(false);
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <Header />
      
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-bold mb-2">Meal Spinner</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Can't decide what to eat? Give the spinner a whirl and let it choose for you!
            </p>
          </motion.div>
          
          {/* Empty state */}
          {meals.length === 0 && (
            <motion.div 
              className="glass-card p-8 text-center max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-medium mb-3">No meals found</h2>
              <p className="text-muted-foreground mb-6">
                You need to add some meals before you can use the spinner.
              </p>
              <Link
                to="/meals"
                className="inline-flex items-center px-5 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Plus size={18} className="mr-2" />
                Add Your First Meal
              </Link>
            </motion.div>
          )}
          
          {/* Spinner wheel */}
          {meals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SpinnerWheel onSpinComplete={handleSpinComplete} />
              
              {/* Meal count info */}
              <motion.p 
                className="text-center text-muted-foreground mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                {meals.length} meal{meals.length !== 1 ? 's' : ''} available to spin
              </motion.p>
            </motion.div>
          )}
          
          {/* Result modal */}
          <ResultDisplay 
            meal={selectedMeal} 
            isVisible={showResult} 
            onDismiss={handleDismissResult} 
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Spinner;
