import React, { useContext } from 'react';
import { View, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { User } from 'lucide-react-native';
import { lightTheme, darkTheme } from '../theme/colors';
import { UserContext } from '../context/UserContext';

export default function Header() {
  const { appTheme } = useContext(UserContext);
  const systemScheme = useColorScheme();
  const scheme = appTheme === 'system' ? systemScheme : appTheme;
  const T = scheme === 'dark' ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const isProfileScreen = route.name === 'Profile';
  const isHomeScreen = route.name === 'Home';

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: insets.top + 8,
      paddingBottom: 12,
      backgroundColor: T.bg,
    }}>
      <TouchableOpacity
        onPress={() => !isHomeScreen && navigation.navigate('Home')}
        disabled={isHomeScreen}
        activeOpacity={0.7}
      >
        <Image
          source={require('../../assets/icon.png')}
          style={{ width: 40, height: 40, borderRadius: 8 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => !isProfileScreen && navigation.navigate('Profile')}
        disabled={isProfileScreen}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: isProfileScreen ? T.primaryAlt : T.card,
          borderWidth: 1,
          borderColor: isProfileScreen ? T.primaryAlt : T.border,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <User size={20} color={isProfileScreen ? '#fff' : T.text} />
      </TouchableOpacity>
    </View>
  );
}

