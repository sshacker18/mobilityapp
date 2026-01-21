import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { BottomTabBar } from './src/components/BottomTabBar';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { BookingWizardScreen } from './src/screens/BookingWizardScreen';
import { OrderDetailsScreen } from './src/screens/OrderDetailsScreen';
import { RideTrackerScreen } from './src/screens/RideTrackerScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { BookingDetails, DriverProfile, VehicleType } from './src/types';
import { colors } from './src/theme/colors';
import { SoundSettingsProvider } from './src/context/SoundSettingsContext';

type Screen = 'login' | 'home' | 'booking' | 'order' | 'tracker' | 'settings';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Car');
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [driver, setDriver] = useState<DriverProfile | null>(null);

  const handleReset = () => {
    setBooking(null);
    setDriver(null);
    setScreen('home');
  };

  return (
    <SoundSettingsProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.content}>
          {screen === 'login' && (
            <LoginScreen
              initialName={userName}
              initialPhone={userPhone}
              onContinue={(name, phone) => {
                setUserName(name);
                setUserPhone(phone);
                setScreen('home');
              }}
            />
          )}
          {screen === 'home' && (
            <HomeScreen
              userName={userName}
              onStartBooking={(type) => {
                setVehicleType(type);
                setScreen('booking');
              }}
              onOpenSettings={() => setScreen('settings')}
            />
          )}
          {screen === 'booking' && (
            <BookingWizardScreen
              initialName={userName}
              initialPhone={userPhone}
              initialVehicle={vehicleType}
              onCancel={() => setScreen('home')}
              onComplete={(details) => {
                setBooking(details);
                setScreen('order');
              }}
            />
          )}
          {screen === 'order' && booking && (
            <OrderDetailsScreen
              booking={booking}
              onBack={() => setScreen('booking')}
              onConfirm={(selectedDriver) => {
                setDriver(selectedDriver);
                setScreen('tracker');
              }}
            />
          )}
          {screen === 'tracker' && booking && driver && (
            <RideTrackerScreen
              booking={booking}
              driver={driver}
              onBackHome={handleReset}
              onViewTrips={handleReset}
              onOpenSettings={() => setScreen('settings')}
            />
          )}
          {screen === 'settings' && (
            <SettingsScreen onBack={() => setScreen('home')} />
          )}
        </SafeAreaView>
        {screen !== 'login' && (
          <BottomTabBar activeTab="home" onHome={() => setScreen('home')} />
        )}
      </SafeAreaView>
    </SoundSettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
