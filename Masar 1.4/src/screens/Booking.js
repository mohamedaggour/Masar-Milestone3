import React, { useMemo, useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, useColorScheme, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { lightTheme, darkTheme } from '../theme/colors';
import { UserContext } from '../context/UserContext';
import Header from '../components/Header';
import { Calendar, X, Clock, Train, MapPin, ArrowRight } from 'lucide-react-native';
import { ALL_STATIONS, EGYPT_RAIL_STATIONS, CAIRO_METRO_STATIONS, calculatePrice } from '../utils/stationData';

// Calculate price based on stations (Cairo Metro pricing: 2-7 EGP)
const calculatePriceLocal = (from, to) => {
  // If both stations are intercity (national rail), use a simple intercity pricing model
  if (EGYPT_RAIL_STATIONS.includes(from) && EGYPT_RAIL_STATIONS.includes(to)) {
    const idxFrom = EGYPT_RAIL_STATIONS.indexOf(from);
    const idxTo = EGYPT_RAIL_STATIONS.indexOf(to);
    const distanceFactor = Math.abs(idxTo - idxFrom);
    // Base fare 30 EGP, +10 per step in our simplified list, cap at 300
    const price = Math.min(300, 30 + distanceFactor * 10);
    return price;
  }

  // If one is intercity and the other is metro, estimate combined fare via Ramses Station
  if (EGYPT_RAIL_STATIONS.includes(from) && CAIRO_METRO_STATIONS.includes(to)) {
    const intercityFare = calculatePrice(from, 'Ramses Station');
    const metroFare = calculatePrice('Sadat', to); // Sadat is central metro interchange (approx)
    return Math.round(intercityFare + metroFare);
  }

  if (EGYPT_RAIL_STATIONS.includes(to) && CAIRO_METRO_STATIONS.includes(from)) {
    const intercityFare = calculatePrice('Ramses Station', to);
    const metroFare = calculatePrice(from, 'Sadat');
    return Math.round(intercityFare + metroFare);
  }
  const fromLine = getStationLine(from);
  const toLine = getStationLine(to);
  
  // Handle interchange stations
  const fromLineNum = Array.isArray(fromLine) ? fromLine[0] : fromLine;
  const toLineNum = Array.isArray(toLine) ? toLine[0] : toLine;
  
  // Check if stations are on the same line
  let sameLine = false;
  if (Array.isArray(fromLine) && Array.isArray(toLine)) {
    // Both are interchange stations
    sameLine = fromLine.some(line => toLine.includes(line));
  } else if (Array.isArray(fromLine)) {
    // From is interchange
    sameLine = fromLine.includes(toLineNum);
  } else if (Array.isArray(toLine)) {
    // To is interchange
    sameLine = toLine.includes(fromLineNum);
  } else {
    // Neither is interchange
    sameLine = fromLineNum === toLineNum;
  }
  
  if (sameLine) {
    // Same line: 2-5 EGP based on distance
    let fromIndex = -1;
    let toIndex = -1;
    let lineArray = null;
    
    // Determine which line to use
    if (Array.isArray(fromLine) && Array.isArray(toLine)) {
      // Find common line
      const commonLine = fromLine.find(line => toLine.includes(line));
      if (commonLine === 1) lineArray = LINE_1_STATIONS;
      else if (commonLine === 2) lineArray = LINE_2_STATIONS;
      else if (commonLine === 3) lineArray = LINE_3_STATIONS;
    } else if (fromLineNum === toLineNum) {
      if (fromLineNum === 1) lineArray = LINE_1_STATIONS;
      else if (fromLineNum === 2) lineArray = LINE_2_STATIONS;
      else if (fromLineNum === 3) lineArray = LINE_3_STATIONS;
    }
    
    if (lineArray) {
      fromIndex = lineArray.indexOf(from);
      toIndex = lineArray.indexOf(to);
      
      if (fromIndex !== -1 && toIndex !== -1) {
        const distance = Math.abs(toIndex - fromIndex);
        if (distance <= 5) return 2;
        if (distance <= 10) return 3;
        if (distance <= 15) return 4;
        return 5;
      }
    }
    return 3; // Default for same line
  }
  
  // Different lines (transfer required): 5-7 EGP
  return 6;
};

// Calculate travel time in minutes
const calculateTravelTime = (from, to) => {
  // Intercity travel time estimate
  if (EGYPT_RAIL_STATIONS.includes(from) && EGYPT_RAIL_STATIONS.includes(to)) {
    const idxFrom = EGYPT_RAIL_STATIONS.indexOf(from);
    const idxTo = EGYPT_RAIL_STATIONS.indexOf(to);
    const distanceFactor = Math.abs(idxTo - idxFrom);
    // Base 30 minutes + ~15 minutes per step in our simplified list
    return Math.min(24 * 60, 30 + distanceFactor * 15);
  }

  const fromLine = getStationLine(from);
  const toLine = getStationLine(to);
  
  // Handle interchange stations
  const fromLineNum = Array.isArray(fromLine) ? fromLine[0] : fromLine;
  const toLineNum = Array.isArray(toLine) ? toLine[0] : toLine;
  
  // Check if stations are on the same line
  let sameLine = false;
  if (Array.isArray(fromLine) && Array.isArray(toLine)) {
    sameLine = fromLine.some(line => toLine.includes(line));
  } else if (Array.isArray(fromLine)) {
    sameLine = fromLine.includes(toLineNum);
  } else if (Array.isArray(toLine)) {
    sameLine = toLine.includes(fromLineNum);
  } else {
    sameLine = fromLineNum === toLineNum;
  }
  
  if (sameLine) {
    // Same line: ~2-3 minutes per station
    let fromIndex = -1;
    let toIndex = -1;
    let lineArray = null;
    
    // Determine which line to use
    if (Array.isArray(fromLine) && Array.isArray(toLine)) {
      const commonLine = fromLine.find(line => toLine.includes(line));
      if (commonLine === 1) lineArray = LINE_1_STATIONS;
      else if (commonLine === 2) lineArray = LINE_2_STATIONS;
      else if (commonLine === 3) lineArray = LINE_3_STATIONS;
    } else if (fromLineNum === toLineNum) {
      if (fromLineNum === 1) lineArray = LINE_1_STATIONS;
      else if (fromLineNum === 2) lineArray = LINE_2_STATIONS;
      else if (fromLineNum === 3) lineArray = LINE_3_STATIONS;
    }
    
    if (lineArray) {
      fromIndex = lineArray.indexOf(from);
      toIndex = lineArray.indexOf(to);
      
      if (fromIndex !== -1 && toIndex !== -1) {
        const distance = Math.abs(toIndex - fromIndex);
        return Math.max(5, Math.round(distance * 2.5)); // Minimum 5 minutes, ~2.5 min per station
      }
    }
    return 15; // Default
  }
  
  // Different lines: add transfer time (5-10 minutes)
  return 25;
};

// Get route information
const getRouteInfo = (from, to) => {
  const fromLine = getStationLine(from);
  const toLine = getStationLine(to);
  
  // Handle interchange stations
  const fromLineNum = Array.isArray(fromLine) ? fromLine[0] : fromLine;
  const toLineNum = Array.isArray(toLine) ? toLine[0] : toLine;
  
  // Check if stations are on the same line
  let sameLine = false;
  let commonLine = null;
  
  if (Array.isArray(fromLine) && Array.isArray(toLine)) {
    commonLine = fromLine.find(line => toLine.includes(line));
    sameLine = commonLine !== undefined;
  } else if (Array.isArray(fromLine)) {
    sameLine = fromLine.includes(toLineNum);
    if (sameLine) commonLine = toLineNum;
  } else if (Array.isArray(toLine)) {
    sameLine = toLine.includes(fromLineNum);
    if (sameLine) commonLine = fromLineNum;
  } else {
    sameLine = fromLineNum === toLineNum;
    if (sameLine) commonLine = fromLineNum;
  }
  
  if (sameLine && commonLine) {
    const lineName = commonLine === 1 ? 'Line 1 (Red)' : commonLine === 2 ? 'Line 2 (Blue)' : 'Line 3 (Orange)';
    return { line: lineName, transfer: false };
  }
  
  // Intercity route
  if (EGYPT_RAIL_STATIONS.includes(from) && EGYPT_RAIL_STATIONS.includes(to)) {
    return { line: 'Intercity Rail', transfer: false };
  }

  // Different lines - find transfer station
  let transferStation = '';
  const getLineName = (lineNum) => {
    if (Array.isArray(lineNum)) lineNum = lineNum[0];
    return lineNum === 1 ? 'Line 1 (Red)' : lineNum === 2 ? 'Line 2 (Blue)' : 'Line 3 (Orange)';
  };
  
  // Determine transfer station based on lines
  if ((fromLineNum === 1 || (Array.isArray(fromLine) && fromLine.includes(1))) && 
      (toLineNum === 2 || (Array.isArray(toLine) && toLine.includes(2)))) {
    transferStation = 'Al-Shohadaa';
  } else if ((fromLineNum === 1 || (Array.isArray(fromLine) && fromLine.includes(1))) && 
             (toLineNum === 3 || (Array.isArray(toLine) && toLine.includes(3)))) {
    transferStation = 'Nasser';
  } else if ((fromLineNum === 2 || (Array.isArray(fromLine) && fromLine.includes(2))) && 
             (toLineNum === 3 || (Array.isArray(toLine) && toLine.includes(3)))) {
    transferStation = 'Attaba';
  } else if ((fromLineNum === 2 || (Array.isArray(fromLine) && fromLine.includes(2))) && 
             (toLineNum === 1 || (Array.isArray(toLine) && toLine.includes(1)))) {
    transferStation = 'Al-Shohadaa';
  } else if ((fromLineNum === 3 || (Array.isArray(fromLine) && fromLine.includes(3))) && 
             (toLineNum === 1 || (Array.isArray(toLine) && toLine.includes(1)))) {
    transferStation = 'Nasser';
  } else if ((fromLineNum === 3 || (Array.isArray(fromLine) && fromLine.includes(3))) && 
             (toLineNum === 2 || (Array.isArray(toLine) && toLine.includes(2)))) {
    transferStation = 'Attaba';
  }
  
  return { 
    line: `${getLineName(fromLine)} → ${getLineName(toLine)}`, 
    transfer: true, 
    transferStation 
  };
};

// Generate train times throughout the day (5:30 AM to 11:30 PM)
const generateTrainTimes = () => {
  const times = [];
  const startHour = 5;
  const startMinute = 30;
  const endHour = 23;
  const endMinute = 30;
  
  let currentHour = startHour;
  let currentMinute = startMinute;
  
  while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
    // Peak hours (6-9 AM, 4-7 PM): trains every 3-5 minutes
    // Off-peak hours: trains every 5-8 minutes
    const isPeak = (currentHour >= 6 && currentHour < 9) || (currentHour >= 16 && currentHour < 19);
    const interval = isPeak ? 3 + Math.floor(Math.random() * 3) : 5 + Math.floor(Math.random() * 4);
    
    const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    times.push(timeString);
    
    currentMinute += interval;
    if (currentMinute >= 60) {
      currentMinute -= 60;
      currentHour++;
    }
  }
  
  return times;
};

// Intercity train times (less frequent) - generate departure times between 05:30 and 23:30
const generateIntercityTimes = () => {
  const times = [];
  const start = 5 * 60 + 30; // minutes from midnight
  const end = 23 * 60 + 30;

  // Intercity services: every 60-240 minutes depending on route (randomized for demo)
  let current = start;
  while (current <= end) {
    const hh = Math.floor(current / 60);
    const mm = current % 60;
    times.push(`${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`);
    // advance by 60 to 240 minutes
    const step = 60 + Math.floor(Math.random() * 181); // 60..240
    current += step;
  }

  return times;
};

export default function Booking() {
  const { appTheme } = useContext(UserContext);
  const systemScheme = useColorScheme();
  const scheme = appTheme === 'system' ? systemScheme : appTheme;
  const T = scheme === 'dark' ? darkTheme : lightTheme;
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);
  const [trainOptions, setTrainOptions] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [showTrainOptions, setShowTrainOptions] = useState(false);

  // Filter stations for "From" - exclude the selected "To" station
  // Booking is intercity-only: only use EGYPT_RAIL_STATIONS for suggestions
  const filteredFrom = useMemo(() => {
    const searchText = fromText ? fromText.toLowerCase().trim() : '';
    const filtered = EGYPT_RAIL_STATIONS.filter(
      station => 
        (!searchText || station.toLowerCase().includes(searchText)) &&
        station !== to // Don't show the selected "to" station
    );
    return filtered.slice(0, 15); // Limit to 15 suggestions
  }, [fromText, to]);

  // Filter stations for "To" - exclude the selected "From" station
  const filteredTo = useMemo(() => {
    const searchText = toText ? toText.toLowerCase().trim() : '';
    const filtered = EGYPT_RAIL_STATIONS.filter(
      station => 
        (!searchText || station.toLowerCase().includes(searchText)) &&
        station !== from // Don't show the selected "from" station
    );
    return filtered.slice(0, 15); // Limit to 15 suggestions
  }, [toText, from]);

  const handleFromSelect = (station) => {
    setFrom(station);
    setFromText(station);
    setShowFromSuggestions(false);
  };

  const handleToSelect = (station) => {
    setTo(station);
    setToText(station);
    setShowToSuggestions(false);
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDateModal(false);
      if (event.type === 'set' && date) {
        setSelectedDate(date);
      }
      // If event.type === 'dismissed', user cancelled, just close the picker
    } else {
      // iOS - date picker is in modal, update date as user scrolls
      if (date) {
        setSelectedDate(date);
      }
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSearch = () => {
    if (!from || !to) {
      alert('Please select both departure and destination stations');
      return;
    }
    if (from === to) {
      alert('Departure and destination cannot be the same');
      return;
    }
    
    // Generate train options (intercity only)
    const allTimes = generateIntercityTimes();
    const price = calculatePrice(from, to);
    const travelTime = calculateTravelTime(from, to);
    const routeInfo = getRouteInfo(from, to);
    
    // Filter times to show next 8-10 available trains
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    
    const availableTimes = allTimes.filter(time => time > currentTimeString).slice(0, 10);
    
    // If no times available today, show first trains of the day
    const timesToShow = availableTimes.length > 0 ? availableTimes : allTimes.slice(0, 10);
    
    const options = timesToShow.map((time, index) => {
      // Calculate arrival time
      const [hours, minutes] = time.split(':').map(Number);
      const departure = new Date();
      departure.setHours(hours, minutes, 0, 0);
      const arrival = new Date(departure.getTime() + travelTime * 60000);
      const arrivalTime = `${String(arrival.getHours()).padStart(2, '0')}:${String(arrival.getMinutes()).padStart(2, '0')}`;
      
      return {
        id: `train-${index}`,
        departureTime: time,
        arrivalTime: arrivalTime,
        price: price,
        duration: travelTime,
        route: routeInfo.line,
        transfer: routeInfo.transfer,
        transferStation: routeInfo.transferStation,
        available: true,
      };
    });
    
    setTrainOptions(options);
    setShowTrainOptions(true);
    setSelectedTrain(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Header />
      <ScrollView style={{ flex:1 }} contentContainerStyle={{ padding:16, paddingBottom:100 }}>
        <View style={{ backgroundColor:'#0891B2', borderRadius:24, padding:18 }}>
          <Text style={{ color:'#fff', fontWeight:'800', fontSize:22 }}>Book Your Journey</Text>
          <Text style={{ color:'#E0F2FE' }}>Fast, secure, and hassle-free booking</Text>
        </View>

        <View style={{ backgroundColor:T.card, borderWidth:1, borderColor:T.border, borderRadius:20, padding:16, marginTop:16 }}>
          <Text style={{ color:T.text, fontWeight:'700', marginBottom:8 }}>From</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              value={from || fromText}
              onChangeText={(text) => {
                setFromText(text);
                setFrom(''); // Clear selection when typing
                setShowFromSuggestions(true); // Always show suggestions when typing
              }}
              onFocus={() => {
                // Show all suggestions when focused - even if empty
                setShowFromSuggestions(true);
                // If there's a selected station, allow editing it
                if (from) {
                  setFromText(from);
                  setFrom('');
                }
              }}
              onBlur={() => {
                // Delay hiding to allow selection - longer delay for mobile
                setTimeout(() => {
                  setShowFromSuggestions(false);
                  // If a station was selected, keep it; otherwise clear text if no match
                  if (!from && fromText) {
                    // User typed but didn't select - check if it matches an intercity station
                    const match = EGYPT_RAIL_STATIONS.find(s => s.toLowerCase() === fromText.toLowerCase().trim());
                    if (match && match !== to) {
                      setFrom(match);
                      setFromText(match);
                    } else if (fromText.trim() !== '') {
                      // Clear if doesn't match
                      setFromText('');
                    }
                  }
                }, 500);
              }}
              placeholder="Select departure station"
              placeholderTextColor={T.subtext}
              style={{
                borderWidth:2,
                borderColor: from ? T.primaryAlt : T.border,
                borderRadius:14,
                padding:12,
                paddingRight: from ? 40 : 12,
                marginTop:6,
                marginBottom:12,
                color:T.text,
                backgroundColor:T.bg,
                fontSize:16
              }}
            />
            {from && (
              <TouchableOpacity
                onPress={() => {
                  setFrom('');
                  setFromText('');
                  setShowFromSuggestions(false);
                }}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 18,
                  padding: 4,
                  zIndex: 1001
                }}
              >
                <X size={20} color={T.subtext} />
              </TouchableOpacity>
            )}
            {showFromSuggestions && filteredFrom.length > 0 && (
              <View 
                style={{
                  position: 'absolute',
                  top: 50,
                  left: 0,
                  right: 0,
                  backgroundColor: T.card,
                  borderWidth: 1,
                  borderColor: T.border,
                  borderRadius: 12,
                  maxHeight: 250,
                  zIndex: 9999,
                  elevation: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                }}
                pointerEvents="box-none"
              >
                <View pointerEvents="auto">
                  <ScrollView 
                    nestedScrollEnabled 
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="none"
                    style={{ maxHeight: 250 }}
                  >
                    {filteredFrom.map((station, index) => (
                      <TouchableOpacity
                        key={station}
                        onPress={() => {
                          handleFromSelect(station);
                        }}
                        activeOpacity={0.6}
                        style={{
                          padding: 16,
                          borderBottomWidth: index < filteredFrom.length - 1 ? 1 : 0,
                          borderBottomColor: T.border,
                          backgroundColor: from === station ? T.primaryAlt + '20' : 'transparent',
                        }}
                      >
                        <Text style={{ 
                          color: from === station ? T.primaryAlt : T.text, 
                          fontSize: 16,
                          fontWeight: from === station ? '700' : '400'
                        }}>
                          {station}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}
          </View>

          <Text style={{ color:T.text, fontWeight:'700', marginBottom:8 }}>To</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              value={to || toText}
              onChangeText={(text) => {
                setToText(text);
                setTo(''); // Clear selection when typing
                setShowToSuggestions(true); // Always show suggestions when typing
              }}
              onFocus={() => {
                // Show all suggestions when focused - even if empty
                if (!to) {
                  setShowToSuggestions(true);
                }
              }}
              onBlur={() => {
                // Delay hiding to allow selection - longer delay for mobile
                setTimeout(() => {
                  setShowToSuggestions(false);
                  // If a station was selected, keep it; otherwise clear text if no match
                  if (!to && toText) {
                    // User typed but didn't select - check if it matches an intercity station
                    const match = EGYPT_RAIL_STATIONS.find(s => s.toLowerCase() === toText.toLowerCase().trim());
                    if (match && match !== from) {
                      setTo(match);
                      setToText(match);
                    } else if (toText.trim() !== '') {
                      // Clear if doesn't match
                      setToText('');
                    }
                  }
                }, 500);
              }}
              placeholder="Select destination station"
              placeholderTextColor={T.subtext}
              style={{
                borderWidth:2,
                borderColor: to ? T.primaryAlt : T.border,
                borderRadius:14,
                padding:12,
                paddingRight: to ? 40 : 12,
                marginTop:6,
                marginBottom:12,
                color:T.text,
                backgroundColor:T.bg,
                fontSize:16
              }}
            />
            {to && (
              <TouchableOpacity
                onPress={() => {
                  setTo('');
                  setToText('');
                  setShowToSuggestions(false);
                }}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 18,
                  padding: 4,
                  zIndex: 1001
                }}
              >
                <X size={20} color={T.subtext} />
              </TouchableOpacity>
            )}
            {showToSuggestions && filteredTo.length > 0 && (
              <View 
                style={{
                  position: 'absolute',
                  top: 50,
                  left: 0,
                  right: 0,
                  backgroundColor: T.card,
                  borderWidth: 1,
                  borderColor: T.border,
                  borderRadius: 12,
                  maxHeight: 250,
                  zIndex: 9999,
                  elevation: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                }}
                pointerEvents="box-none"
              >
                <View pointerEvents="auto">
                  <ScrollView 
                    nestedScrollEnabled 
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="none"
                    style={{ maxHeight: 250 }}
                  >
                    {filteredTo.map((station, index) => (
                      <TouchableOpacity
                        key={station}
                        onPress={() => {
                          handleToSelect(station);
                        }}
                        activeOpacity={0.6}
                        style={{
                          padding: 16,
                          borderBottomWidth: index < filteredTo.length - 1 ? 1 : 0,
                          borderBottomColor: T.border,
                          backgroundColor: to === station ? T.primaryAlt + '20' : 'transparent',
                        }}
                      >
                        <Text style={{ 
                          color: to === station ? T.primaryAlt : T.text, 
                          fontSize: 16,
                          fontWeight: to === station ? '700' : '400'
                        }}>
                          {station}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}
          </View>

          <Text style={{ color:T.text, fontWeight:'700', marginBottom:8 }}>Date</Text>
          <TouchableOpacity
            onPress={() => setShowDateModal(true)}
            style={{
              borderWidth:2,
              borderColor:T.border,
              borderRadius:14,
              padding:12,
              marginTop:6,
              marginBottom:12,
              backgroundColor:T.bg,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Calendar size={20} color={T.primaryAlt} />
              <Text style={{ color: selectedDate ? T.text : T.subtext, marginLeft: 10, fontSize: 16 }}>
                {selectedDate ? formatDate(selectedDate) : 'Select travel date'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSearch}
            style={{
              backgroundColor:T.primaryAlt,
              padding:14,
              borderRadius:14,
              marginTop: 8
            }}
          >
            <Text style={{ textAlign:'center', color:'#fff', fontWeight:'800', fontSize:16 }}>Search Trains</Text>
          </TouchableOpacity>
        </View>

        {/* Train Options */}
        {showTrainOptions && trainOptions.length > 0 && from && to && (
          <View style={{ marginTop: 24 }}>
            <View style={{ 
              backgroundColor: T.primaryAlt, 
              borderRadius: 20, 
              padding: 18, 
              marginBottom: 16 
            }}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 20, marginBottom: 8 }}>
                Available Trains
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <MapPin size={16} color="#E0F2FE" />
                <Text style={{ color: '#E0F2FE', marginLeft: 6, fontSize: 14 }}>
                  {from} → {to}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Train size={16} color="#E0F2FE" />
                <Text style={{ color: '#E0F2FE', marginLeft: 6, fontSize: 14 }}>
                  {trainOptions[0].route}
                  {trainOptions[0].transfer && ` • Transfer at ${trainOptions[0].transferStation}`}
                </Text>
              </View>
            </View>

            {trainOptions.map((train, index) => (
              <TouchableOpacity
                key={train.id}
                onPress={() => {
                  setSelectedTrain(train.id);
                  // Here you would navigate to booking confirmation or add to cart
                  alert(`Selected train departing at ${train.departureTime}\nPrice: EGP ${train.price}\nDuration: ${train.duration} minutes`);
                }}
                style={{
                  backgroundColor: T.card,
                  borderWidth: 2,
                  borderColor: selectedTrain === train.id ? T.primaryAlt : T.border,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Clock size={18} color={T.primaryAlt} />
                      <Text style={{ 
                        color: T.text, 
                        fontWeight: '800', 
                        fontSize: 18, 
                        marginLeft: 8 
                      }}>
                        {train.departureTime}
                      </Text>
                      <ArrowRight size={16} color={T.subtext} style={{ marginHorizontal: 8 }} />
                      <Text style={{ 
                        color: T.text, 
                        fontWeight: '700', 
                        fontSize: 16 
                      }}>
                        {train.arrivalTime}
                      </Text>
                    </View>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Train size={14} color={T.subtext} />
                      <Text style={{ color: T.subtext, fontSize: 13, marginLeft: 6 }}>
                        {train.route}
                      </Text>
                    </View>
                    
                    {train.transfer && (
                      <View style={{ 
                        backgroundColor: T.primaryAlt + '20', 
                        paddingHorizontal: 8, 
                        paddingVertical: 4, 
                        borderRadius: 8, 
                        alignSelf: 'flex-start',
                        marginTop: 4
                      }}>
                        <Text style={{ color: T.primaryAlt, fontSize: 12, fontWeight: '600' }}>
                          Transfer at {train.transferStation}
                        </Text>
                      </View>
                    )}
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                      <Text style={{ color: T.subtext, fontSize: 13 }}>
                        Duration: {train.duration} min
                      </Text>
                    </View>
                  </View>
                  
                  <View style={{ 
                    backgroundColor: selectedTrain === train.id ? T.primaryAlt : T.bg, 
                    borderRadius: 12, 
                    padding: 12,
                    minWidth: 80,
                    alignItems: 'center'
                  }}>
                    <Text style={{ 
                      color: selectedTrain === train.id ? '#fff' : T.text, 
                      fontSize: 12, 
                      marginBottom: 2 
                    }}>
                      Price
                    </Text>
                    <Text style={{ 
                      color: selectedTrain === train.id ? '#fff' : T.primaryAlt, 
                      fontWeight: '800', 
                      fontSize: 20 
                    }}>
                      EGP {train.price}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ backgroundColor:T.card, borderWidth:1, borderColor:T.border, borderRadius:20, padding:16, marginTop:16 }}>
          <Text style={{ color:T.text, fontWeight:'800', marginBottom:10 }}>Popular Routes</Text>
          {[
            { from: 'Cairo (Ramses Station)', to: 'Alexandria (Sidi Gaber)' },
            { from: 'Cairo (Ramses Station)', to: 'Luxor' },
            { from: 'Luxor', to: 'Aswan' }
          ].map((route, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                handleFromSelect(route.from);
                handleToSelect(route.to);
                setShowTrainOptions(false);
              }}
              style={{
                paddingVertical:12,
                borderBottomWidth: idx < 2 ? 1 : 0,
                borderBottomColor: T.border
              }}
            >
              <Text style={{ color:T.text }}>{route.from} → {route.to}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ backgroundColor:'#FFFBEB', borderWidth:1, borderColor:'#FDE68A', borderRadius:16, padding:14, marginTop:16 }}>
          <Text style={{ color:'#92400E', fontWeight:'700' }}>AI Recommendation</Text>
          <Text style={{ color:'#92400E' }}>Book morning trains (6–9 AM) for less crowded compartments. Prices are fixed per route.</Text>
        </View>
      </ScrollView>

      {/* Date Picker Modal for iOS */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showDateModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDateModal(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end'
          }}>
            <View style={{
              backgroundColor: T.card,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: '50%'
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20
              }}>
                <Text style={{ color: T.text, fontWeight: '800', fontSize: 20 }}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowDateModal(false)}>
                  <X size={24} color={T.text} />
                </TouchableOpacity>
              </View>
              
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={new Date()}
                style={{ backgroundColor: T.bg }}
              />
              
              <TouchableOpacity
                onPress={() => setShowDateModal(false)}
                style={{
                  backgroundColor: T.primaryAlt,
                  padding: 14,
                  borderRadius: 14,
                  marginTop: 20
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '800', textAlign: 'center' }}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      
      {/* Date Picker for Android (native) */}
      {Platform.OS === 'android' && showDateModal && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
}
