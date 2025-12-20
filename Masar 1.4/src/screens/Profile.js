import React, { useContext } from 'react';
import { View, Text, ScrollView, useColorScheme, TouchableOpacity, Alert } from 'react-native';
import { lightTheme, darkTheme } from '../theme/colors';
import Header from '../components/Header';
import { UserContext } from '../context/UserContext';
import { User as UserIcon, Mail, Phone, Calendar, LogOut } from 'lucide-react-native';

export default function Profile() {
  const systemScheme = useColorScheme();
  const { appTheme, user, isLoggedIn, logout } = useContext(UserContext);
  const scheme = appTheme === 'system' ? systemScheme : appTheme;
  const T = scheme === 'dark' ? darkTheme : lightTheme;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Header />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {isLoggedIn && user ? (
          // User Profile Display
          <>
            <View style={{ backgroundColor: T.primaryAlt, borderRadius: 24, padding: 18, marginBottom: 24 }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: 'rgba(255,255,255,0.2)',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 12
              }}>
                <UserIcon size={40} color="#fff" />
              </View>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 24, marginBottom: 4 }}>
                {user.name}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>

            {/* User Info */}
            <Text style={{ color: T.text, fontWeight: '800', fontSize: 16, marginBottom: 12 }}>
              Personal Information
            </Text>

            {/* Email */}
            <View style={{
              backgroundColor: T.card,
              borderWidth: 1,
              borderColor: T.border,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: T.primaryAlt + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
              }}>
                <Mail size={20} color={T.primaryAlt} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: T.subtext, fontSize: 12, marginBottom: 4 }}>Email</Text>
                <Text style={{ color: T.text, fontWeight: '600', fontSize: 14 }}>{user.email}</Text>
              </View>
            </View>

            {/* Phone */}
            <View style={{
              backgroundColor: T.card,
              borderWidth: 1,
              borderColor: T.border,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: T.primaryAlt + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
              }}>
                <Phone size={20} color={T.primaryAlt} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: T.subtext, fontSize: 12, marginBottom: 4 }}>Phone</Text>
                <Text style={{ color: T.text, fontWeight: '600', fontSize: 14 }}>{user.phone}</Text>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                backgroundColor: '#FEE2E2',
                borderWidth: 1,
                borderColor: '#FCA5A5',
                borderRadius: 16,
                padding: 16,
                marginTop: 24,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text style={{ color: '#DC2626', fontWeight: '700', fontSize: 16 }}>
                Logout
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          // Not Logged In
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: T.card,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24
            }}>
              <UserIcon size={40} color={T.subtext} />
            </View>
            <Text style={{ color: T.text, fontWeight: '800', fontSize: 24, marginBottom: 12 }}>
              Not Logged In
            </Text>
            <Text style={{ color: T.subtext, textAlign: 'center', marginBottom: 24 }}>
              Please log in to view your profile
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
