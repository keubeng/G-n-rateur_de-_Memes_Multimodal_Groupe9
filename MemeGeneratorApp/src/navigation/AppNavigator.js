import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import ContextReaderScreen from '../screens/ContextReaderScreen';
import VoiceToMemeScreen from '../screens/VoiceToMemeScreen';
import StatusRemixerScreen from '../screens/StatusRemixerScreen';
import ResultScreen from '../screens/ResultScreen';
import SharedContentScreen from '../screens/SharedContentScreen';
import { colors } from '../theme';

const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.background, elevation: 0, shadowOpacity: 0 },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '700', fontSize: 17 },
};

export default function AppNavigator({ navigationRef }) {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ContextReader" component={ContextReaderScreen} options={{ title: 'Context Reader' }} />
        <Stack.Screen name="VoiceToMeme" component={VoiceToMemeScreen} options={{ title: 'Voice-to-Meme' }} />
        <Stack.Screen name="StatusRemixer" component={StatusRemixerScreen} options={{ title: 'Status Remixer' }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Résultat', headerLeft: () => null }} />
        <Stack.Screen name="SharedContent" component={SharedContentScreen} options={{ title: 'Contenu partagé' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}