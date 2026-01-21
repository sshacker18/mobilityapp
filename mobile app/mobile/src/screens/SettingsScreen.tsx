import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { SecondaryButton } from '../components/SecondaryButton';
import { colors } from '../theme/colors';
import { useSoundSettings } from '../context/SoundSettingsContext';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { isMuted, volume, setMuted, setVolume } = useSoundSettings();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader title="Settings" subtitle="Customize audio preferences." />
      <SectionCard style={styles.section}>
        <Text style={styles.sectionTitle}>Sound effects</Text>
        <View style={styles.audioRow}>
          <Pressable
            style={[styles.audioButton, isMuted && styles.audioButtonMuted]}
            onPress={() => setMuted(!isMuted)}
          >
            <Text style={styles.audioText}>{isMuted ? 'Muted' : 'Sound On'}</Text>
          </Pressable>
          <View style={styles.volumeRow}>
            {([
              { label: 'Low', value: 0.2 },
              { label: 'Med', value: 0.35 },
              { label: 'High', value: 0.55 },
            ] as const).map((option) => (
              <Pressable
                key={option.label}
                style={[
                  styles.audioButton,
                  volume === option.value && styles.audioButtonActive,
                ]}
                onPress={() => {
                  setVolume(option.value);
                  setMuted(false);
                }}
              >
                <Text style={styles.audioText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <Text style={styles.hint}>Preferences apply to all mini-games.</Text>
      </SectionCard>
      <SecondaryButton label="Back" onPress={onBack} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  audioRow: {
    gap: 12,
  },
  volumeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  audioButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.surfaceAlt,
  },
  audioButtonActive: {
    borderColor: colors.accent,
  },
  audioButtonMuted: {
    opacity: 0.6,
  },
  audioText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },
});
