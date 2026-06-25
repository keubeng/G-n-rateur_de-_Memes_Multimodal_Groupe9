 import React from 'react';
import { View, Text, Image } from 'react-native';

export default function MemeCard({ meme }) {
  return (
    <View style={{ marginTop: 20, alignItems: 'center' }}>
      <Image
        source={{ uri: meme.image }}
        style={{ width: 250, height: 250 }}
      />
      <Text>{meme.text}</Text>
    </View>
  );
}