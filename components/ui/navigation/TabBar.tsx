import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useThemeContext } from '../../../theme/ThemeContext';
import { Text } from '../index';

interface TabBarProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
  style?: any;
}

export default function TabBar({ activeTab, onTabPress, style }: TabBarProps) {
  const { theme } = useThemeContext();

  const tabs = [
    { name: 'dashboard', label: 'Dashboard', icon: 'home' },
    { name: 'check-in', label: 'Check-in', icon: 'checkmark-circle' },
    { name: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.backgroundMuted, borderTopColor: theme.colors.glassBorder }, style]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tab}
          onPress={() => onTabPress(tab.name)}
        >
          <Ionicons
            name={tab.icon as any}
            size={24}
            color={activeTab === tab.name ? theme.colors.primary : theme.colors.textSecondary}
          />
          <Text
            variant="caption"
            color={activeTab === tab.name ? 'primary' : 'textSecondary'}
            style={styles.tabLabel}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    borderTopWidth: 1,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
});
