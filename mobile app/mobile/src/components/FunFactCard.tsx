import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface FunFactCardProps {
  fact: string;
}

export const FunFactCard: React.FC<FunFactCardProps> = ({ fact }) => (
  <View style={styles.card}>
    <Text style={styles.label}>Fun fact</Text>
    <Text style={styles.fact}>{fact}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.accentSoft,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  fact: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
});
