import React, { useContext } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, useColorScheme
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserContext } from '../context/UserContext';
import { t } from '../utils/translations';
import { lightTheme, darkTheme } from '../theme/colors';
import { ArrowLeft, Train, Zap, Clock, MapPin, Calendar } from 'lucide-react-native';

export default function TravelHistory({ navigation }) {
  const { appTheme, appLanguage, recentTrips } = useContext(UserContext);
  const systemScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const tr = (key, ...args) => t(appLanguage, key, ...args);
  const isRTL = appLanguage === 'ar';
  const scheme = appTheme === 'system' ? systemScheme : appTheme;
  const T = scheme === 'dark' ? darkTheme : lightTheme;

  // Group trips by date
  const grouped = recentTrips.reduce((acc, trip) => {
    const dateStr = trip.createdAt
      ? new Date(trip.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-GB', { weekday: 'long', month: 'long', day: 'numeric' })
      : trip.time?.split(',')[0] || (isRTL ? 'اليوم' : 'Today');
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(trip);
    return acc;
  }, {});

  const dateGroups = Object.entries(grouped);

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: insets.top + 8,
        paddingBottom: 14,
        backgroundColor: T.bg,
        borderBottomWidth: 1,
        borderBottomColor: T.border,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginRight: isRTL ? 0 : 12,
            marginLeft: isRTL ? 12 : 0,
            width: 38, height: 38,
            borderRadius: 19,
            backgroundColor: T.card,
            borderWidth: 1,
            borderColor: T.border,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ArrowLeft size={20} color={T.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: T.text, fontWeight: '800', fontSize: 18, textAlign: isRTL ? 'right' : 'left' }}>
            {tr('travelHistoryPageTitle')}
          </Text>
          {recentTrips.length > 0 && (
            <Text style={{ color: T.subtext, fontSize: 13, textAlign: isRTL ? 'right' : 'left' }}>
              {tr('allTripsCount', recentTrips.length)}
            </Text>
          )}
        </View>
      </View>

      {recentTrips.length === 0 ? (
        /* Empty state */
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <View style={{
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: T.primaryAlt + '15',
            justifyContent: 'center', alignItems: 'center',
            marginBottom: 20,
          }}>
            <Clock size={36} color={T.primaryAlt} />
          </View>
          <Text style={{ color: T.text, fontWeight: '800', fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
            {tr('historyEmpty')}
          </Text>
          <Text style={{ color: T.subtext, fontSize: 14, textAlign: 'center', lineHeight: 22 }}>
            {tr('historyEmptyDesc')}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {dateGroups.map(([dateLabel, trips]) => (
            <View key={dateLabel} style={{ marginBottom: 8 }}>
              {/* Date group header */}
              <Text style={{
                color: T.subtext,
                fontSize: 12,
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 10,
                marginTop: 8,
                textAlign: isRTL ? 'right' : 'left',
              }}>
                {dateLabel}
              </Text>

              {trips.map((trip, idx) => {
                const isTrain = trip.mode === 'Train';
                const IconComp = isTrain ? Train : Zap;
                const accentColor = isTrain ? T.primaryAlt : '#D97706';
                const badgeBg = isTrain ? T.primaryAlt + '18' : '#FEF3C7';

                return (
                  <View key={idx} style={{
                    backgroundColor: T.card,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: T.border,
                    padding: 16,
                    marginBottom: 10,
                  }}>
                    {/* Top row: badge + price */}
                    <View style={{
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}>
                      <View style={{
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        backgroundColor: badgeBg,
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        gap: 6,
                      }}>
                        <IconComp size={14} color={accentColor} />
                        <Text style={{ color: accentColor, fontWeight: '700', fontSize: 12, marginLeft: isRTL ? 0 : 4, marginRight: isRTL ? 4 : 0 }}>
                          {isTrain ? tr('trainTrip') : tr('scanTrip')}
                        </Text>
                      </View>
                      <Text style={{ color: accentColor, fontWeight: '800', fontSize: 17 }}>
                        EGP {trip.cost}
                      </Text>
                    </View>

                    {/* Route */}
                    <View style={{
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: T.text, fontWeight: '700', fontSize: 15, textAlign: isRTL ? 'right' : 'left' }}>
                          {trip.from}
                        </Text>
                      </View>
                      <View style={{
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        backgroundColor: T.bg,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: T.border,
                        marginHorizontal: 8,
                      }}>
                        <Text style={{ color: T.subtext, fontSize: 13 }}>
                          {isRTL ? '←' : '→'}
                        </Text>
                      </View>
                      <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={{ color: T.text, fontWeight: '700', fontSize: 15, textAlign: isRTL ? 'left' : 'right' }}>
                          {trip.to}
                        </Text>
                      </View>
                    </View>

                    {/* Times row (only for train) */}
                    {isTrain && trip.departureTime && (
                      <View style={{
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        gap: 16,
                        marginBottom: 8,
                      }}>
                        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                          <Clock size={13} color={T.subtext} style={{ marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }} />
                          <Text style={{ color: T.subtext, fontSize: 13, marginLeft: isRTL ? 0 : 4, marginRight: isRTL ? 4 : 0 }}>
                            {tr('departure')}: <Text style={{ color: T.text, fontWeight: '600' }}>{trip.departureTime}</Text>
                          </Text>
                        </View>
                        {trip.arrivalTime && (
                          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                            <Text style={{ color: T.subtext, fontSize: 13 }}>
                              {tr('arrival')}: <Text style={{ color: T.text, fontWeight: '600' }}>{trip.arrivalTime}</Text>
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    {/* Bottom meta row */}
                    <View style={{
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <Text style={{ color: T.subtext, fontSize: 12 }}>
                        {trip.duration && trip.duration !== '0 min' ? `${trip.duration}` : ''}
                      </Text>
                      <Text style={{ color: T.subtext, fontSize: 12 }}>
                        {trip.time?.split(',')[1]?.trim() || trip.time || ''}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
