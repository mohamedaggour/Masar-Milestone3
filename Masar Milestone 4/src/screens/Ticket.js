import React, { useContext } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  useColorScheme, Image, Share, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightTheme, darkTheme } from '../theme/colors';
import { UserContext } from '../context/UserContext';
import { t } from '../utils/translations';
import {
  Train, MapPin, Clock, Calendar, CheckCircle,
  Share2, ArrowLeft, ChevronRight
} from 'lucide-react-native';

export default function Ticket({ route, navigation }) {
  const { booking } = route.params;
  const insets = useSafeAreaInsets();
  const systemScheme = useColorScheme();
  const { appTheme, appLanguage } = useContext(UserContext);
  const tr = (key) => t(appLanguage, key);
  const isRTL = appLanguage === 'ar';
  const scheme = appTheme === 'system' ? systemScheme : appTheme;
  const T = scheme === 'dark' ? darkTheme : lightTheme;

  // Encode ticket data into QR code
  const qrData = [
    'MASAR-TICKET',
    booking.id || booking._id || 'N/A',
    booking.from,
    booking.to,
    booking.departureTime,
    booking.arrivalTime,
    booking.date ? new Date(booking.date).toLocaleDateString() : '',
    `EGP ${booking.price}`,
  ].join('|');

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(qrData)}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: isRTL
          ? `تذكرة مسار\nمن: ${booking.from}\nإلى: ${booking.to}\nالمغادرة: ${booking.departureTime}\nالوصول: ${booking.arrivalTime}\nالسعر: EGP ${booking.price}`
          : `Masar Ticket\nFrom: ${booking.from}\nTo: ${booking.to}\nDeparture: ${booking.departureTime}\nArrival: ${booking.arrivalTime}\nPrice: EGP ${booking.price}`,
      });
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <View style={{
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: T.border,
    }}>
      <View style={{
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: T.primaryAlt + '18',
        justifyContent: 'center', alignItems: 'center',
        marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0,
      }}>
        <Icon size={18} color={T.primaryAlt} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: T.subtext, fontSize: 12, textAlign: isRTL ? 'right' : 'left' }}>{label}</Text>
        <Text style={{ color: T.text, fontWeight: '700', fontSize: 15, textAlign: isRTL ? 'right' : 'left' }}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: insets.top + 8,
        paddingBottom: 12,
        backgroundColor: T.bg,
        borderBottomWidth: 1,
        borderBottomColor: T.border,
      }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs')}
          style={{ marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }}
        >
          <ArrowLeft size={24} color={T.text} />
        </TouchableOpacity>
        <Text style={{ color: T.text, fontWeight: '800', fontSize: 18, flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
          {isRTL ? 'تذكرتك' : 'Your Ticket'}
        </Text>
        <TouchableOpacity onPress={handleShare}>
          <Share2 size={22} color={T.primaryAlt} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

        {/* Success Banner */}
        <View style={{
          backgroundColor: '#D1FAE5',
          borderRadius: 16,
          padding: 14,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <CheckCircle size={22} color="#059669" />
          <Text style={{
            color: '#065F46', fontWeight: '700', fontSize: 15,
            marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0,
            textAlign: isRTL ? 'right' : 'left',
          }}>
            {isRTL ? 'تم الحجز بنجاح!' : 'Booking confirmed!'}
          </Text>
        </View>

        {/* Ticket Card */}
        <View style={{
          backgroundColor: T.card,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: T.border,
          overflow: 'hidden',
          marginBottom: 16,
        }}>
          {/* Card Top — Route */}
          <View style={{ backgroundColor: T.primaryAlt, padding: 20 }}>
            <View style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
                  {isRTL ? 'من' : 'FROM'}
                </Text>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 17, marginTop: 2 }}>
                  {booking.from}
                </Text>
              </View>

              <View style={{ alignItems: 'center', marginHorizontal: 8 }}>
                <ChevronRight size={28} color="rgba(255,255,255,0.6)" />
              </View>

              <View style={{ flex: 1, alignItems: isRTL ? 'flex-start' : 'flex-end' }}>
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, textAlign: isRTL ? 'left' : 'right' }}>
                  {isRTL ? 'إلى' : 'TO'}
                </Text>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 17, marginTop: 2, textAlign: isRTL ? 'left' : 'right' }}>
                  {booking.to}
                </Text>
              </View>
            </View>

            {/* Times */}
            <View style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}>
              <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>{isRTL ? 'المغادرة' : 'DEPARTURE'}</Text>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 22 }}>{booking.departureTime}</Text>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                  {booking.duration} {isRTL ? 'دقيقة' : 'min'}
                </Text>
              </View>
              <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end' }}>
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, textAlign: isRTL ? 'left' : 'right' }}>{isRTL ? 'الوصول' : 'ARRIVAL'}</Text>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 22 }}>{booking.arrivalTime}</Text>
              </View>
            </View>
          </View>

          {/* Dotted divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: -1 }}>
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: T.bg, marginLeft: -10 }} />
            <View style={{ flex: 1, borderTopWidth: 1.5, borderTopColor: T.border, borderStyle: 'dashed' }} />
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: T.bg, marginRight: -10 }} />
          </View>

          {/* Card Bottom — Details */}
          <View style={{ padding: 20 }}>
            <InfoRow
              icon={Calendar}
              label={isRTL ? 'التاريخ' : 'Date'}
              value={booking.date ? new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
            />
            <InfoRow
              icon={Train}
              label={isRTL ? 'الخط' : 'Route'}
              value={booking.route || '—'}
            />
            <View style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 12,
            }}>
              <Text style={{ color: T.subtext, fontSize: 14, textAlign: isRTL ? 'right' : 'left' }}>
                {isRTL ? 'السعر الإجمالي' : 'Total Price'}
              </Text>
              <Text style={{ color: T.primaryAlt, fontWeight: '800', fontSize: 22 }}>
                EGP {booking.price}
              </Text>
            </View>
          </View>
        </View>

        {/* QR Code Card */}
        <View style={{
          backgroundColor: T.card,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: T.border,
          padding: 24,
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Text style={{
            color: T.text, fontWeight: '800', fontSize: 16,
            marginBottom: 6, textAlign: 'center'
          }}>
            {isRTL ? 'رمز QR للتذكرة' : 'Ticket QR Code'}
          </Text>
          <Text style={{
            color: T.subtext, fontSize: 13,
            marginBottom: 20, textAlign: 'center'
          }}>
            {isRTL ? 'اعرض هذا الرمز للتحقق من تذكرتك' : 'Show this code to validate your ticket'}
          </Text>

          <View style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 4,
          }}>
            <Image
              source={{ uri: qrUrl }}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
          </View>

          <Text style={{
            color: T.subtext, fontSize: 11,
            marginTop: 14, textAlign: 'center', letterSpacing: 1
          }}>
            {(booking.id || booking._id || 'TICKET').toString().toUpperCase()}
          </Text>
        </View>

        {/* Done Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs')}
          style={{
            backgroundColor: T.primaryAlt,
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
            {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
