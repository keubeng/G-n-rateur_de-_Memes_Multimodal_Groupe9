import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../services/api';
import { colors, spacing, radius, shadow } from '../theme';

export default function ContextReaderScreen({ navigation }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localCulture, setLocalCulture] = useState(true);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatingImage, setGeneratingImage] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Merci de saisir un texte.');
      return;
    }
    setError('');
    setGeneratedImage(null);
    setLoading(true);
    try {
      const response = await api.post('/context-reader', { text, localCulture });
      navigation.navigate('Result', { memeText: response.data.memeText });
    } catch (err) {
      setError('Erreur lors de la génération. Vérifie que le backend tourne.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!text.trim()) {
      setError('Merci de saisir un texte.');
      return;
    }
    setError('');
    setGeneratingImage(true);
    try {
      const response = await api.post('/generate-image', { context: text });
      setGeneratedImage(`data:image/png;base64,${response.data.imageBase64}`);
    } catch (err) {
      setError("Impossible de générer l'image pour le moment.");
    } finally {
      setGeneratingImage(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
          <Icon name="message-text-outline" size={32} color={colors.primary} />
        </View>

        <Text style={styles.title}>Context Reader</Text>
        <Text style={styles.subtitle}>
          Colle un extrait de discussion, l'IA analyse le ton et génère une légende de meme adaptée.
        </Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Ex: Mon ami m'a encore posé un lapin..."
            placeholderTextColor={colors.textMuted}
            value={text}
            onChangeText={setText}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>🇨🇲 Expressions camerounaises</Text>
          <Switch
            value={localCulture}
            onValueChange={setLocalCulture}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Icon name="alert-circle-outline" size={18} color={colors.dangerDark} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleGenerate}
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

        <TouchableOpacity
          style={[styles.imageButton, generatingImage && styles.buttonDisabled]}
          onPress={handleGenerateImage}
          disabled={generatingImage}
          activeOpacity={0.85}
        >
          {generatingImage ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Icon name="image-auto-adjust" size={20} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.imageButtonText}>Générer une image IA (bonus)</Text>
            </>
          )}
        </TouchableOpacity>

        {generatedImage && (
          <View style={styles.generatedImageCard}>
            <Image source={{ uri: generatedImage }} style={styles.generatedImage} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingTop: spacing.lg, flexGrow: 1 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.textMuted, lineHeight: 20, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.sm,
    ...shadow,
    marginBottom: spacing.sm,
  },
  input: {
    minHeight: 130,
    fontSize: 15,
    color: colors.text,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  switchLabel: { fontSize: 14, color: colors.text, fontWeight: '600' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger + '15',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    gap: 8,
  },
  errorText: { color: colors.dangerDark, fontSize: 13, flex: 1 },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    ...shadow,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  imageButton: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  imageButtonText: { color: colors.primary, fontSize: 15, fontWeight: '700' },
  generatedImageCard: {
    marginTop: spacing.sm,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadow,
  },
  generatedImage: { width: '100%', height: 300, resizeMode: 'cover' },
});