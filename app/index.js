import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { registerRootComponent } from 'expo';
import AppNavigator from '../src/navigation/AppNavigator';
import { COLORS } from '../src/constants/theme';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={COLORS.primary}
        translucent={false}
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
};

// 显式注册App组件作为应用根组件
registerRootComponent(App);

export default App;