import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <View style={styles.track}>
    <View style={[styles.fill, { width: `${Math.min(progress, 1) * 100}%` }]} />
  </View>
);

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
});
