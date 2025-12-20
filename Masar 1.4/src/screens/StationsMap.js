import React, { useContext } from 'react';
import { View, useColorScheme } from 'react-native';
import StationsMapView from '../components/StationsMapView';
import Header from '../components/Header';
import { lightTheme, darkTheme } from '../theme/colors';
import { UserContext } from '../context/UserContext';

export default function StationsMap() {
  const { appTheme } = useContext(UserContext);
  const systemScheme = useColorScheme();
  const scheme = appTheme === 'system' ? systemScheme : appTheme;
  const T = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Header />
      <StationsMapView />
    </View>
  );
}
