import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';
import { TextField } from '../components/TextField';
import { colors } from '../theme/colors';

interface LoginScreenProps {
  initialName?: string;
  initialPhone?: string;
  onContinue: (name: string, phone: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  initialName = '',
  initialPhone = '',
  onContinue,
}) => {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);

  const isValid = useMemo(() => {
    const digits = phone.replace(/\D/g, '');
    return name.trim().length > 1 && digits.length === 10;
  }, [name, phone]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreenHeader
        title="Welcome back"
        subtitle="Log in to book Hyderabad rides in seconds."
      />
      <SectionCard>
        <TextField
          label="Full name"
          placeholder="e.g. Aisha Khan"
          value={name}
          onChangeText={setName}
        />
        <TextField
          label="Mobile number"
          placeholder="10-digit India number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          hint="We’ll use this to send ride updates."
        />
        <PrimaryButton
          label="Continue"
          onPress={() => onContinue(name.trim(), phone.trim())}
          disabled={!isValid}
        />
      </SectionCard>
      <View style={styles.footer}>
        <Text style={styles.footerText}>By continuing, you agree to our</Text>
        <Text style={styles.footerText}>Safety + Community guidelines.</Text>
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
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
