 import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
        MemeAI 🤖
      </Text>

      <View style={{ marginTop: 20 }}>
        <Button
          title="Créer un meme"
          onPress={() => navigation.navigate('CreateMeme')}
        />
      </View>
    </View>
  );
}