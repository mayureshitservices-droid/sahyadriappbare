import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingPage from './src/screens/LandingPage';
import PersonalDetails from './src/screens/PersonalDetails';
import BankDetails from './src/screens/BankDetails';
import LocationVerification from './src/screens/LocationVerification';
import SelfieCapture from './src/screens/SelfieCapture';
import ApplicationSuccess from './src/screens/ApplicationSuccess';

const Stack = createNativeStackNavigator();

import { ApplicationProvider } from './src/context/ApplicationContext';

function App(): React.JSX.Element {
  return (
    <ApplicationProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LandingPage" component={LandingPage} />
          <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
          <Stack.Screen name="BankDetails" component={BankDetails} />
          <Stack.Screen name="LocationVerification" component={LocationVerification} />
          <Stack.Screen name="SelfieCapture" component={SelfieCapture} />
          <Stack.Screen name="ApplicationSuccess" component={ApplicationSuccess} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  );
}

export default App;
