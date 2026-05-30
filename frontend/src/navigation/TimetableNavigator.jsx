import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TimetableScreen  from '../screens/timetable/TimetableScreen';
import AddSessionScreen from '../screens/timetable/AddSessionScreen';
import PomodoroScreen   from '../screens/timer/PomodoroScreen';

const Stack = createNativeStackNavigator();

export default function TimetableNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TimetableHome" component={TimetableScreen} />
      <Stack.Screen name="AddSession"    component={AddSessionScreen} />
      <Stack.Screen name="Pomodoro"      component={PomodoroScreen} />
    </Stack.Navigator>
  );
}
