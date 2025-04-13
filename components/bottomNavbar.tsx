import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type NavbarProps = {
  activeTab: string;
  onChangeTab: (tabName: string) => void;
};

const BottomNavbar = ({ activeTab, onChangeTab }: NavbarProps) => {
  const tabs = [
    { name: 'Home', icon: 'home' },
    { name: 'Explore', icon: 'compass' },
    { name: 'Profile', icon: 'user' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tabButton}
          onPress={() => onChangeTab(tab.name)}
          activeOpacity={0.7}
        >
          <View style={styles.tabContent}>
            <Feather
              name={tab.icon as any}
              size={22}
              color={activeTab === tab.name ? '#000000' : '#8e8e93'}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.name ? '#000000' : '#8e8e93' }
              ]}
            >
              {tab.name}
            </Text>
            {activeTab === tab.name && <View style={styles.activeIndicator} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 3,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Gabarito-Regular',
  },
  activeIndicator: {
    position: 'absolute',
    top: -5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3498db',
  }
});

export default BottomNavbar;