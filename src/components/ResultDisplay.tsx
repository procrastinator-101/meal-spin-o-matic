
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Meal } from '@/lib/types';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResultDisplayProps {
  meal: Meal | null;
  isVisible: boolean;
  onDismiss: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ meal, isVisible, onDismiss }) => {
  if (!meal) return null;

  const containerVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.5,
        type: 'spring',
        stiffness: 100,
        delay: 0.2
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      transition: { 
        duration: 0.3 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + (i * 0.1),
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
        >
          <motion.div
            className="w-full max-w-md glass-card p-6 border border-white/30 overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              custom={0}
              variants={itemVariants}
              className="text-center mb-1"
            >
              <div className="inline-block px-3 py-1 mb-2 rounded-full text-xs font-medium bg-primary/20 text-primary">
                Today's meal
              </div>
            </motion.div>
            
            <motion.h2
              custom={1}
              variants={itemVariants}
              className="text-2xl font-bold text-center mb-4"
            >
              {meal.name}
            </motion.h2>
            
            <motion.div
              custom={2}
              variants={itemVariants}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
              </span>
              
              {meal.favorite && (
                <span className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-500">
                  <Heart size={12} className="mr-1" fill="currentColor" /> Favorite
                </span>
              )}
            </motion.div>
            
            {meal.tags.length > 0 && (
              <motion.div
                custom={3}
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-2 mb-6"
              >
                {meal.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
            
            <motion.div
              custom={4}
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <button
                onClick={onDismiss}
                className="px-5 py-2 rounded-md border border-primary/20 text-primary hover:bg-primary/5 transition-colors button-effect"
              >
                Spin Again
              </button>
              
              <Link
                to="/meals"
                className="flex items-center justify-center px-5 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors button-effect shadow-sm"
              >
                View All Meals <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultDisplay;
