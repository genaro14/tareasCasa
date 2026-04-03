import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mealsApi, authApi } from '../services/api';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  // Structure: { "2024-01-15": { almuerzo: {...}, merienda: {...}, cena: {...} }, ... }
  const [meals, setMeals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeals = useCallback(async () => {
    if (!authApi.isAuthenticated()) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await mealsApi.getAll();
      const mealsMap = {};
      data.forEach(meal => {
        const dateKey = meal.date.split('T')[0];
        const mealType = meal.meal_type || 'almuerzo';
        if (!mealsMap[dateKey]) {
          mealsMap[dateKey] = {};
        }
        mealsMap[dateKey][mealType] = { id: meal.id, meal_name: meal.meal_name };
      });
      setMeals(mealsMap);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch meals:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const addMeal = async (date, mealType, mealName) => {
    try {
      const meal = await mealsApi.create({ date, meal_type: mealType, meal_name: mealName });
      setMeals(prev => ({
        ...prev,
        [date]: {
          ...prev[date],
          [mealType]: { id: meal.id, meal_name: meal.meal_name }
        }
      }));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateMeal = async (date, mealType, newMealName) => {
    try {
      const existing = meals[date]?.[mealType];
      if (existing?.id) {
        const meal = await mealsApi.update(existing.id, { meal_name: newMealName, meal_type: mealType });
        setMeals(prev => ({
          ...prev,
          [date]: {
            ...prev[date],
            [mealType]: { id: meal.id, meal_name: meal.meal_name }
          }
        }));
      } else {
        await addMeal(date, mealType, newMealName);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteMeal = async (date, mealType) => {
    try {
      const existing = meals[date]?.[mealType];
      if (existing?.id) {
        await mealsApi.delete(existing.id);
      }
      setMeals(prev => {
        const newMeals = { ...prev };
        if (newMeals[date]) {
          delete newMeals[date][mealType];
          if (Object.keys(newMeals[date]).length === 0) {
            delete newMeals[date];
          }
        }
        return newMeals;
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getMealName = (date, mealType) => meals[date]?.[mealType]?.meal_name || null;

  return (
    <MenuContext.Provider value={{ 
      meals, 
      addMeal, 
      updateMeal, 
      deleteMeal, 
      getMealName,
      loading, 
      error,
      refresh: fetchMeals 
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
