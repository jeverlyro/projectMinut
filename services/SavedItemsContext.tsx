import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "./api";

export interface CulturalItem {
  id: string;
  name: string;
  type: string;
  category: string;
  image: { uri: string };
  description: string;
  location?: string;
  coordinates?: { latitude: number; longitude: number };
}

interface SavedItemsContextType {
  savedItems: CulturalItem[];
  saveItem: (item: CulturalItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  isItemSaved: (id: string) => boolean;
  isLoading: boolean;
  error: string | null;
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(
  undefined
);

export const SavedItemsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [savedItems, setSavedItems] = useState<CulturalItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved items from API and fall back to local storage if offline
  useEffect(() => {
    const fetchSavedItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get the authentication token
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          // If no token, try to load from local storage
          const savedData = await AsyncStorage.getItem("savedItems");
          if (savedData) {
            setSavedItems(JSON.parse(savedData));
          }
          return;
        }

        // Fetch from API if authenticated
        const response = await axios.get(`${API_URL}/saved-items`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setSavedItems(response.data.data);
          // Update local storage for offline access
          await AsyncStorage.setItem(
            "savedItems",
            JSON.stringify(response.data.data)
          );
        }
      } catch (error) {
        console.error("Error fetching saved items:", error);

        // Try to load from local storage if API fails
        try {
          const savedData = await AsyncStorage.getItem("savedItems");
          if (savedData) {
            setSavedItems(JSON.parse(savedData));
          }
        } catch (localError) {
          console.error("Error loading from local storage:", localError);
          setError("Failed to load saved items");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedItems();
  }, []);

  // Function to save an item to API and local storage
  const saveItem = async (item: CulturalItem) => {
    setIsLoading(true);
    setError(null);
    try {
      // Check if already saved to prevent duplicates
      if (isItemSaved(item.id)) {
        return;
      }

      // Get the token for authentication
      const token = await AsyncStorage.getItem("token");

      if (token) {
        // Save to API if authenticated
        await axios.post(`${API_URL}/saved-items`, item, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Update local state and storage regardless of API result
      const updatedItems = [...savedItems, item];
      setSavedItems(updatedItems);
      await AsyncStorage.setItem("savedItems", JSON.stringify(updatedItems));
    } catch (error) {
      console.error("Error saving item:", error);
      setError("Failed to save item");

      // Still update local state for offline operation
      if (!isItemSaved(item.id)) {
        const updatedItems = [...savedItems, item];
        setSavedItems(updatedItems);
        await AsyncStorage.setItem("savedItems", JSON.stringify(updatedItems));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to remove an item
  const removeItem = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Get the token for authentication
      const token = await AsyncStorage.getItem("token");

      if (token) {
        // Delete from API if authenticated
        await axios.delete(`${API_URL}/saved-items/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Update local state and storage regardless of API result
      const updatedItems = savedItems.filter((item) => item.id !== id);
      setSavedItems(updatedItems);
      await AsyncStorage.setItem("savedItems", JSON.stringify(updatedItems));
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Failed to remove item");

      // Still update local state for offline operation
      const updatedItems = savedItems.filter((item) => item.id !== id);
      setSavedItems(updatedItems);
      await AsyncStorage.setItem("savedItems", JSON.stringify(updatedItems));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check if an item is saved
  const isItemSaved = (id: string) => {
    return savedItems.some((item) => item.id === id);
  };

  return (
    <SavedItemsContext.Provider
      value={{
        savedItems,
        saveItem,
        removeItem,
        isItemSaved,
        isLoading,
        error,
      }}
    >
      {children}
    </SavedItemsContext.Provider>
  );
};

// Custom hook to use the saved items context
export const useSavedItems = () => {
  const context = useContext(SavedItemsContext);
  if (context === undefined) {
    throw new Error("useSavedItems must be used within a SavedItemsProvider");
  }
  return context;
};
