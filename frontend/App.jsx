import './src/utils/errorTracker';
import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import useAuthStore from './src/store/authStore';
import useSubjectStore from './src/store/subjectStore';
import useTimetableStore from './src/store/timetableStore';

import { ScrollView, View, Text } from 'react-native';

if (typeof window !== 'undefined') {
  window.useAuthStore = useAuthStore;
  window.useSubjectStore = useSubjectStore;
  window.useTimetableStore = useTimetableStore;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#fff0f0', flexGrow: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#cc0000', marginBottom: 10, fontFamily: 'monospace' }}>
            Application Error
          </Text>
          <Text style={{ fontWeight: 'bold', color: '#333', marginBottom: 15, fontFamily: 'monospace' }}>
            {this.state.error?.toString()}
          </Text>
          <View style={{ backgroundColor: '#ffe0e0', padding: 10, borderRadius: 4, marginBottom: 10 }}>
            <Text style={{ fontFamily: 'monospace', color: '#cc0000', fontSize: 12 }}>
              {this.state.error?.stack}
            </Text>
          </View>
          {this.state.errorInfo && (
            <View style={{ backgroundColor: '#ffe0e0', padding: 10, borderRadius: 4 }}>
              <Text style={{ fontFamily: 'monospace', color: '#cc0000', fontSize: 12 }}>
                {this.state.errorInfo.componentStack}
              </Text>
            </View>
          )}
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
