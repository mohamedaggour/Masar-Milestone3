import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useColorScheme, Linking, Platform } from 'react-native';
import { lightTheme, darkTheme } from '../theme/colors';
import { UserContext } from '../context/UserContext';
import { MapPin, Navigation } from 'lucide-react-native';

// Cairo Metro Stations with GPS Coordinates (Latitude, Longitude)
const CAIRO_METRO_STATIONS_WITH_COORDS = {
  // Line 1 (Red Line) - Helwan to New El-Marg
  'Helwan': { lat: 29.8456, lng: 31.3345, line: 1, area: 'Helwan' },
  'Ain Helwan': { lat: 29.8523, lng: 31.3412, line: 1, area: 'Helwan' },
  'Helwan University': { lat: 29.8589, lng: 31.3478, line: 1, area: 'Helwan' },
  'Wadi Hof': { lat: 29.8645, lng: 31.3534, line: 1, area: 'Helwan' },
  'Hadayek Helwan': { lat: 29.8702, lng: 31.3601, line: 1, area: 'Helwan' },
  'El-Maasara': { lat: 29.8756, lng: 31.3667, line: 1, area: 'Maasara' },
  'Tora El-Asmant': { lat: 29.8823, lng: 31.3734, line: 1, area: 'Tora' },
  'Kozzika': { lat: 29.8889, lng: 31.3789, line: 1, area: 'Tora' },
  'Tora El-Balad': { lat: 29.8945, lng: 31.3845, line: 1, area: 'Tora' },
  'Sakanat El-Maadi': { lat: 29.9001, lng: 31.3901, line: 1, area: 'Maadi' },
  'Maadi': { lat: 29.9067, lng: 31.3967, line: 1, area: 'Maadi' },
  'Hadayek El-Maadi': { lat: 29.9123, lng: 31.4034, line: 1, area: 'Maadi' },
  'Dar El-Salam': { lat: 29.9189, lng: 31.4089, line: 1, area: 'Dar El-Salam' },
  'El-Zahraa': { lat: 29.9234, lng: 31.4145, line: 1, area: 'Zamalek' },
  'Mar Girgis': { lat: 29.9301, lng: 31.4201, line: 1, area: 'Coptic Cairo' },
  'El-Malek El-Saleh': { lat: 29.9356, lng: 31.4256, line: 1, area: 'Islamic Cairo' },
  'Al-Sayeda Zeinab': { lat: 29.9401, lng: 31.4301, line: 1, area: 'Islamic Cairo' },
  'Saad Zaghloul': { lat: 29.9456, lng: 31.4345, line: 1, area: 'Downtown Cairo' },
  'Nasser': { lat: 29.9501, lng: 31.4389, line: [1, 3], area: 'Downtown Cairo' },
  'Orabi': { lat: 29.9545, lng: 31.4423, line: 1, area: 'Downtown Cairo' },
  'Al-Shohadaa': { lat: 29.9589, lng: 31.4467, line: [1, 2], area: 'Downtown Cairo' },
  'Ghamra': { lat: 29.9634, lng: 31.4512, line: 1, area: 'Downtown Cairo' },
  'El-Demerdash': { lat: 29.9689, lng: 31.4567, line: 1, area: 'Abbassia' },
  'Manshiet El-Sadr': { lat: 29.9734, lng: 31.4623, line: 1, area: 'Abbassia' },
  'Kobri El-Qobba': { lat: 29.9789, lng: 31.4678, line: 1, area: 'Qobba' },
  'Hammamat El-Qobba': { lat: 29.9834, lng: 31.4734, line: 1, area: 'Qobba' },
  'Saray El-Qobba': { lat: 29.9878, lng: 31.4789, line: 1, area: 'Qobba' },
  'Hadayeq El-Zaitoun': { lat: 29.9923, lng: 31.4834, line: 1, area: 'Zaytoun' },
  'Helmeyet El-Zaitoun': { lat: 29.9967, lng: 31.4889, line: 1, area: 'Zaytoun' },
  'El-Matareyya': { lat: 30.0012, lng: 31.4945, line: 1, area: 'Matareyya' },
  'Ain Shams': { lat: 30.0056, lng: 31.5001, line: 1, area: 'Ain Shams' },
  'Ezbet El-Nakhl': { lat: 30.0101, lng: 31.5056, line: 1, area: 'Ain Shams' },
  'El-Marg': { lat: 30.0156, lng: 31.5112, line: 1, area: 'El-Marg' },
  'New El-Marg': { lat: 30.0212, lng: 31.5167, line: 1, area: 'El-Marg' },

  // Line 2 (Blue Line) - Shubra El Kheima to El Monib
  'Shubra El Kheima': { lat: 30.1234, lng: 31.2567, line: 2, area: 'Shubra' },
  'Kolleyyet El-Zeraa': { lat: 30.1123, lng: 31.2678, line: 2, area: 'Abbasia' },
  'Mezallat': { lat: 30.1034, lng: 31.2756, line: 2, area: 'Abbasia' },
  'Khalafawy': { lat: 30.0945, lng: 31.2834, line: 2, area: 'Abbasia' },
  'St. Teresa': { lat: 30.0856, lng: 31.2901, line: 2, area: 'Downtown' },
  'Rod El Farag': { lat: 30.0734, lng: 31.3001, line: [2, 3], area: 'Downtown' },
  'Massara': { lat: 30.0645, lng: 31.3078, line: 2, area: 'Downtown' },
  'Attaba': { lat: 30.0534, lng: 31.3156, line: [2, 3], area: 'Downtown' },
  'Mohamed Naguib': { lat: 30.0423, lng: 31.3234, line: 2, area: 'Downtown' },
  'Sadat': { lat: 30.0334, lng: 31.3301, line: 2, area: 'Downtown' },
  'Opera': { lat: 30.0245, lng: 31.3367, line: 2, area: 'Downtown' },
  'Dokki': { lat: 30.0134, lng: 31.3456, line: 2, area: 'Giza' },
  'El Bohooth': { lat: 30.0045, lng: 31.3534, line: 2, area: 'Giza' },
  'Cairo University': { lat: 29.9956, lng: 31.3612, line: 2, area: 'Giza' },
  'Faisal': { lat: 29.9867, lng: 31.3689, line: 2, area: 'Giza' },
  'Giza': { lat: 29.9778, lng: 31.3767, line: 2, area: 'Giza' },
  'Omm El Misryeen': { lat: 29.9689, lng: 31.3834, line: 2, area: 'Giza' },
  'Sakiat Mekki': { lat: 29.9601, lng: 31.3901, line: 2, area: 'Giza' },
  'El Monib': { lat: 29.9512, lng: 31.3978, line: 2, area: 'Giza' },

  // Line 3 (Orange Line) - Adly Mansour to Rod El Farag
  'Adly Mansour': { lat: 30.1567, lng: 31.4234, line: 3, area: 'Nasr City' },
  'El Haykestep': { lat: 30.1456, lng: 31.4123, line: 3, area: 'Nasr City' },
  'Omar Ibn El-Khattab': { lat: 30.1345, lng: 31.4012, line: 3, area: 'Nasr City' },
  'Qubbah': { lat: 30.1234, lng: 31.3901, line: 3, area: 'Nasr City' },
  'Hesham Barakat': { lat: 30.1123, lng: 31.3789, line: 3, area: 'Nasr City' },
  'El Nozha': { lat: 30.1012, lng: 31.3678, line: 3, area: 'Nasr City' },
  'Nadi El Shams': { lat: 30.0901, lng: 31.3567, line: 3, area: 'Heliopolis' },
  'Alf Maskan': { lat: 30.0789, lng: 31.3456, line: 3, area: 'Heliopolis' },
  'Heliopolis Square': { lat: 30.0678, lng: 31.3345, line: 3, area: 'Heliopolis' },
  'Haroun': { lat: 30.0567, lng: 31.3234, line: 3, area: 'Heliopolis' },
  'Al-Ahram': { lat: 30.0456, lng: 31.3123, line: 3, area: 'Heliopolis' },
  'Koleyet El Banat': { lat: 30.0345, lng: 31.3012, line: 3, area: 'Ain Shams' },
  'Stadium': { lat: 30.0234, lng: 31.2901, line: 3, area: 'Abbasia' },
  'Fair Zone': { lat: 30.0123, lng: 31.2789, line: 3, area: 'Abbasia' },
  'Abbassia': { lat: 29.9945, lng: 31.2678, line: 3, area: 'Abbasia' },
  'Abdou Pasha': { lat: 29.9834, lng: 31.2567, line: 3, area: 'Abbasia' },
  'El Geish': { lat: 29.9723, lng: 31.2456, line: 3, area: 'Downtown' },
  'Bab El Shaaria': { lat: 29.9612, lng: 31.2345, line: 3, area: 'Downtown' },
  'Maspero': { lat: 29.9456, lng: 31.2234, line: 3, area: 'Downtown' },
  'Zamalek': { lat: 29.9345, lng: 31.2123, line: 3, area: 'Zamalek' },
  'Kit Kat': { lat: 29.9234, lng: 31.2012, line: 3, area: 'Zamalek' },
  'Sudan': { lat: 29.9123, lng: 31.1901, line: 3, area: 'Zamalek' },
  'Imbaba': { lat: 29.9012, lng: 31.1789, line: 3, area: 'Imbaba' },
  'Wadi El Nile': { lat: 29.8901, lng: 31.1678, line: 3, area: 'Imbaba' },
  'Ring Road': { lat: 29.8789, lng: 31.1567, line: 3, area: 'Imbaba' },
};

// Major Egyptian National Rail (intercity) stations with approximate coordinates
const EGYPT_RAIL_STATIONS_WITH_COORDS = {
  'Ramses Station': { lat: 30.0597, lng: 31.2497, line: 'rail', area: 'Cairo' },
  'Alexandria (Sidi Gaber)': { lat: 31.2001, lng: 29.9158, line: 'rail', area: 'Alexandria' },
  'Giza Station': { lat: 30.0131, lng: 31.2089, line: 'rail', area: 'Giza' },
  'Tanta': { lat: 30.7865, lng: 31.0004, line: 'rail', area: 'Tanta' },
  'Mansoura': { lat: 31.0414, lng: 31.3785, line: 'rail', area: 'Mansoura' },
  'Zagazig': { lat: 30.5878, lng: 31.5020, line: 'rail', area: 'Zagazig' },
  'Damanhour': { lat: 31.0369, lng: 30.4680, line: 'rail', area: 'Damanhour' },
  'Kafr El-Sheikh': { lat: 31.1110, lng: 30.9383, line: 'rail', area: 'Kafr El-Sheikh' },
  'Sohag': { lat: 26.5569, lng: 31.6940, line: 'rail', area: 'Sohag' },
  'Qena': { lat: 26.1642, lng: 32.7168, line: 'rail', area: 'Qena' },
  'Luxor': { lat: 25.6872, lng: 32.6396, line: 'rail', area: 'Luxor' },
  'Aswan': { lat: 24.0889, lng: 32.8998, line: 'rail', area: 'Aswan' },
  'Beni Suef': { lat: 29.0640, lng: 31.0965, line: 'rail', area: 'Beni Suef' },
  'Minya': { lat: 28.1094, lng: 30.7506, line: 'rail', area: 'Minya' },
  'Fayoum': { lat: 29.3083, lng: 30.8418, line: 'rail', area: 'Fayoum' },
  'Ismailia': { lat: 30.5878, lng: 32.2715, line: 'rail', area: 'Ismailia' },
  'Port Said': { lat: 31.2653, lng: 32.3019, line: 'rail', area: 'Port Said' },
  'Suez': { lat: 29.9668, lng: 32.5498, line: 'rail', area: 'Suez' },
  'Damietta': { lat: 31.4160, lng: 31.8136, line: 'rail', area: 'Damietta' },
  'Mersa Matruh': { lat: 31.3547, lng: 27.2373, line: 'rail', area: 'Mersa Matruh' },
  'Arish': { lat: 31.1328, lng: 33.7982, line: 'rail', area: 'Arish' }
};

// Combine metro and intercity stations for the map view
const ALL_STATIONS_WITH_COORDS = { ...CAIRO_METRO_STATIONS_WITH_COORDS, ...EGYPT_RAIL_STATIONS_WITH_COORDS };

export default function StationsMapView({ selectedStation = null, onStationSelect = null }) {
  const { appTheme } = useContext(UserContext);
  const systemScheme = useColorScheme();
  const scheme = appTheme === 'system' ? systemScheme : appTheme;
  const T = scheme === 'dark' ? darkTheme : lightTheme;
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedLine, setSelectedLine] = useState('all'); // 'all', 1, 2, 3

  // Filter stations by line
  const filteredStations = Object.entries(ALL_STATIONS_WITH_COORDS).filter(([name, data]) => {
    if (selectedLine === 'all') return true;
    if (selectedLine === 'intercity') return data.line === 'rail';
    const stationLines = Array.isArray(data.line) ? data.line : [data.line];
    return stationLines.includes(parseInt(selectedLine));
  });

  const getLineColor = (lineNum) => {
    switch (lineNum) {
      case 1:
        return '#E11D48'; // Red
      case 2:
        return '#0284C7'; // Blue
      case 3:
        return '#EA580C'; // Orange
      default:
        return T.primaryAlt;
    }
  };

  const getLineName = (lineNum) => {
    switch (lineNum) {
      case 1:
        return 'Line 1 (Red)';
      case 2:
        return 'Line 2 (Blue)';
      case 3:
        return 'Line 3 (Orange)';
      default:
        return 'Unknown';
    }
  };

  const openMapApp = (station) => {
    const stationData = CAIRO_METRO_STATIONS_WITH_COORDS[station];
    if (!stationData) return;

    const { lat, lng } = stationData;
    const label = encodeURIComponent(station);

    if (Platform.OS === 'ios') {
      // Apple Maps for iOS
      const url = `maps://maps.apple.com/?q=${label}&ll=${lat},${lng}&z=15`;
      Linking.openURL(url).catch(() => {
        // Fallback to Google Maps if Apple Maps is not available
        Linking.openURL(`https://maps.google.com/?q=${label}@${lat},${lng}`);
      });
    } else {
      // Google Maps for Android
      Linking.openURL(`https://maps.google.com/?q=${label}@${lat},${lng}`);
    }
  };

  const openDirections = (station) => {
    const stationData = CAIRO_METRO_STATIONS_WITH_COORDS[station];
    if (!stationData) return;

    const { lat, lng } = stationData;

    if (Platform.OS === 'ios') {
      // Apple Maps directions for iOS
      const url = `maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
      Linking.openURL(url).catch(() => {
        // Fallback to Google Maps
        Linking.openURL(`https://maps.google.com/?q=${lat},${lng}&z=15`);
      });
    } else {
      // Google Maps directions for Android
      Linking.openURL(`https://maps.google.com/?q=${lat},${lng}&z=15`);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header with Mode Selector */}
      <View style={{ 
        backgroundColor: T.card, 
        borderBottomWidth: 1, 
        borderBottomColor: T.border,
        paddingHorizontal: 16,
        paddingVertical: 12
      }}>
        <Text style={{ 
          color: T.text, 
          fontWeight: '800', 
          fontSize: 18, 
          marginBottom: 12 
        }}>
          Station Locations
        </Text>

        {/* View Mode Selector */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <TouchableOpacity
            onPress={() => setViewMode('list')}
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 12,
              backgroundColor: viewMode === 'list' ? T.primaryAlt : T.bg,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: viewMode === 'list' ? T.primaryAlt : T.border
            }}
          >
            <Text style={{
              color: viewMode === 'list' ? '#fff' : T.text,
              fontWeight: '700',
              textAlign: 'center'
            }}>
              📋 List View
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setViewMode('map')}
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 12,
              backgroundColor: viewMode === 'map' ? T.primaryAlt : T.bg,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: viewMode === 'map' ? T.primaryAlt : T.border
            }}
          >
            <Text style={{
              color: viewMode === 'map' ? '#fff' : T.text,
              fontWeight: '700',
              textAlign: 'center'
            }}>
              🗺️ Map View
            </Text>
          </TouchableOpacity>
        </View>

        {/* Line Filter Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
          {['all', 1, 2, 3, 'intercity'].map((line) => (
            <TouchableOpacity
              key={line}
              onPress={() => setSelectedLine(String(line))}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                backgroundColor: selectedLine === String(line) ?
                  (line === 'all' ? T.primaryAlt : (line === 'intercity' ? T.primaryAlt : getLineColor(line))) :
                  T.bg,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: selectedLine === String(line) ?
                  (line === 'all' ? T.primaryAlt : (line === 'intercity' ? T.primaryAlt : getLineColor(line))) :
                  T.border,
                marginRight: 8
              }}
            >
              <Text style={{
                color: selectedLine === String(line) ? '#fff' : T.text,
                fontWeight: '700',
                fontSize: 13
              }}>
                {line === 'all' ? 'All Lines' : (line === 'intercity' ? 'Intercity Rail' : getLineName(line))}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List View */}
      {viewMode === 'list' && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12, paddingBottom: 20 }}>
          {filteredStations.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: T.subtext, fontSize: 16 }}>No stations found</Text>
            </View>
          ) : (
            filteredStations.map(([stationName, stationData]) => {
              const stationLines = Array.isArray(stationData.line) ? stationData.line : [stationData.line];
              const isSelected = selectedStation === stationName;

              return (
                <View
                  key={stationName}
                  style={{
                    backgroundColor: T.card,
                    borderWidth: 1,
                    borderColor: isSelected ? T.primaryAlt : T.border,
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 10,
                    marginHorizontal: 4
                  }}
                >
                  {/* Station Name and Lines */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: T.text, fontWeight: '800', fontSize: 16, marginBottom: 4 }}>
                        {stationName}
                      </Text>
                      <Text style={{ color: T.subtext, fontSize: 13 }}>
                        {stationData.area}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      {stationLines.map((line) => (
                        <View
                          key={line}
                          style={{
                            backgroundColor: getLineColor(line),
                            paddingVertical: 4,
                            paddingHorizontal: 8,
                            borderRadius: 6,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 11 }}>
                            L{line}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Coordinates */}
                  <View style={{ 
                    backgroundColor: T.bg, 
                    borderRadius: 8, 
                    padding: 10, 
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                    <MapPin size={16} color={T.primaryAlt} />
                    <Text style={{ color: T.subtext, fontSize: 12, marginLeft: 8, flex: 1 }}>
                      {stationData.lat.toFixed(4)}°N, {stationData.lng.toFixed(4)}°E
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => openMapApp(stationName)}
                      style={{
                        flex: 1,
                        backgroundColor: T.primaryAlt,
                        paddingVertical: 10,
                        borderRadius: 8,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <MapPin size={14} color="#fff" />
                      <Text style={{ color: '#fff', fontWeight: '700', marginLeft: 6, fontSize: 13 }}>
                        View
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => openDirections(stationName)}
                      style={{
                        flex: 1,
                        backgroundColor: T.bg,
                        borderWidth: 1,
                        borderColor: T.primaryAlt,
                        paddingVertical: 10,
                        borderRadius: 8,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Navigation size={14} color={T.primaryAlt} />
                      <Text style={{ color: T.primaryAlt, fontWeight: '700', marginLeft: 6, fontSize: 13 }}>
                        Directions
                      </Text>
                    </TouchableOpacity>

                    {onStationSelect && (
                      <TouchableOpacity
                        onPress={() => onStationSelect(stationName)}
                        style={{
                          flex: 1,
                          backgroundColor: T.primaryAlt + '20',
                          borderWidth: 1,
                          borderColor: T.primaryAlt,
                          paddingVertical: 10,
                          borderRadius: 8,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Text style={{ color: T.primaryAlt, fontWeight: '700', fontSize: 13 }}>
                          Select
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Google Maps View */}
      {viewMode === 'map' && (
        <View style={{ flex: 1, padding: 12 }}>
          <View style={{
            flex: 1,
            backgroundColor: T.card,
            borderWidth: 1,
            borderColor: T.border,
            borderRadius: 16,
            overflow: 'hidden',
            minHeight: 400
          }}>
            {/* Google Maps Container Box */}
            <View style={{
              flex: 1,
              backgroundColor: T.bg,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: T.border,
              borderRadius: 12,
              margin: 12
            }}>
              <MapPin size={48} color={T.primaryAlt} />
              <Text style={{ 
                color: T.text, 
                fontWeight: '800', 
                fontSize: 18, 
                marginTop: 16,
                marginBottom: 8
              }}>
                Google Maps
              </Text>
              <Text style={{ 
                color: T.subtext, 
                fontSize: 14, 
                textAlign: 'center',
                paddingHorizontal: 20,
                marginBottom: 20
              }}>
                Google Maps integration area
              </Text>
              <Text style={{ 
                color: T.subtext, 
                fontSize: 12, 
                textAlign: 'center',
                paddingHorizontal: 20
              }}>
                Add your Google Maps component here
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
