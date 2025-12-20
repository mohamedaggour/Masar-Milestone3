import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, useColorScheme, TouchableOpacity, Switch, Alert } from 'react-native';
import { UserContext } from '../context/UserContext';
import { lightTheme, darkTheme } from '../theme/colors';
import Header from '../components/Header';
import { 
  History as HistoryIcon, 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  CreditCard, 
  Shield, 
  HelpCircle, 
  Info,
  ChevronRight,
  User,
  MapPin,
  MessageSquare
} from 'lucide-react-native';

export default function Settings({ navigation }) {
  const systemScheme = useColorScheme();
  const { appTheme, setAppTheme, recentTrips, user, isLoggedIn, logout } = useContext(UserContext);
  const scheme = appTheme === 'system' ? systemScheme : appTheme;
  const T = scheme === 'dark' ? darkTheme : lightTheme;
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

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

  const SettingItem = ({ icon: Icon, title, subtitle, onPress, rightComponent, showArrow = true }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: T.card,
        borderWidth: 1,
        borderColor: T.border,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12
      }}
    >
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: T.primaryAlt + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
      }}>
        <Icon size={20} color={T.primaryAlt} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: T.text, fontWeight: '700', fontSize: 15, marginBottom: 2 }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ color: T.subtext, fontSize: 13 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent}
      {showArrow && !rightComponent && (
        <ChevronRight size={20} color={T.subtext} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Header />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Header */}
        <View style={{ backgroundColor: T.primaryAlt, borderRadius: 24, padding: 18, marginBottom: 24 }}>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 22, marginBottom: 4 }}>
            Settings
          </Text>
          <Text style={{ color: '#D1FAE5' }}>
            Manage your app preferences
          </Text>
        </View>

        {/* Account Section */}
        {isLoggedIn && (
          <>
            <Text style={{ color: T.text, fontWeight: '800', fontSize: 16, marginBottom: 12, marginTop: 8 }}>
              Account
            </Text>
            <SettingItem
              icon={User}
              title="Profile"
              subtitle={user?.email || 'View your profile'}
              onPress={() => navigation.navigate('Profile')}
            />
          </>
        )}

        {/* Travel Section */}
        <Text style={{ color: T.text, fontWeight: '800', fontSize: 16, marginBottom: 12, marginTop: 20 }}>
          Travel
        </Text>
        <SettingItem
          icon={HistoryIcon}
          title="Travel History"
          subtitle={`${recentTrips.length} trips recorded`}
          onPress={() => {
            // Show history inline or navigate
            Alert.alert('Travel History', `You have ${recentTrips.length} trips in your history.`);
          }}
        />
        <View style={{
          backgroundColor: T.card,
          borderWidth: 1,
          borderColor: T.border,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: T.primaryAlt + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12
            }}>
              <HistoryIcon size={20} color={T.primaryAlt} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: T.text, fontWeight: '700', fontSize: 15, marginBottom: 2 }}>
                Recent Trips
              </Text>
              <Text style={{ color: T.subtext, fontSize: 13 }}>
                View your travel history
              </Text>
            </View>
          </View>
          {recentTrips.length > 0 ? (
            <View style={{ marginTop: 8 }}>
              {recentTrips.slice(0, 3).map((trip, idx) => (
                <View key={idx} style={{
                  backgroundColor: T.bg,
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: T.border
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: T.text, fontWeight: '700', fontSize: 14 }}>
                        {trip.from}
                      </Text>
                      <Text style={{ color: T.subtext, fontSize: 12 }}>
                        → {trip.to}
                      </Text>
                    </View>
                    <Text style={{ color: T.text, fontWeight: '800', fontSize: 14 }}>
                      EGP {trip.cost}
                    </Text>
                  </View>
                  <Text style={{ color: T.subtext, fontSize: 11 }}>
                    {trip.mode} • {trip.duration} • {trip.time}
                  </Text>
                </View>
              ))}
              {recentTrips.length > 3 && (
                <TouchableOpacity
                  onPress={() => Alert.alert('All Trips', `You have ${recentTrips.length} total trips.`)}
                  style={{ marginTop: 8 }}
                >
                  <Text style={{ color: T.primaryAlt, fontWeight: '700', textAlign: 'center', fontSize: 13 }}>
                    View All {recentTrips.length} Trips
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <Text style={{ color: T.subtext, fontSize: 13, textAlign: 'center', paddingVertical: 12 }}>
              No trips yet
            </Text>
          )}
        </View>

        {/* Preferences Section */}
        <Text style={{ color: T.text, fontWeight: '800', fontSize: 16, marginBottom: 12, marginTop: 20 }}>
          Preferences
        </Text>
        <View style={{
          backgroundColor: T.card,
          borderWidth: 1,
          borderColor: T.border,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: T.primaryAlt + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
              }}>
                <Bell size={20} color={T.primaryAlt} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: T.text, fontWeight: '700', fontSize: 15 }}>
                  Push Notifications
                </Text>
                <Text style={{ color: T.subtext, fontSize: 13 }}>
                  Get alerts for trips and updates
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: T.border, true: T.primaryAlt + '80' }}
              thumbColor={notificationsEnabled ? T.primaryAlt : T.subtext}
            />
          </View>
          <View style={{ 
            height: 1, 
            backgroundColor: T.border, 
            marginVertical: 12 
          }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: T.primaryAlt + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
              }}>
                <MapPin size={20} color={T.primaryAlt} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: T.text, fontWeight: '700', fontSize: 15 }}>
                  Location Services
                </Text>
                <Text style={{ color: T.subtext, fontSize: 13 }}>
                  Allow location access for better routes
                </Text>
              </View>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: T.border, true: T.primaryAlt + '80' }}
              thumbColor={locationEnabled ? T.primaryAlt : T.subtext}
            />
          </View>
        </View>
        <SettingItem
          icon={Globe}
          title="Language"
          subtitle="English"
          onPress={() => Alert.alert('Language', 'Language settings coming soon!')}
        />
        <SettingItem
          icon={scheme === 'dark' ? Sun : Moon}
          title="Theme"
          subtitle={appTheme === 'system' ? (systemScheme === 'dark' ? 'System (Dark)' : 'System (Light)') : (appTheme === 'dark' ? 'Dark Mode' : 'Light Mode')}
          onPress={() => {
            Alert.alert('Theme', 'Choose a theme', [
              { text: 'Light', onPress: () => setAppTheme('light') },
              { text: 'Dark', onPress: () => setAppTheme('dark') },
              { text: 'System', onPress: () => setAppTheme('system') },
              { text: 'Cancel', style: 'cancel' }
            ]);
          }}
        />

        {/* Payment Section */}
        <Text style={{ color: T.text, fontWeight: '800', fontSize: 16, marginBottom: 12, marginTop: 20 }}>
          Payment
        </Text>
        <SettingItem
          icon={CreditCard}
          title="Payment Methods"
          subtitle="Manage your cards"
          onPress={() => Alert.alert('Payment Methods', 'Payment settings coming soon!')}
        />

        {/* Support Section */}
        <Text style={{ color: T.text, fontWeight: '800', fontSize: 16, marginBottom: 12, marginTop: 20 }}>
          Support
        </Text>
        <SettingItem
          icon={HelpCircle}
          title="Help & Support"
          subtitle="Get help with the app"
          onPress={() => Alert.alert('Help', 'Help center coming soon!')}
        />
        <SettingItem
          icon={MessageSquare}
          title="Contact Us"
          subtitle="Send us feedback"
          onPress={() => Alert.alert('Contact', 'Contact form coming soon!')}
        />
        <SettingItem
          icon={Info}
          title="About"
          subtitle="App version and info"
          onPress={() => Alert.alert('About Masar', 'Masar - Your Metro Travel Companion\nVersion 1.0.0')}
        />

        {/* Security Section */}
        {isLoggedIn && (
          <>
            <Text style={{ color: T.text, fontWeight: '800', fontSize: 16, marginBottom: 12, marginTop: 20 }}>
              Security
            </Text>
            <SettingItem
              icon={Shield}
              title="Privacy & Security"
              subtitle="Manage your privacy settings"
              onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon!')}
            />
          </>
        )}

        {/* Logout Button */}
        {isLoggedIn && (
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
        )}
      </ScrollView>
    </View>
  );
}

