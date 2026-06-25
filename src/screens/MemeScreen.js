 import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image } from 'react-native';
import { generateMeme } from '../services/memeAI';

export default function MemeScreen() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    const data = await generateMeme(text);
    setResult(data);
  };

  return (
    <View style={{ padding: 20, marginTop: 50 }}>

      <Text style={{ fontSize: 18 }}>
        Ton idée de meme
      </Text>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Ex: prof en retard"
        style={{
          borderWidth: 1,
          padding: 10,
          marginVertical: 10,
          borderRadius: 5
        }}
      />

      <Button title="Générer" onPress={handleGenerate} />

      {result && (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Image
            source={{ uri: result.image }}
            style={{ width: 250, height: 250 }}
          />

          <Text style={{ marginTop: 10 }}>
            {result.text}
          </Text>
        </View>
      )}

    </View>
  );
}