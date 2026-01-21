import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { SecondaryButton } from '../components/SecondaryButton';
import { TextField } from '../components/TextField';
import { hyderabadHotspots, locationCoordinates } from '../data/locations';
import { colors } from '../theme/colors';
import { BookingDetails, VehicleType } from '../types';
import { estimateFare, formatInr, haversineKm } from '../utils/fare';

interface BookingWizardScreenProps {
  initialName: string;
  initialPhone: string;
  initialVehicle: VehicleType;
  onCancel: () => void;
  onComplete: (details: BookingDetails) => void;
}

const steps = ['Contact', 'Pickup', 'Destination', 'Confirm'];

export const BookingWizardScreen: React.FC<BookingWizardScreenProps> = ({
  initialName,
  initialPhone,
  initialVehicle,
  onCancel,
  onComplete,
}) => {
  const [step, setStep] = useState(0);
  const [riderName, setRiderName] = useState(initialName);
  const [riderPhone, setRiderPhone] = useState(initialPhone);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>(initialVehicle);

  const distanceKm = useMemo(() => {
    const start = locationCoordinates[pickup];
    const end = locationCoordinates[destination];
    if (start && end) {
      return haversineKm(start.lat, start.lon, end.lat, end.lon);
    }
    if (!pickup || !destination) {
      return 0;
    }
    const seed = pickup.length + destination.length;
    return Math.round(((seed % 9) + 4) * 10) / 10;
  }, [pickup, destination]);

  const fareEstimate = useMemo(() => {
    if (distanceKm <= 0) return 0;
    return estimateFare(distanceKm, vehicleType);
  }, [distanceKm, vehicleType]);

  const canContinue = useMemo(() => {
    if (step === 0) {
      return riderName.trim().length > 1 && riderPhone.replace(/\D/g, '').length === 10;
    }
    if (step === 1) return pickup.trim().length > 1;
    if (step === 2) return destination.trim().length > 1;
    return pickup.trim().length > 1 && destination.trim().length > 1;
  }, [step, riderName, riderPhone, pickup, destination]);

  const handleComplete = () => {
    const details: BookingDetails = {
      riderName: riderName.trim(),
      riderPhone: riderPhone.trim(),
      pickup,
      destination,
      vehicleType,
      distanceKm,
      fareEstimate,
    };
    onComplete(details);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader title="Book a ride" subtitle={`Step ${step + 1} of ${steps.length}`} />
      <SectionCard style={styles.stepperCard}>
        <View style={styles.stepRow}>
          {steps.map((label, index) => {
            const active = index === step;
            return (
              <View key={label} style={styles.stepItem}>
                <View style={[styles.stepDot, active && styles.stepDotActive]} />
                <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
              </View>
            );
          })}
        </View>
      </SectionCard>

      {step === 0 && (
        <SectionCard style={styles.section}>
          <TextField label="Rider name" value={riderName} onChangeText={setRiderName} />
          <TextField
            label="India mobile number"
            placeholder="10-digit number"
            keyboardType="phone-pad"
            value={riderPhone}
            onChangeText={setRiderPhone}
          />
        </SectionCard>
      )}

      {step === 1 && (
        <SectionCard style={styles.section}>
          <Text style={styles.sectionTitle}>Pick-up point</Text>
          <TextField
            label="Pickup"
            placeholder="Search your pickup"
            value={pickup}
            onChangeText={setPickup}
          />
          <View style={styles.chipRow}>
            {hyderabadHotspots.slice(0, 6).map((spot) => (
              <Pressable
                key={spot}
                style={[styles.chip, pickup === spot && styles.chipActive]}
                onPress={() => setPickup(spot)}
              >
                <Text style={styles.chipText}>{spot}</Text>
              </Pressable>
            ))}
          </View>
        </SectionCard>
      )}

      {step === 2 && (
        <SectionCard style={styles.section}>
          <Text style={styles.sectionTitle}>Drop destination</Text>
          <TextField
            label="Destination"
            placeholder="Search your drop"
            value={destination}
            onChangeText={setDestination}
          />
          <View style={styles.chipRow}>
            {hyderabadHotspots.slice(6).map((spot) => (
              <Pressable
                key={spot}
                style={[styles.chip, destination === spot && styles.chipActive]}
                onPress={() => setDestination(spot)}
              >
                <Text style={styles.chipText}>{spot}</Text>
              </Pressable>
            ))}
          </View>
        </SectionCard>
      )}

      {step === 3 && (
        <SectionCard style={styles.section}>
          <Text style={styles.sectionTitle}>Confirm ride</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pickup</Text>
            <Text style={styles.summaryValue}>{pickup}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Destination</Text>
            <Text style={styles.summaryValue}>{destination}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Vehicle</Text>
            <Text style={styles.summaryValue}>{vehicleType}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Distance</Text>
            <Text style={styles.summaryValue}>{distanceKm ? `${distanceKm} km` : '—'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fare</Text>
            <Text style={styles.summaryValue}>{fareEstimate ? formatInr(fareEstimate) : '—'}</Text>
          </View>
          <View style={styles.vehicleRow}>
            {(['Auto', 'Car', 'Bike', 'Scooty', 'EV'] as VehicleType[]).map((type) => (
              <Pressable
                key={type}
                style={[styles.vehicleChip, vehicleType === type && styles.vehicleChipActive]}
                onPress={() => setVehicleType(type)}
              >
                <Text style={styles.vehicleChipText}>{type}</Text>
              </Pressable>
            ))}
          </View>
        </SectionCard>
      )}

      <View style={styles.buttonRow}>
        <SecondaryButton label="Back" onPress={step === 0 ? onCancel : () => setStep((s) => s - 1)} />
        {step < steps.length - 1 ? (
          <PrimaryButton label="Next" onPress={() => setStep((s) => s + 1)} disabled={!canContinue} />
        ) : (
          <PrimaryButton label="Confirm ride" onPress={handleComplete} disabled={!canContinue} />
        )}
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
  stepperCard: {
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.surfaceAlt,
    marginBottom: 6,
  },
  stepDotActive: {
    backgroundColor: colors.accent,
  },
  stepLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: colors.textPrimary,
    fontWeight: '600',
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 6,
  },
  chipActive: {
    borderColor: colors.accent,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  vehicleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  vehicleChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceAlt,
  },
  vehicleChipActive: {
    backgroundColor: colors.accent,
  },
  vehicleChipText: {
    color: colors.textPrimary,
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});
