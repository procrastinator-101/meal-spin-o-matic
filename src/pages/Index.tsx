
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Utensils } from 'lucide-react';

const Index = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const featureItems = [
    {
      title: "Add Your Meals",
      description: "Easily add all your favorite meals with details like meal type and tags"
    },
    {
      title: "Spin to Decide",
      description: "Let the wheel of fortune decide what's for dinner tonight"
    },
    {
      title: "Track Your Meals",
      description: "See when you last had each meal to avoid repetition"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4">
        <motion.div
          className="max-w-5xl mx-auto text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Utensils className="w-16 h-16 text-primary mx-auto mb-6" />
          </motion.div>
          
          <motion.h1 
            variants={itemVariants} 
            className="text-5xl md:text-6xl font-bold tracking-tight"
          >
            Never wonder <span className="text-primary">"what's for dinner?"</span> again
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="max-w-2xl mx-auto text-xl text-muted-foreground"
          >
            SpinnerEats helps you decide what to eat with a fun, interactive meal roulette. Add your go-to meals and let the wheel decide.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/meals"
              className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-button"
            >
              Add Your Meals
            </Link>
            <Link
              to="/spinner"
              className="px-6 py-3 rounded-md border border-primary/20 text-primary hover:bg-primary/5 transition-colors"
            >
              Try the Spinner
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 px-4 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How it works
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureItems.map((item, index) => (
              <motion.div
                key={index}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/spinner"
              className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-button group"
            >
              Get Started Now 
              <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom CTA */}
      <div className="py-20 px-4 text-center">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to stop the dinner dilemma?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Add your meals and start spinning to discover what's for dinner.
          </p>
          <Link
            to="/meals"
            className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-button"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
