import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

import DashboardScreen      from '../screens/dashboard/DashboardScreen';
import SubjectNavigator     from './SubjectNavigator';
import AssignmentListScreen from '../screens/assignments/AssignmentListScreen';
import TimetableScreen      from '../screens/timetable/TimetableScreen';
import ProfileScreen        from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const tabIcons = {
  Dashboard:   ['grid',         'grid-outline'],
  Subjects:    ['book',         'book-outline'],
  Assignments: ['checkmark-circle', 'checkmark-circle-outline'],
  Timetable:   ['calendar',     'calendar-outline'],
  Profile:     ['person',       'person-outline'],
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: '#161334', // Dark semi-transparent or solid dark
          borderTopColor:  'rgba(255,255,255,0.06)',
          borderTopWidth:  1,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = tabIcons[route.name] || ['help', 'help-outline'];
          return (
            <Ionicons
              name={focused ? active : inactive}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard"      component={DashboardScreen} />
      <Tab.Screen name="Subjects"       component={SubjectNavigator} />
      <Tab.Screen name="Assignments"    component={AssignmentListScreen} />
      <Tab.Screen name="Timetable"      component={TimetableScreen} />
      <Tab.Screen name="Profile"        component={ProfileScreen} />
    </Tab.Navigator>
  );
}
