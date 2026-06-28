import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AudioRecord from 'react-native-audio-record';
import api from '../services/api';
import { colors, spacing, radius, shadow } from '../theme';

const audioOptions = {
  sampleRate: 16000,
  channels: 1,
  bitsPerSample: 16,
  audioSource: 6,
  wavFile: 'voice.wav',
};

export default function VoiceToMemeScreen({ navigation }) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);

  const requestMicPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Permission microphone',
          message: "L'application a besoin d'accéder au microphone.",
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const startRecording = async () => {
    const hasPermission = await requestMicPermission();
    if (!hasPermission) {
      setError('Permission micro refusée.');
      return;
    }
    setError('');
    setHasRecorded(false);

    if (!initialized) {
      AudioRecord.init(audioOptions);
      setInitialized(true);
    }

    AudioRecord.start();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    const filePath = await AudioRecord.stop();
    setIsRecording(false);
    setHasRecorded(true);
    global.lastRecordingPath = filePath;
  };

  const sendAudio = async () => {
    if (!global.lastRecordingPath) {
      setError('Aucun enregistrement à envoyer.');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('audio', {
      uri: 'file://' + global.lastRecordingPath,
      type: 'audio/wav',
      name: 'voice.wav',
    });

    try {
      const response = await api.post('/voice-to-meme', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigation.navigate('Result', {
        memeText: response.data.memeText,
        transcription: response.data.transcription,
      });
    } catch (err) {
      setError("Erreur lors de l'envoi. Vérifie que le backend tourne.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.danger + '20' }]}>
        <Icon name="microphone-outline" size={32} color={colors.danger} />
      </View>

      <Text style={styles.title}>Voice-to-Meme</Text>
      <Text style={styles.subtitle}>
        Enregistre une note vocale, l'IA la transcrit et génère un meme adapté.
      </Text>

      <View style={styles.recordCard}>
        <TouchableOpacity
          style={[styles.recordCircle, isRecording && styles.recordCircleActive]}
          onPress={isRecording ? stopRecording : startRecording}
          activeOpacity={0.85}
        >
          <Icon
            name={isRecording ? 'stop' : 'microphone'}
            size={36}
            color={colors.white}
          />
        </TouchableOpacity>
        <Text style={styles.recordLabel}>
          {isRecording ? 'Enregistrement en cours...' : "Appuie pour démarrer"}
        </Text>

        {hasRecorded && !isRecording && (
          <View style={styles.successBadge}>
            <Icon name="check-circle" size={16} color={colors.secondary} />
            <Text style={styles.successText}>Enregistrement prêt</Text>
          </View>
        )}
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Icon name="alert-circle-outline" size={18} color={colors.dangerDark} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.button, (loading || !hasRecorded) && styles.buttonDisabled]}
        onPress={sendAudio}
        disabled={loading || !hasRecorded}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            <Icon name="send-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Envoyer et générer le meme</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md, paddingTop: spacing.lg },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.textMuted, lineHeight: 20, marginBottom: spacing.lg },
  recordCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadow,
    marginBottom: spacing.sm,
  },
  recordCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  recordCircleActive: { backgroundColor: colors.dangerDark },
  recordLabel: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    backgroundColor: colors.secondary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  successText: { color: colors.secondary, fontWeight: '700', fontSize: 13 },
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
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});