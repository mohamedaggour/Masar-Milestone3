import React, { useContext } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, useColorScheme
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserContext } from '../context/UserContext';
import { t } from '../utils/translations';
import { lightTheme, darkTheme } from '../theme/colors';
import {
  ArrowLeft, Train, Clock, Calendar, ChevronRight, Ticket
} from 'lucide-react-native';

function getTicketStatus(trip) {
  if (!trip.date) return 'past';
  const tripDate = new Date(trip.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tripDate.setHours(0, 0, 0, 0);
  if (tripDate.getTime() === today.getTime()) return 'active';
  if (tripDate > today) return 'upcoming';
  return 'past';
}

export default function ActiveTickets({ navigation }) {
  const { appTheme, appLanguage, recentTrips } = useContext(UserContext);
  const systemScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const tr = (key, ...args) => t(appLanguage, key, ...args);
  const isRTL = appLanguage === 'ar';
  const scheme = appTheme === 'system' ? systemScheme : appTheme;
  const T = scheme === 'dark' ? darkTheme : lightTheme;

  // Only train bookings, sorted: active → upcoming → past
  const trainTickets = recentTrips
    .filter(t => t.mode === 'Train')
    .map(trip => ({ ...trip, status: getTicketStatus(trip) }))
    .sort((a, b) => {
      const order = { active: 0, upcoming: 1, past: 2 };
      if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
      // within same status, newest first
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  const statusConfig = {
    active: { label: tr('statusActive'), bg: '#D1FAE5', color: '#059669' },
    upcoming: { label: tr('statusUpcoming'), bg: '#DBEAFE', color: '#2563EB' },
    past: { label: tr('statusPast'), bg: T.bg, color: T.subtext },
  };

  const handleViewTicket = (trip) => {
    navigation.navigate('Ticket', {
      booking: {
        id: trip.id,
        _id: trip.id,
        from: trip.from,
        to: trip.to,
        departureTime: trip.departureTime || '—',
        arrivalTime: trip.arrivalTime || '—',
        price: trip.cost,
        date: trip.date || trip.createdAt,
        route: trip.route || '—',
        duration: trip.duration,
      }
    });
  };

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
            {tr('activeTickets')}
          </Text>
          <Text style={{ color: T.subtext, fontSize: 13, textAlign: isRTL ? 'right' : 'left' }}>
            {tr('activeTicketsSubtitle')}
          </Text>
        </View>
      </View>

      {trainTickets.length === 0 ? (
        /* Empty state */
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <View style={{
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: T.primaryAlt + '15',
            justifyContent: 'center', alignItems: 'center',
            marginBottom: 20,
          }}>
            <Ticket size={36} color={T.primaryAlt} />
          </View>
          <Text style={{ color: T.text, fontWeight: '800', fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
            {tr('noActiveTickets')}
          </Text>
          <Text style={{ color: T.subtext, fontSize: 14, textAlign: 'center', lineHeight: 22 }}>
            {tr('noActiveTicketsDesc')}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs', { screen: 'Booking' })}
            style={{
              marginTop: 24,
              backgroundColor: T.primaryAlt,
              borderRadius: 14,
              paddingHorizontal: 28,
              paddingVertical: 14,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>
              {isRTL ? 'احجز تذكرة' : 'Book a Ticket'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {trainTickets.map((trip, idx) => {
            const sc = statusConfig[trip.status];
            const isPast = trip.status === 'past';

            return (
              <TouchableOpacity
                key={idx}
                onPress={() => handleViewTicket(trip)}
                activeOpacity={0.85}
                style={{
                  backgroundColor: T.card,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isPast ? T.border : (trip.status === 'active' ? '#6EE7B7' : '#BFDBFE'),
                  marginBottom: 14,
                  overflow: 'hidden',
                  opacity: isPast ? 0.75 : 1,
                }}
              >
                {/* Coloured top accent bar */}
                <View style={{
                  height: 4,
                  backgroundColor: isPast ? T.border : (trip.status === 'active' ? '#10B981' : '#3B82F6'),
                }} />

                <View style={{ padding: 16 }}>
                  {/* Status badge + date row */}
                  <View style={{
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}>
                    <View style={{
                      backgroundColor: sc.bg,
                      borderRadius: 8,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                    }}>
                      <Text style={{ color: sc.color, fontWeight: '700', fontSize: 12 }}>
                        {sc.label}
                      </Text>
                    </View>
                    {(trip.date || trip.createdAt) && (
                      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                        <Calendar size={13} color={T.subtext} style={{ marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }} />
                        <Text style={{ color: T.subtext, fontSize: 12, marginLeft: isRTL ? 0 : 4, marginRight: isRTL ? 4 : 0 }}>
                          {new Date(trip.date || trip.createdAt).toLocaleDateString(
                            isRTL ? 'ar-EG' : 'en-GB',
                            { day: 'numeric', month: 'short', year: 'numeric' }
                          )}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Route section */}
                  <View style={{
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    backgroundColor: T.bg,
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 12,
                  }}>
                    <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                      <Text style={{ color: T.subtext, fontSize: 11, marginBottom: 2, textAlign: isRTL ? 'right' : 'left' }}>
                        {isRTL ? 'من' : 'FROM'}
                      </Text>
                      <Text style={{ color: T.text, fontWeight: '800', fontSize: 16, textAlign: isRTL ? 'right' : 'left' }}>
                        {trip.from}
                      </Text>
                    </View>
                    <View style={{
                      width: 32, height: 32, borderRadius: 16,
                      backgroundColor: T.primaryAlt + '18',
                      justifyContent: 'center', alignItems: 'center',
                      marginHorizontal: 8,
                    }}>
                      <Train size={16} color={T.primaryAlt} />
                    </View>
                    <View style={{ flex: 1, alignItems: isRTL ? 'flex-start' : 'flex-end' }}>
                      <Text style={{ color: T.subtext, fontSize: 11, marginBottom: 2, textAlign: isRTL ? 'left' : 'right' }}>
                        {isRTL ? 'إلى' : 'TO'}
                      </Text>
                      <Text style={{ color: T.text, fontWeight: '800', fontSize: 16, textAlign: isRTL ? 'left' : 'right' }}>
                        {trip.to}
                      </Text>
                    </View>
                  </View>

                  {/* Times row */}
                  {trip.departureTime && (
                    <View style={{
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      gap: 16,
                      marginBottom: 12,
                    }}>
                      <View style={{ flex: 1, flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                        <Clock size={13} color={T.subtext} />
                        <Text style={{ color: T.subtext, fontSize: 13, marginLeft: isRTL ? 0 : 5, marginRight: isRTL ? 5 : 0 }}>
                          {tr('departure')}:{' '}
                          <Text style={{ color: T.text, fontWeight: '700' }}>
                            {trip.departureTime}
                          </Text>
                        </Text>
                      </View>
                      {trip.arrivalTime && (
                        <View style={{ flex: 1, flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                          <Text style={{ color: T.subtext, fontSize: 13, textAlign: isRTL ? 'right' : 'left' }}>
                            {tr('arrival')}:{' '}
                            <Text style={{ color: T.text, fontWeight: '700' }}>
                              {trip.arrivalTime}
                            </Text>
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Footer: price + view button */}
                  <View style={{
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTopWidth: 1,
                    borderTopColor: T.border,
                    paddingTop: 12,
                  }}>
                    <Text style={{ color: T.primaryAlt, fontWeight: '800', fontSize: 18 }}>
                      EGP {trip.cost}
                    </Text>
                    <View style={{
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                      alignItems: 'center',
                      backgroundColor: T.primaryAlt + '18',
                      borderRadius: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                    }}>
                      <Text style={{ color: T.primaryAlt, fontWeight: '700', fontSize: 13, marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }}>
                        {tr('viewTicket')}
                      </Text>
                      <ChevronRight size={15} color={T.primaryAlt} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
