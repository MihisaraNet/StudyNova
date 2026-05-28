import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskListScreen from '../screens/tasks/TaskListScreen';
import AddTaskScreen from '../screens/tasks/AddTaskScreen';
import TaskDetailScreen from '../screens/tasks/TaskDetailScreen';

const Stack = createNativeStackNavigator();

export default function TaskNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TaskList" component={TaskListScreen} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
    </Stack.Navigator>
  );
}
