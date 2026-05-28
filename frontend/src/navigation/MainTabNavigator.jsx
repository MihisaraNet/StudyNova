import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

import DashboardNavigator   from './DashboardNavigator';
import SubjectNavigator     from './SubjectNavigator';
import AssignmentNavigator  from './AssignmentNavigator';
import TimetableNavigator   from './TimetableNavigator';
import ProfileScreen        from '../screens/profile/ProfileScreen';
import GPACalculatorScreen  from '../screens/gpa/GPACalculatorScreen';

const Tab = createBottomTabNavigator();

const tabIcons = {
  Dashboard:   ['grid',         'grid-outline'],
  Subjects:    ['book',         'book-outline'],
  Assignments: ['checkmark-circle', 'checkmark-circle-outline'],
  Timetable:   ['calendar',     'calendar-outline'],
  GPA:         ['school',       'school-outline'],
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
      <Tab.Screen name="Dashboard"      component={DashboardNavigator} />
      <Tab.Screen name="Subjects"       component={SubjectNavigator} />
      <Tab.Screen name="Assignments"    component={AssignmentNavigator} />
      <Tab.Screen name="Timetable"      component={TimetableNavigator} />
      <Tab.Screen name="GPA"            component={GPACalculatorScreen} />
      <Tab.Screen name="Profile"        component={ProfileScreen} />
    </Tab.Navigator>
  );
}

