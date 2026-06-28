import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import ViewShot from 'react-native-view-shot';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../services/api';
import { colors, spacing, radius, shadow } from '../theme';

export default function StatusRemixerScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [memeText, setMemeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const viewShotRef = useRef(null);

  const pickImage = () => {
    setError('');
    setMemeText('');
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        setError("Erreur lors de la sélection de l'image.");
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const generateCaption = async () => {
    if (!imageUri) {
      setError("Sélectionne d'abord une image.");
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'status.jpg',
    });

    try {
      const response = await api.post('/status-remixer', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMemeText(response.data.memeText);
    } catch (err) {
      setError('Erreur lors de la génération. Vérifie que le backend tourne.');
    } finally {
      setLoading(false);
    }
  };

  const captureAndContinue = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      navigation.navigate('Result', { memeText, capturedImageUri: uri });
    } catch (err) {
      setError('Erreur lors de la capture de l\'image.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.secondary + '20' }]}>
        <Icon name="image-outline" size={32} color={colors.secondary} />
      </View>

      <Text style={styles.title}>Status Remixer</Text>
      <Text style={styles.subtitle}>
        Choisis une image, l'IA l'analyse et propose une légende de meme adaptée.
      </Text>

      {!imageUri ? (
        <TouchableOpacity style={styles.pickCard} onPress={pickImage} activeOpacity={0.85}>
          <Icon name="image-plus" size={40} color={colors.secondary} />
          <Text style={styles.pickText}>Choisir une image</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.previewCard}>
          <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }} style={styles.viewShot}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            {memeText ? (
              <View style={styles.captionOverlay}>
                <Text style={styles.captionText}>{memeText}</Text>
              </View>
            ) : null}
          </ViewShot>

          <TouchableOpacity style={styles.changeImageButton} onPress={pickImage}>
            <Icon name="image-edit-outline" size={16} color={colors.primary} />
            <Text style={styles.changeImageText}>Changer l'image</Text>
          </TouchableOpacity>
        </View>
      )}

      {error ? (
        <View style={styles.errorBox}>
          <Icon name="alert-circle-outline" size={18} color={colors.dangerDark} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {imageUri && !memeText && (
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={generateCaption}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Icon name="auto-fix" size={20} color={colors.white} style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Générer la légende</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {imageUri && memeText && (
        <TouchableOpacity style={styles.button} onPress={captureAndContinue} activeOpacity={0.85}>
          <Icon name="check" size={20} color={colors.white} style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Valider le meme</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.md, paddingTop: spacing.lg, backgroundColor: colors.background },
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
  pickCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    paddingVertical: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  pickText: { marginTop: spacing.sm, color: colors.secondary, fontWeight: '700', fontSize: 15 },
  previewCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.sm,
    ...shadow,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  viewShot: { width: '100%', borderRadius: radius.sm, overflow: 'hidden' },
  previewImage: { width: '100%', height: 320, borderRadius: radius.sm, resizeMode: 'cover' },
  captionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: spacing.sm,
  },
  captionText: { color: colors.white, fontSize: 16, fontWeight: '800', textAlign: 'center' },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  changeImageText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
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
});