
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMealStore } from '@/lib/mealStore';
import { Meal } from '@/lib/types';

interface SpinnerWheelProps {
  onSpinComplete: (meal: Meal | null) => void;
}

const SpinnerWheel: React.FC<SpinnerWheelProps> = ({ onSpinComplete }) => {
  const { meals, spinWheel } = useMealStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSpin = async () => {
    if (isSpinning || meals.length === 0) return;
    
    setIsSpinning(true);
    
    // Calculate a random spin (at least 5 full rotations plus a random segment)
    const minRotation = 1800; // 5 full rotations
    const randomExtra = Math.floor(Math.random() * 360);
    const newRotation = rotationDegrees + minRotation + randomExtra;
    setRotationDegrees(newRotation);
    
    // Calculate which meal will be selected based on the final position
    const segmentAngle = 360 / meals.length;
    const normalizedRotation = newRotation % 360;
    const selectedMealIndex = Math.floor(normalizedRotation / segmentAngle);
    setSelectedIndex(meals.length - 1 - selectedMealIndex);

    // Spin the wheel in the store (which adds a delay)
    const selected = await spinWheel();
    
    // Wait for animation to complete before calling onSpinComplete
    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete(selected);
    }, 3100); // Slightly longer than the animation duration
  };

  // Colors for the wheel segments
  const segmentColors = [
    '#007AFF', // Blue
    '#5856D6', // Purple
    '#FF2D55', // Pink
    '#FF9500', // Orange
    '#34C759', // Green
    '#00C7BE', // Teal
    '#AF52DE', // Magenta
    '#FF3B30', // Red
  ];

  // Create the wheel segments based on meals
  const createWheel = () => {
    if (meals.length === 0) return null;
    
    const segmentAngle = 360 / meals.length;
    
    return meals.map((meal, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      const colorIndex = index % segmentColors.length;
      
      // Calculate SVG path for the segment
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;
      
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);
      
      const x1 = 150 + 150 * Math.cos(startRad);
      const y1 = 150 + 150 * Math.sin(startRad);
      const x2 = 150 + 150 * Math.cos(endRad);
      const y2 = 150 + 150 * Math.sin(endRad);
      
      const pathData = `M 150 150 L ${x1} ${y1} A 150 150 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      // Text angle for centering in the segment
      const textAngle = startAngle + segmentAngle / 2;
      const textRad = (textAngle - 90) * (Math.PI / 180);
      const textRadius = 110; // Slightly inside the outer edge
      const textX = 150 + textRadius * Math.cos(textRad);
      const textY = 150 + textRadius * Math.sin(textRad);
      
      return (
        <g key={meal.id}>
          <path
            d={pathData}
            fill={segmentColors[colorIndex]}
            stroke="#FFFFFF"
            strokeWidth={1}
          />
          <text
            x={textX}
            y={textY}
            fontSize="12"
            fontWeight="bold"
            fill="white"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${textAngle}, ${textX}, ${textY})`}
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {meal.name.length > 12 ? `${meal.name.substring(0, 10)}...` : meal.name}
          </text>
        </g>
      );
    });
  };

  const wheelVariants = {
    spinning: {
      rotate: rotationDegrees,
      transition: { 
        duration: 3, 
        ease: [0.34, 1.56, 0.64, 1], // Custom easing for realistic spinning
      }
    },
    idle: { rotate: rotationDegrees }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      {meals.length === 0 ? (
        <div className="glass-card p-8">
          <p className="text-muted-foreground">
            Add some meals first to spin the wheel!
          </p>
        </div>
      ) : (
        <div className="mt-4 relative">
          <div className="spinning-wheel-container relative">
            {/* Pointer Triangle */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[24px] border-l-transparent border-r-transparent border-b-primary" />
            </div>
            
            {/* The wheel */}
            <motion.div
              className="spinning-wheel w-full max-w-[300px] mx-auto"
              ref={wheelRef}
              variants={wheelVariants}
              animate={isSpinning ? "spinning" : "idle"}
              initial="idle"
            >
              <svg viewBox="0 0 300 300" width="300" height="300">
                {createWheel()}
                <circle cx="150" cy="150" r="15" fill="#ffffff" stroke="#000000" strokeWidth="1" />
              </svg>
            </motion.div>
            
            {/* Center button */}
            <button
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary text-primary-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 z-20 transition-all ${
                isSpinning 
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:bg-primary/90 hover:scale-105 shadow-elevated active:scale-95'
              }`}
              onClick={handleSpin}
              disabled={isSpinning || meals.length === 0}
            >
              {isSpinning ? 'Spinning' : 'SPIN'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinnerWheel;
