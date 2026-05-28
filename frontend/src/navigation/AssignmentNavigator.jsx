import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssignmentListScreen from '../screens/assignments/AssignmentListScreen';
import AddAssignmentScreen from '../screens/assignments/AddAssignmentScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';

const Stack = createNativeStackNavigator();

export default function AssignmentNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AssignmentList" component={AssignmentListScreen} />
      <Stack.Screen name="AddAssignment" component={AddAssignmentScreen} />
      <Stack.Screen name="AssignmentDetail" component={AssignmentDetailScreen} />
    </Stack.Navigator>
  );
}
