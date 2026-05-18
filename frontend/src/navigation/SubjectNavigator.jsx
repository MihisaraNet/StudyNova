import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SubjectListScreen from '../screens/subjects/SubjectListScreen';
import AddSubjectScreen from '../screens/subjects/AddSubjectScreen';
import EditSubjectScreen from '../screens/subjects/EditSubjectScreen';

const Stack = createNativeStackNavigator();

export default function SubjectNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SubjectList" component={SubjectListScreen} />
      <Stack.Screen name="AddSubject" component={AddSubjectScreen} />
      <Stack.Screen name="EditSubject" component={EditSubjectScreen} />
    </Stack.Navigator>
  );
}
