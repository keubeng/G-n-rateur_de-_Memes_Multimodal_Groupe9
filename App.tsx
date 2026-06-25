 import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import MemeScreen from './src/screens/MemeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">

        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'MemeAI 🤖' }}
        />

        <Stack.Screen 
          name="CreateMeme" 
          component={MemeScreen} 
          options={{ title: 'Créer un meme' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}