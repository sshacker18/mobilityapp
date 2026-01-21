import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';
import { VehicleType } from '../types';

interface VehicleOption {
  type: VehicleType;
  title: string;
  description: string;
  rate: string;
}

const vehicleOptions: VehicleOption[] = [
  {
    type: 'Auto',
    title: 'Auto Rush',
    description: 'Beat the traffic with the fastest autos nearby.',
    rate: '₹12/km',
  },
  {
    type: 'Car',
    title: 'City Sedan',
    description: 'Comfort rides with premium AC + safety kit.',
    rate: '₹18/km',
  },
  {
    type: 'Bike',
    title: 'Bike Zip',
    description: 'Quick hops for solo riders across Hyderabad.',
    rate: '₹9/km',
  },
  {
    type: 'Scooty',
    title: 'Scooty Swift',
    description: 'Comfortable rides for short commutes.',
    rate: '₹8/km',
  },
  {
    type: 'EV',
    title: 'Electric Lux',
    description: 'Silent, eco-friendly electric rides.',
    rate: '₹16/km',
  },
];

interface HomeScreenProps {
  userName: string;
  onStartBooking: (vehicleType: VehicleType) => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName,
  onStartBooking,
  onOpenSettings,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('Car');

  const greeting = useMemo(() => {
    const firstName = userName.split(' ')[0];
    return firstName ? `Hey ${firstName}` : 'Hey there';
  }, [userName]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <ScreenHeader
            title={greeting}
            subtitle="Choose your ride vibe in Hyderabad."
          />
        </View>
        <Pressable style={styles.settingsChip} onPress={onOpenSettings}>
          <Text style={styles.settingsText}>Settings</Text>
        </Pressable>
      </View>
      <SectionCard style={styles.promoCard}>
        <Text style={styles.promoTitle}>Late-night safety</Text>
        <Text style={styles.promoBody}>
          24/7 driver verification, SOS assist, and ride sharing in one tap.
        </Text>
      </SectionCard>
      <Text style={styles.sectionLabel}>Top vehicles</Text>
      {vehicleOptions.map((option) => {
        const active = option.type === selectedVehicle;
        return (
          <Pressable
            key={option.type}
            style={[styles.vehicleCard, active && styles.vehicleCardActive]}
            onPress={() => setSelectedVehicle(option.type)}
          >
            <View style={styles.vehicleHeader}>
              <Text style={styles.vehicleTitle}>{option.title}</Text>
              <Text style={styles.vehicleRate}>{option.rate}</Text>
            </View>
            <Text style={styles.vehicleDescription}>{option.description}</Text>
          </Pressable>
        );
      })}
      <PrimaryButton
        label="Book this ride"
        onPress={() => onStartBooking(selectedVehicle)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  promoCard: {
    marginBottom: 20,
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
  promoTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  promoBody: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 12,
  },
  vehicleCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  vehicleCardActive: {
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  vehicleTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  vehicleRate: {
    color: colors.accentSoft,
    fontSize: 14,
    fontWeight: '600',
  },
  vehicleDescription: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
