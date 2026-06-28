import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, radius, shadow } from '../theme';

export default function ResultScreen({ route, navigation }) {
  const { memeText, transcription, capturedImageUri } = route.params || {};
  const viewShotRef = useRef(null);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState('');

  const handleShare = async () => {
    setError('');
    setSharing(true);
    try {
      let shareUri = capturedImageUri;

      // Si pas d'image déjà capturée (cas Context Reader / Voice-to-Meme),
      // on capture la carte texte affichée à l'écran
      if (!shareUri && viewShotRef.current) {
        shareUri = await viewShotRef.current.capture();
      }

      await Share.open({
        url: shareUri.startsWith('file://') ? shareUri : `file://${shareUri}`,
        message: memeText,
      });
    } catch (err) {
      if (err?.message !== 'User did not share') {
        setError('Erreur lors du partage.');
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.secondary + '20' }]}>
        <Icon name="check-decagram-outline" size={32} color={colors.secondary} />
      </View>

      <Text style={styles.title}>Meme généré !</Text>

      {transcription ? (
        <View style={styles.transcriptionCard}>
          <Text style={styles.cardLabel}>TRANSCRIPTION</Text>
          <Text style={styles.transcriptionText}>{transcription}</Text>
        </View>
      ) : null}

      {capturedImageUri ? (
        // Cas Status Remixer : l'image finale est déjà prête
        <View style={styles.imagePreviewWrapper}>
          <Image source={{ uri: capturedImageUri }} style={styles.previewImage} />
        </View>
      ) : (
        // Cas Context Reader / Voice-to-Meme : on génère une carte texte stylée
        <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }} style={styles.memeCardWrapper}>
          <View style={styles.memeCard}>
            <Text style={styles.memeCardText}>{memeText || 'Aucun résultat'}</Text>
            <Text style={styles.memeCardWatermark}>Généré par Meme AI</Text>
          </View>
        </ViewShot>
      )}

      {!capturedImageUri && (
        <Text style={styles.captionUnderCard}>{memeText}</Text>
      )}

      {error ? (
        <View style={styles.errorBox}>
          <Icon name="alert-circle-outline" size={18} color={colors.dangerDark} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleShare}
        disabled={sharing}
        activeOpacity={0.85}
      >
        <Icon name="share-variant" size={20} color={colors.white} style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>{sharing ? 'Partage en cours...' : 'Partager le meme'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.85}
      >
        <Icon name="home-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
        <Text style={styles.homeButtonText}>Retour à l'accueil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.md, paddingTop: spacing.xl, backgroundColor: colors.background, alignItems: 'center' },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  transcriptionCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    ...shadow,
  },
  cardLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1, marginBottom: 8 },
  transcriptionText: { fontSize: 15, color: colors.text, fontStyle: 'italic', lineHeight: 22 },
  imagePreviewWrapper: {
    width: '100%',
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    ...shadow,
  },
  previewImage: { width: '100%', height: 320, resizeMode: 'cover' },
  memeCardWrapper: { width: '100%', marginBottom: spacing.sm },
  memeCard: {
    width: '100%',
    minHeight: 220,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  memeCardText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 30,
  },
  memeCardWatermark: {
    color: colors.white + 'AA',
    fontSize: 11,
    marginTop: spacing.md,
    fontWeight: '600',
  },
  captionUnderCard: { display: 'none' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger + '15',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    gap: 8,
    width: '100%',
  },
  errorText: { color: colors.dangerDark, fontSize: 13, flex: 1 },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: spacing.sm,
    ...shadow,
  },
  homeButton: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  homeButtonText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
});