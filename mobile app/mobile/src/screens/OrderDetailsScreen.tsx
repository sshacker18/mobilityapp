import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { SecondaryButton } from '../components/SecondaryButton';
import { drivers } from '../data/drivers';
import { colors } from '../theme/colors';
import { BookingDetails, DriverProfile } from '../types';
import { formatInr } from '../utils/fare';

interface OrderDetailsScreenProps {
  booking: BookingDetails;
  onBack: () => void;
  onConfirm: (driver: DriverProfile) => void;
}

type Filter = 'Fastest' | 'Top Rated';

export const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({
  booking,
  onBack,
  onConfirm,
}) => {
  const [filter, setFilter] = useState<Filter>('Fastest');
  const [selectedDriver, setSelectedDriver] = useState<DriverProfile | null>(null);

  const availableDrivers = useMemo(() => {
    const filtered = drivers.filter((driver) => driver.vehicleType === booking.vehicleType);
    if (filter === 'Top Rated') {
      return [...filtered].sort((a, b) => b.rating - a.rating);
    }
    return [...filtered].sort((a, b) => a.etaMinutes - b.etaMinutes);
  }, [booking.vehicleType, filter]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader title="Review your ride" subtitle="Pick a driver and confirm." />
      <SectionCard style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Pickup</Text>
          <Text style={styles.value}>{booking.pickup}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Destination</Text>
          <Text style={styles.value}>{booking.destination}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Distance</Text>
          <Text style={styles.value}>{booking.distanceKm} km</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Estimated fare</Text>
          <Text style={styles.value}>{formatInr(booking.fareEstimate)}</Text>
        </View>
      </SectionCard>

      <Text style={styles.sectionTitle}>Drivers nearby</Text>
      <View style={styles.filterRow}>
        {(['Fastest', 'Top Rated'] as Filter[]).map((option) => (
          <Pressable
            key={option}
            style={[styles.filterChip, filter === option && styles.filterChipActive]}
            onPress={() => setFilter(option)}
          >
            <Text style={styles.filterText}>{option}</Text>
          </Pressable>
        ))}
      </View>

      {availableDrivers.map((driver) => {
        const active = selectedDriver?.id === driver.id;
        return (
          <Pressable
            key={driver.id}
            style={[styles.driverCard, active && styles.driverCardActive]}
            onPress={() => setSelectedDriver(driver)}
          >
            <View style={styles.driverHeader}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.driverRating}>★ {driver.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.driverMeta}>
              {driver.vehicleType} · {driver.vehicleNumber}
            </Text>
            <Text style={styles.driverMeta}>
              ETA {driver.etaMinutes} min · {driver.condition}
            </Text>
          </Pressable>
        );
      })}

      <View style={styles.buttonRow}>
        <SecondaryButton label="Back" onPress={onBack} />
        <PrimaryButton
          label="Confirm booking"
          onPress={() => selectedDriver && onConfirm(selectedDriver)}
          disabled={!selectedDriver}
        />
      </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  value: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  filterChipActive: {
    borderColor: colors.accent,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  driverCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  driverCardActive: {
    borderColor: colors.accent,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  driverName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  driverRating: {
    color: colors.accentSoft,
    fontSize: 13,
  },
  driverMeta: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});
