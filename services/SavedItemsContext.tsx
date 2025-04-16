import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CulturalItem {
  id: string;
  name: string;
  type: string;
  category: string;
  image: { uri: string };
  description: string;
}

interface SavedItemsContextType {
  savedItems: CulturalItem[];
  saveItem: (item: CulturalItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  isItemSaved: (id: string) => boolean;
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

export const SavedItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedItems, setSavedItems] = useState<CulturalItem[]>([]);

  // Load saved items from storage on component mount
  useEffect(() => {
    const loadSavedItems = async () => {
      try {
        const savedData = await AsyncStorage.getItem('savedItems');
        if (savedData) {
          setSavedItems(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error loading saved items:', error);
      }
    };

    loadSavedItems();
  }, []);

  // Function to save an item
  const saveItem = async (item: CulturalItem) => {
    try {
      const updatedItems = [...savedItems, item];
      setSavedItems(updatedItems);
      await AsyncStorage.setItem('savedItems', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  // Function to remove an item
  const removeItem = async (id: string) => {
    try {
      const updatedItems = savedItems.filter(item => item.id !== id);
      setSavedItems(updatedItems);
      await AsyncStorage.setItem('savedItems', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Function to check if an item is saved
  const isItemSaved = (id: string) => {
    return savedItems.some(item => item.id === id);
  };

  return (
    <SavedItemsContext.Provider value={{ 
      savedItems, 
      saveItem, 
      removeItem, 
      isItemSaved 
    }}>
      {children}
    </SavedItemsContext.Provider>
  );
};

// Custom hook to use the saved items context
export const useSavedItems = () => {
  const context = useContext(SavedItemsContext);
  if (context === undefined) {
    throw new Error('useSavedItems must be used within a SavedItemsProvider');
  }
  return context;
};