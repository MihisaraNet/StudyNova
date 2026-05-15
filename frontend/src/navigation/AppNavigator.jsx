import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import useAuthStore from '../store/authStore';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import SplashScreen from '../screens/auth/SplashScreen';

export default function AppNavigator() {
  const { isLoggedIn, isLoading, loadSession } = useAuthStore();

  useEffect(() => {
    loadSession();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
