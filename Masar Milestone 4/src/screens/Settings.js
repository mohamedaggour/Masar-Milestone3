import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, useColorScheme, TouchableOpacity, Switch, Alert } from 'react-native';
import { UserContext } from '../context/UserContext';
import { t } from '../utils/translations';
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
  MessageSquare,
  Ticket
} from 'lucide-react-native';

export default function Settings({ navigation }) {
  const systemScheme = useColorScheme();
  const { appTheme, setAppTheme, appLanguage, setAppLanguage, recentTrips, user, isLoggedIn, logout } = useContext(UserContext);
  const tr = (key, ...args) => t(appLanguage, key, ...args);
  const isRTL = appLanguage === 'ar';
  const scheme = appTheme === 'system' ? systemScheme : appTheme;
  const T = scheme === 'dark' ? darkTheme : lightTheme;
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      tr('logoutConfirmTitle'),
      tr('logoutConfirmMsg'),
      [
        { text: tr('cancel'), style: 'cancel' },
        { text: tr('logout'), style: 'destructive', onPress: logout }
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
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 22, marginBottom: 4, textAlign: isRTL ? 'right' : 'left' }}>
            {tr('settings')}
          </Text>
          <Text style={{ color: '#D1FAE5', textAlign: isRTL ? 'right' : 'left' }}>
            {tr('settingsSubtitle')}
          </Text>
        </View>

        {/* Account Section */}
        {isLoggedIn && (
          <>
            <Text style={{ color: T.text, fontWeight: '800', fontSize: 16, marginBottom: 12, marginTop: 8, textAlign: isRTL ? 'right' : 'left' }}>
              {tr('account')}
            </Text>
            <SettingItem
              icon={User}
              title={tr('profile')}
              subtitle={user?.email || tr('viewProfile')}
              onPress={() => navigation.navigate('Profile')}
            />
          </>
        )}

        {/* Travel Section */}
        <Text style={{ color: T.text, fontWeight: '800', fontSize: 16, marginBottom: 12, marginTop: 20, textAlign: isRTL ? 'right' : 'left' }}>
          {tr('travel')}
        </Text>
        <SettingItem
          icon={Ticket}
          title={tr('activeTickets')}
          subtitle={tr('activeTicketsSubtitle')}
          onPress={() => navigation.navigate('ActiveTickets')}
        />
        <SettingItem
          icon={HistoryIcon}
          title={tr('travelHistory')}
          subtitle={tr('tripsRecorded', recentTrips.length)}
          onPress={() => navigation.navigate('TravelHistory')}
        />

        {/* Preferences Section */}
        <Text style={{ color: T.text, fontWeight: '800', fontSize: 16, marginBottom: 12, marginTop: 20, textAlign: isRTL ? 'right' : 'left' }}>
          {tr('preferences')}
        </Text>
        <View style={{
          backgroundColor: T.card,
          borderWidth: 1,
          borderColor: T.border,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12
        }}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 40, height: 40, borderRadius: 20,
                backgroundColor: T.primaryAlt + '20',
                justifyContent: 'center', alignItems: 'center',
                marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0,
              }}>
                <Bell size={20} color={T.primaryAlt} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: T.text, fontWeight: '700', fontSize: 15, textAlign: isRTL ? 'right' : 'left' }}>
                  {tr('pushNotifications')}
                </Text>
                <Text style={{ color: T.subtext, fontSize: 13, textAlign: isRTL ? 'right' : 'left' }}>
                  {tr('notificationsDesc')}
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
          <View style={{ height: 1, backgroundColor: T.border, marginVertical: 12 }} />
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 40, height: 40, borderRadius: 20,
                backgroundColor: T.primaryAlt + '20',
                justifyContent: 'center', alignItems: 'center',
                marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0,
              }}>
                <MapPin size={20} color={T.primaryAlt} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: T.text, fontWeight: '700', fontSize: 15, textAlign: isRTL ? 'right' : 'left' }}>
                  {tr('locationServices')}
                </Text>
                <Text style={{ color: T.subtext, fontSize: 13, textAlign: isRTL ? 'right' : 'left' }}>
                  {tr('locationDesc')}
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
          title={tr('language')}
          subtitle={appLanguage === 'ar' ? tr('arabic') : tr('english')}
          onPress={() => {
            Alert.alert(tr('chooseLanguage'), '', [
              { text: tr('english'), onPress: () => setAppLanguage('en') },
              { text: tr('arabic'), onPress: () => setAppLanguage('ar') },
              { text: tr('cancel'), style: 'cancel' }
            ]);
          }}
        />
        <SettingItem
          icon={scheme === 'dark' ? Sun : Moon}
          title={tr('theme')}
          subtitle={appTheme === 'system' ? (systemScheme === 'dark' ? tr('systemDark') : tr('systemLight')) : (appTheme === 'dark' ? tr('darkMode') : tr('lightMode'))}
          onPress={() => {
            Alert.alert(tr('theme'), tr('chooseTheme'), [
              { text: tr('light'), onPress: () => setAppTheme('light') },
              { text: tr('dark'), onPress: () => setAppTheme('dark') },
              { text: tr('system'), onPress: () => setAppTheme('system') },
              { text: tr('cancel'), style: 'cancel' }
            ]);
          }}
        />

        {/* Payment Section */}
        <Text style={{ color: T.text, fontWeight: '800', fontSize: 16, marginBottom: 12, marginTop: 20, textAlign: isRTL ? 'right' : 'left' }}>
          {tr('payment')}
        </Text>
        <SettingItem
          icon={CreditCard}
          title={tr('paymentMethods')}
          subtitle={tr('manageCards')}
          onPress={() => Alert.alert(tr('paymentMethods'), tr('comingSoon'))}
        />

        {/* Support Section */}
        <Text style={{ color: T.text, fontWeight: '800', fontSize: 16, marginBottom: 12, marginTop: 20, textAlign: isRTL ? 'right' : 'left' }}>
          {tr('support')}
        </Text>
        <SettingItem
          icon={HelpCircle}
          title={tr('helpSupport')}
          subtitle={tr('helpDesc')}
          onPress={() => Alert.alert(tr('helpSupport'), tr('comingSoon'))}
        />
        <SettingItem
          icon={MessageSquare}
          title={tr('contactUs')}
          subtitle={tr('contactDesc')}
          onPress={() => Alert.alert(tr('contactUs'), tr('comingSoon'))}
        />
        <SettingItem
          icon={Info}
          title={tr('about')}
          subtitle={tr('appInfo')}
          onPress={() => Alert.alert(tr('about'), tr('aboutText'))}
        />

        {/* Security Section */}
        {isLoggedIn && (
          <>
            <Text style={{ color: T.text, fontWeight: '800', fontSize: 16, marginBottom: 12, marginTop: 20, textAlign: isRTL ? 'right' : 'left' }}>
              {tr('security')}
            </Text>
            <SettingItem
              icon={Shield}
              title={tr('privacySecurity')}
              subtitle={tr('privacyDesc')}
              onPress={() => Alert.alert(tr('privacySecurity'), tr('comingSoon'))}
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
              {tr('logout')}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

