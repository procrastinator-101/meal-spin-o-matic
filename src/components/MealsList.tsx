
import React, { useState } from 'react';
import { useMealStore } from '@/lib/mealStore';
import { MealType } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Edit, Trash2, Filter, Search } from 'lucide-react';
import { toast } from 'sonner';

interface MealsListProps {
  onEdit: (mealId: string) => void;
}

const MealsList: React.FC<MealsListProps> = ({ onEdit }) => {
  const { meals, removeMeal, updateMeal, filterMeals } = useMealStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<MealType | undefined>(undefined);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredMeals = filterMeals(selectedType, searchTerm, showFavoritesOnly);
  
  const handleRemove = (id: string) => {
    if (confirm('Are you sure you want to remove this meal?')) {
      removeMeal(id);
      toast.success('Meal removed');
    }
  };

  const toggleFavorite = (id: string, currentValue: boolean) => {
    updateMeal(id, { favorite: !currentValue });
    toast.success(currentValue ? 'Removed from favorites' : 'Added to favorites');
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'other'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.07
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Search and filter controls */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search meals..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-background/60 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-muted transition-colors"
            aria-label="Toggle filters"
          >
            <Filter size={18} className="text-muted-foreground" />
          </button>
        </div>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Filter by type</label>
                  {selectedType && (
                    <button 
                      onClick={() => setSelectedType(undefined)}
                      className="text-xs text-primary hover:text-primary/80"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {mealTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(selectedType === type ? undefined : type)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        selectedType === type 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    showFavoritesOnly ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      showFavoritesOnly ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="ml-3 text-sm font-medium text-foreground">Favorites only</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Meals list */}
      {filteredMeals.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-8 text-center text-muted-foreground"
        >
          {meals.length === 0 ? (
            <p>No meals added yet. Add your first meal to get started!</p>
          ) : (
            <p>No meals match your current filters.</p>
          )}
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <AnimatePresence>
            {filteredMeals.map((meal) => (
              <motion.div
                key={meal.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="glass-card p-5 transition-all hover:shadow-elevated"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium truncate">{meal.name}</h3>
                  <button
                    onClick={() => toggleFavorite(meal.id, meal.favorite)}
                    className={`p-1.5 rounded-full transition-colors ${
                      meal.favorite 
                        ? 'text-destructive hover:bg-destructive/10' 
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                    aria-label={meal.favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart 
                      size={18} 
                      fill={meal.favorite ? 'currentColor' : 'none'} 
                    />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-secondary/70 text-secondary-foreground">
                    {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                  </span>
                  {meal.lastEaten && (
                    <span className="text-xs text-muted-foreground">
                      Last eaten: {formatDate(meal.lastEaten)}
                    </span>
                  )}
                </div>
                
                {meal.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {meal.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => onEdit(meal.id)}
                    className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Edit meal"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleRemove(meal.id)}
                    className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label="Delete meal"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default MealsList;
