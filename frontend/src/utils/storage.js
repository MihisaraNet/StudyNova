import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Retrieves an item from storage.
 */
export const getItem = async (key) => {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        return window.localStorage.getItem(key);
      }
      return null;
    }
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error('Error reading storage key:', key, error);
    return null;
  }
};

/**
 * Stores an item in storage.
 */
export const setItem = async (key, value) => {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error('Error writing storage key:', key, error);
  }
};

/**
 * Deletes an item from storage.
 */
export const deleteItem = async (key) => {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error('Error deleting storage key:', key, error);
  }
};
