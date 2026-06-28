import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../services/api';
import { colors, spacing, radius, shadow } from '../theme';

export default function SharedContentScreen({ route, navigation }) {
  const { sharedText, sharedImageUri } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateFromText = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/context-reader', {
        text: sharedText,
        localCulture: true,
      });
      navigation.navigate('Result', { memeText: response.data.memeText });
    } catch (err) {
      setError('Erreur lors de la génération.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFromImage = async () => {
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', {
      uri: sharedImageUri,
      type: 'image/jpeg',
      name: 'shared.jpg',
    });
    try {
      const response = await api.post('/status-remixer', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigation.navigate('Result', {
        memeText: response.data.memeText,
        capturedImageUri: sharedImageUri,
      });
    } catch (err) {
      setError('Erreur lors de la génération.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.secondary + '20' }]}>
        <Icon name="share-variant" size={32} color={colors.secondary} />
      </View>
      <Text style={styles.title}>Contenu partagé reçu</Text>

      {sharedText && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>TEXTE REÇU</Text>
          <Text style={styles.cardText}>{sharedText}</Text>
        </View>
      )}

      {sharedImageUri && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>IMAGE REÇUE</Text>
          <Image source={{ uri: sharedImageUri }} style={styles.previewImage} />
        </View>
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={sharedImageUri ? handleGenerateFromImage : handleGenerateFromText}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            <Icon name="auto-fix" size={20} color={colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Générer le meme</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.md, paddingTop: spacing.xl, backgroundColor: colors.background, alignItems: 'center' },
  iconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  card: { width: '100%', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.sm, ...shadow },
  cardLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1, marginBottom: 8 },
  cardText: { fontSize: 15, color: colors.text },
  previewImage: { width: '100%', height: 250, borderRadius: radius.sm, resizeMode: 'cover' },
  errorText: { color: colors.dangerDark, marginBottom: spacing.sm },
  button: { flexDirection: 'row', backgroundColor: colors.primary, padding: 16, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: spacing.sm, ...shadow },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});