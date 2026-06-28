import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, radius, shadow } from '../theme';

const features = [
  {
    key: 'ContextReader',
    icon: 'message-text-outline',
    title: 'Context Reader',
    subtitle: 'Colle un texte, génère un meme',
    color: colors.primary,
  },
  {
    key: 'VoiceToMeme',
    icon: 'microphone-outline',
    title: 'Voice-to-Meme',
    subtitle: 'Enregistre une note vocale',
    color: colors.danger,
  },
  {
    key: 'StatusRemixer',
    icon: 'image-outline',
    title: 'Status Remixer',
    subtitle: 'Transforme une image en meme',
    color: colors.secondary,
  },
];

export default function HomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: translateAnim }] }}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Bienvenue 👋</Text>
          <Text style={styles.title}>Générateur de{'\n'}Memes IA</Text>
          <Text style={styles.subtitle}>
            Transforme tes discussions, audios et photos en memes grâce à l'IA.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.key}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(feature.key)}
            >
              <View style={[styles.iconCircle, { backgroundColor: feature.color + '20' }]}>
                <Icon name={feature.icon} size={28} color={feature.color} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{feature.title}</Text>
                <Text style={styles.cardSubtitle}>{feature.subtitle}</Text>
              </View>
              <Icon name="chevron-right" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Icon name="emoticon-happy-outline" size={16} color={colors.textMuted} />
          <Text style={styles.footerText}>Propulsé par l'IA Gemini</Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingTop: spacing.xl },
  header: { marginBottom: spacing.lg },
  greeting: { fontSize: 16, color: colors.textMuted, marginBottom: spacing.xs },
  title: { fontSize: 30, fontWeight: '800', color: colors.text, lineHeight: 36, marginBottom: spacing.sm },
  subtitle: { fontSize: 15, color: colors.textMuted, lineHeight: 22 },
  cardsContainer: { gap: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.sm,
    ...shadow,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 2 },
  cardSubtitle: { fontSize: 13, color: colors.textMuted },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.xl,
  },
  footerText: { fontSize: 12, color: colors.textMuted },
});