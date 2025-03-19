
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMealStore } from '@/lib/mealStore';
import MealForm from '@/components/MealForm';
import MealsList from '@/components/MealsList';
import { Plus, X } from 'lucide-react';
import Header from '@/components/Header';

const Meals = () => {
  const { meals, getMealById } = useMealStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editMealId, setEditMealId] = useState<string | null>(null);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Get the meal being edited
  const editingMeal = editMealId ? getMealById(editMealId) : undefined;

  // Set page as loaded after initial render
  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const handleEditMeal = (id: string) => {
    setEditMealId(id);
    setShowAddForm(true);
  };

  const handleFormComplete = () => {
    setShowAddForm(false);
    setEditMealId(null);
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
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">My Meals</h1>
            <p className="text-muted-foreground">
              {meals.length > 0 
                ? `You have ${meals.length} meal${meals.length === 1 ? '' : 's'} saved.`
                : 'Add your first meal to get started!'}
            </p>
          </motion.div>
          
          {/* Add Meal Form Section */}
          <div className="mb-8">
            {!showAddForm ? (
              <motion.button
                initial={pageLoaded ? { opacity: 0, y: 10 } : false}
                animate={pageLoaded ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.4 }}
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-5 py-2.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Plus size={18} className="mr-2" />
                Add New Meal
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">
                    {editMealId ? 'Edit Meal' : 'Add New Meal'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditMealId(null);
                    }}
                    className="p-2 rounded-full hover:bg-muted transition-colors"
                    aria-label="Close form"
                  >
                    <X size={18} />
                  </button>
                </div>
                <MealForm 
                  editMeal={editingMeal} 
                  onComplete={handleFormComplete}
                />
              </motion.div>
            )}
          </div>
          
          {/* Meals List Section */}
          <div>
            <MealsList onEdit={handleEditMeal} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Meals;
