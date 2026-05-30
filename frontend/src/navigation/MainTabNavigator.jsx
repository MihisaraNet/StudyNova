import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

import DashboardNavigator   from './DashboardNavigator';
import SubjectNavigator     from './SubjectNavigator';
import TaskNavigator        from './TaskNavigator';
import TimetableNavigator   from './TimetableNavigator';
import ProfileScreen        from '../screens/profile/ProfileScreen';
import AnalyticsScreen      from '../screens/analytics/AnalyticsScreen';

const Tab = createBottomTabNavigator();

const tabIcons = {
  Dashboard:   ['grid',                'grid-outline'],
  Subjects:    ['book',                'book-outline'],
  Tasks:       ['checkmark-circle',    'checkmark-circle-outline'],
  Timetable:   ['calendar',            'calendar-outline'],
  Progress:    ['bar-chart',           'bar-chart-outline'],
  Profile:     ['person',              'person-outline'],
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: '#161334',
          borderTopColor:  'rgba(255,255,255,0.06)',
          borderTopWidth:  1,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
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
      <Tab.Screen name="Dashboard"  component={DashboardNavigator} />
      <Tab.Screen name="Subjects"   component={SubjectNavigator} />
      <Tab.Screen name="Tasks"      component={TaskNavigator} />
      <Tab.Screen name="Timetable"  component={TimetableNavigator} />
      <Tab.Screen name="Progress"   component={AnalyticsScreen} />
      <Tab.Screen name="Profile"    component={ProfileScreen} />
    </Tab.Navigator>
  );
}

