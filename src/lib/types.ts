
export interface Meal {
  id: string;
  name: string;
  type: MealType;
  favorite: boolean;
  lastEaten?: Date;
  tags: string[];
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'other';
