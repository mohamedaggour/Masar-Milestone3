import React, { useContext } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './src/screens/Home';
import Booking from './src/screens/Booking';
import Settings from './src/screens/Settings';
import Profile from './src/screens/Profile';
import StationsMap from './src/screens/StationsMap';
import Chatbot from './src/screens/Chatbot';
import Ticket from './src/screens/Ticket';
import TravelHistory from './src/screens/TravelHistory';
import ActiveTickets from './src/screens/ActiveTickets';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import { UserProvider, UserContext } from './src/context/UserContext';
import ScanModal from './src/components/ScanModal';
import AddFundsModal from './src/components/AddFundsModal';
import { lightTheme, darkTheme } from './src/theme/colors';
import { Zap, Train, Settings as SettingsIcon, User, MapPin } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

function TabNavigator() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: isDark ? darkTheme.primary : lightTheme.primaryAlt,
        tabBarStyle: { borderTopWidth: 0, elevation: 12 }
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarIcon: ({ color, size }) => <Zap color={color} size={size} /> }} />
      <Tab.Screen name="Booking" component={Booking} options={{ tabBarIcon: ({ color, size }) => <Train color={color} size={size} /> }} />
      <Tab.Screen name="Stations" component={StationsMap} options={{ tabBarIcon: ({ color, size }) => <MapPin color={color} size={size} /> }} />
      <Tab.Screen name="Settings" component={Settings} options={{ tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} /> }} />
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Signup" component={Signup} />
    </AuthStack.Navigator>
  );
}

function RootNavigator() {
  const { isLoggedIn } = useContext(UserContext);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const navTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {isLoggedIn ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="Chatbot" component={Chatbot} />
          <Stack.Screen name="Ticket" component={Ticket} />
          <Stack.Screen name="TravelHistory" component={TravelHistory} />
          <Stack.Screen name="ActiveTickets" component={ActiveTickets} />
        </Stack.Navigator>
      ) : (
        <AuthNavigator />
      )}
      <ScanModal />
      <AddFundsModal />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <RootNavigator />
      </UserProvider>
    </SafeAreaProvider>
  );
}