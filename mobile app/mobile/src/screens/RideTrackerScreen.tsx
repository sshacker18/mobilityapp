import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BlockDropGame } from '../components/BlockDropGame';
import { FunFactCard } from '../components/FunFactCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { SecondaryButton } from '../components/SecondaryButton';
import { TicTacToeGame } from '../components/TicTacToeGame';
import { colors } from '../theme/colors';
import { BookingDetails, DriverProfile } from '../types';
import { formatInr } from '../utils/fare';

interface RideTrackerScreenProps {
  booking: BookingDetails;
  driver: DriverProfile;
  onBackHome: () => void;
  onViewTrips: () => void;
  onOpenSettings: () => void;
}

export const RideTrackerScreen: React.FC<RideTrackerScreenProps> = ({
  booking,
  driver,
  onBackHome,
  onViewTrips,
  onOpenSettings,
}) => {
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0.05);
  const [factIndex, setFactIndex] = useState(0);

  const funFacts = [
    'Hyderabad’s MMTS line carries over 2 lakh commuters daily.',
    'Auto-rickshaws here can reach narrow lanes faster than cars.',
    'Charminar was built in 1591 and still anchors the old city.',
    'EV rides can cut city emissions by 30% on average routes.',
    'Durgam Cheruvu is known as the “Secret Lake” of the city.',
  ];

  useEffect(() => {
    if (!started) return;
    if (progress >= 1) return;
    const timer = setInterval(() => {
      setProgress((prev) => Math.min(1, prev + 0.08));
    }, 1400);
    return () => clearInterval(timer);
  }, [started, progress]);

  useEffect(() => {
    if (started) return;
    const timer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % funFacts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [started, funFacts.length]);

  const statusLabel = useMemo(() => {
    if (!started) return 'Driver arriving in 4 min';
    if (progress >= 1) return 'Ride complete';
    return 'On the way to destination';
  }, [started, progress]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <ScreenHeader title="Track your ride" subtitle={statusLabel} />
        </View>
        <Pressable style={styles.settingsChip} onPress={onOpenSettings}>
          <Text style={styles.settingsText}>Settings</Text>
        </Pressable>
      </View>
      <SectionCard style={styles.section}>
        <Text style={styles.label}>Driver</Text>
        <Text style={styles.value}>{driver.name}</Text>
        <Text style={styles.meta}>
          {driver.vehicleType} · {driver.vehicleNumber}
        </Text>
        <Text style={styles.meta}>Rating ★ {driver.rating.toFixed(1)}</Text>
      </SectionCard>

      <SectionCard style={styles.section}>
        <Text style={styles.label}>Route</Text>
        <Text style={styles.value}>{booking.pickup}</Text>
        <Text style={styles.meta}>to {booking.destination}</Text>
        <View style={styles.progressWrap}>
          <ProgressBar progress={progress} />
        </View>
        <Text style={styles.meta}>
          {Math.round(progress * 100)}% · {booking.distanceKm} km
        </Text>
      </SectionCard>

      {!started && (
        <SectionCard style={styles.section}>
          <FunFactCard fact={funFacts[factIndex]} />
        </SectionCard>
      )}

      <Text style={styles.sectionTitle}>Games while you ride</Text>
      <View style={styles.gamesSection}>
        <TicTacToeGame />
        <BlockDropGame />
      </View>

      <SectionCard style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Fare</Text>
          <Text style={styles.value}>{formatInr(booking.fareEstimate)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment</Text>
          <Text style={styles.value}>UPI / Cash</Text>
        </View>
      </SectionCard>

      <View style={styles.buttonRow}>
        {!started ? (
          <PrimaryButton label="Start ride" onPress={() => setStarted(true)} />
        ) : progress >= 1 ? (
          <PrimaryButton label="View trips" onPress={onViewTrips} />
        ) : (
          <SecondaryButton label="Back home" onPress={onBackHome} />
        )}
      </View>
      {progress >= 1 && (
        <SecondaryButton label="Back home" onPress={onBackHome} style={styles.secondarySpacing} />
      )}
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
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
    paddingRight: 12,
  },
  settingsChip: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceAlt,
  },
  settingsText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 10,
  },
  gamesSection: {
    gap: 12,
    marginBottom: 18,
  },
  progressWrap: {
    marginTop: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  buttonRow: {
    marginTop: 8,
  },
  secondarySpacing: {
    marginTop: 12,
  },
});
