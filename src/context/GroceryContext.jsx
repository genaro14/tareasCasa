import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { groceryApi, authApi } from '../services/api';

const GroceryContext = createContext();

export const GroceryProvider = ({ children }) => {
  const [groceryItems, setGroceryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    if (!authApi.isAuthenticated()) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await groceryApi.getAll();
      setGroceryItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch grocery items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addGroceryItem = async (name) => {
    try {
      const item = await groceryApi.create({ name });
      setGroceryItems(prev => [...prev, item]);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeGroceryItem = async (id) => {
    try {
      await groceryApi.delete(id);
      setGroceryItems(prev => prev.filter(item => item.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const toggleGroceryItemActive = async (id) => {
    try {
      const updated = await groceryApi.toggleActive(id);
      setGroceryItems(prev =>
        prev.map(item => item.id === id ? updated : item)
      );
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <GroceryContext.Provider value={{ 
      groceryItems, 
      addGroceryItem, 
      removeGroceryItem, 
      toggleGroceryItemActive,
      loading,
      error,
      refresh: fetchItems
    }}>
      {children}
    </GroceryContext.Provider>
  );
};

export const useGrocery = () => useContext(GroceryContext);
