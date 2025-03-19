
import React, { useState, useEffect } from 'react';
import { Meal, MealType } from '@/lib/types';
import { useMealStore } from '@/lib/mealStore';
import { motion } from 'framer-motion';
import { Plus, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface MealFormProps {
  editMeal?: Meal;
  onComplete?: () => void;
}

const MealForm: React.FC<MealFormProps> = ({ editMeal, onComplete }) => {
  const { addMeal, updateMeal } = useMealStore();
  
  const [name, setName] = useState('');
  const [type, setType] = useState<MealType>('dinner');
  const [favorite, setFavorite] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Load meal data when editing
  useEffect(() => {
    if (editMeal) {
      setName(editMeal.name);
      setType(editMeal.type);
      setFavorite(editMeal.favorite);
      setTags(editMeal.tags);
    }
  }, [editMeal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter a meal name");
      return;
    }
    
    const mealData = {
      name: name.trim(),
      type,
      favorite,
      tags,
      lastEaten: editMeal?.lastEaten,
    };
    
    if (editMeal) {
      updateMeal(editMeal.id, mealData);
      toast.success("Meal updated successfully");
    } else {
      addMeal(mealData);
      toast.success("Meal added successfully");
      
      // Reset form for adding another meal
      setName('');
      setType('dinner');
      setFavorite(false);
      setTags([]);
    }
    
    if (onComplete) {
      onComplete();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'other'];

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      } 
    }
  };

  return (
    <motion.div 
      className="w-full glass-card p-6"
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      <h2 className="text-xl font-medium mb-6">
        {editMeal ? 'Edit Meal' : 'Add New Meal'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Meal Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-background/60 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
            placeholder="What's this dish called?"
            autoFocus
          />
        </div>
        
        {/* Meal Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Meal Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {mealTypes.map((mealType) => (
              <button
                key={mealType}
                type="button"
                className={`px-4 py-2 text-sm rounded-md border transition-all ${
                  type === mealType 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background/60 border-border hover:border-primary/50'
                }`}
                onClick={() => setType(mealType)}
              >
                {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Favorite Toggle */}
        <div className="flex items-center">
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              favorite ? 'bg-primary' : 'bg-muted'
            }`}
            onClick={() => setFavorite(!favorite)}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                favorite ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="ml-3 text-sm font-medium text-foreground">Favorite</span>
        </div>
        
        {/* Tags Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Tags (optional)
          </label>
          <div className="flex items-center">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="flex-1 px-4 py-2 rounded-l-md bg-background/60 border border-r-0 border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
              placeholder="Add tags (e.g., quick, healthy, pasta)"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 rounded-r-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          
          {/* Tags Display */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1.5 text-secondary-foreground/70 hover:text-secondary-foreground"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center px-5 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors button-effect shadow-sm"
          >
            <Check size={18} className="mr-2" />
            {editMeal ? 'Update Meal' : 'Add Meal'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default MealForm;
