import './src/utils/errorTracker';
import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import useAuthStore from './src/store/authStore';
import useSubjectStore from './src/store/subjectStore';
import useGpaStore from './src/store/gpaStore';
import useTimetableStore from './src/store/timetableStore';

if (typeof window !== 'undefined') {
  window.useAuthStore = useAuthStore;
  window.useSubjectStore = useSubjectStore;
  window.useGpaStore = useGpaStore;
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
        <div style={{ padding: '20px', backgroundColor: '#fff0f0', color: '#cc0000', fontFamily: 'monospace', overflow: 'auto', height: '100vh' }}>
          <h2 style={{ margin: '0 0 10px 0' }}>Application Error</h2>
          <p style={{ fontWeight: 'bold', margin: '0 0 15px 0' }}>{this.state.error?.toString()}</p>
          <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#ffe0e0', padding: '10px', borderRadius: '4px' }}>
            {this.state.error?.stack}
          </pre>
          {this.state.errorInfo && (
            <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#ffe0e0', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
              {this.state.errorInfo.componentStack}
            </pre>
          )}
        </div>
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
