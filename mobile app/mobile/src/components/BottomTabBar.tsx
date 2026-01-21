import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface BottomTabBarProps {
  activeTab: 'home';
  onHome: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onHome }) => (
  <View style={styles.container}>
    <Pressable
      style={[styles.tabButton, activeTab === 'home' && styles.tabButtonActive]}
      onPress={onHome}
    >
      <Text style={styles.tabLabel}>Home</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  tabButtonActive: {
    borderColor: colors.accent,
  },
  tabLabel: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
});
