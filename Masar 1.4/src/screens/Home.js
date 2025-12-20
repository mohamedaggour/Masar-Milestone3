import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useColorScheme, Image } from 'react-native';
import { UserContext } from '../context/UserContext';
import { lightTheme, darkTheme } from '../theme/colors';
import { Bot } from 'lucide-react-native';
import Header from '../components/Header';

export default function Home({ navigation }) {
  const systemScheme = useColorScheme();
  const { appTheme, balance, recentTrips, setShowAddFunds, setShowScan } = useContext(UserContext);
  const scheme = appTheme === 'system' ? systemScheme : appTheme;
  const T = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Header />
      <ScrollView style={{ flex:1 }} contentContainerStyle={{ padding:16, paddingBottom:100 }}>
      <View style={{ backgroundColor:T.primaryAlt, borderRadius:24, padding:18 }}>
        <Text style={{ color:'#fff', opacity:0.9, marginBottom:4 }}>Current Balance</Text>
        <Text style={{ color:'#fff', fontWeight:'800', fontSize:36 }}>EGP {balance.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => setShowAddFunds(true)} style={{ backgroundColor:'#fff', marginTop:12, paddingVertical:12, borderRadius:999 }}>
          <Text style={{ textAlign:'center', color:T.primaryAlt, fontWeight:'800' }}>+ Add Funds</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection:'row', gap:12, marginTop:16 }}>
        <TouchableOpacity onPress={() => setShowScan(true)} style={{ flex:1, backgroundColor:T.card, borderRadius:16, padding:16, borderWidth:1, borderColor:T.border }}>
          <Text style={{ fontWeight:'700', color:T.text }}>Scan & Pay</Text>
          <Text style={{ color:T.subtext, marginTop:4 }}>Tap to start scanning</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Booking')} style={{ flex:1, backgroundColor:T.card, borderRadius:16, padding:16, borderWidth:1, borderColor:T.border }}>
          <Text style={{ fontWeight:'700', color:T.text }}>Book Train Ticket</Text>
          <Text style={{ color:T.subtext, marginTop:4 }}>Intercity train tickets</Text>
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor:T.primary, borderRadius:20, padding:16, marginTop:16 }}>
        <View style={{ flexDirection:'row', alignItems:'center', marginBottom:8 }}>
          <Bot color="#fff" size={20} />
          <Text style={{ color:'#fff', fontWeight:'800', marginLeft:8, fontSize:16 }}>Masar Assistant</Text>
        </View>
        <Text style={{ color:'#fff', opacity:0.95 }}>Get personalized route suggestions and crowd predictions.</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Chatbot')}
          style={{ backgroundColor:'#fff', paddingVertical:8, paddingHorizontal:14, borderRadius:999, alignSelf:'flex-start', marginTop:10 }}
        >
          <Text style={{ color:T.primary, fontWeight:'800' }}>Try Now</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontWeight:'800', fontSize:18, color:T.text, marginTop:18, marginBottom:10 }}>Recent Trips</Text>
      {recentTrips.slice(0,2).map((trip, idx) => (
        <View key={idx} style={{ backgroundColor:T.card, borderRadius:16, padding:14, marginBottom:10, borderWidth:1, borderColor:T.border }}>
          <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:6 }}>
            <View style={{ flex:1 }}>
              <Text style={{ color:T.text, fontWeight:'700' }}>{trip.from}</Text>
              <Text style={{ color:T.subtext }}>→ {trip.to}</Text>
            </View>
            <Text style={{ color:T.text, fontWeight:'800' }}>EGP {trip.cost}</Text>
          </View>
          <Text style={{ color:T.subtext }}>{trip.mode} • {trip.duration} • {trip.time}</Text>
        </View>
      ))}
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <Text style={{ color:T.primaryAlt, fontWeight:'800' }}>View all</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
}