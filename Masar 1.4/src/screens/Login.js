import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, useColorScheme, Alert, ActivityIndicator } from 'react-native';
import { UserContext } from '../context/UserContext';
import { lightTheme, darkTheme } from '../theme/colors';
import { Mail, Lock } from 'lucide-react-native';

export default function Login({ navigation }) {
  const systemScheme = useColorScheme();
  const { appTheme, login } = useContext(UserContext);
  const scheme = appTheme === 'system' ? systemScheme : appTheme;
  const T = scheme === 'dark' ? darkTheme : lightTheme;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        // Navigation happens automatically in App.js
        setEmail('');
        setPassword('');
      } else {
        Alert.alert('Login Failed', result.error || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.bg }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 32, fontWeight: '800', color: T.text, marginBottom: 8 }}>Welcome Back</Text>
        <Text style={{ fontSize: 16, color: T.subtext, marginBottom: 32 }}>Sign in to your Masar account</Text>

        {/* Email Field */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: T.text, fontWeight: '600', marginBottom: 8 }}>Email</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: T.card,
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: errors.email ? '#ef4444' : T.border
          }}>
            <Mail color={errors.email ? '#ef4444' : T.subtext} size={20} />
            <TextInput
              style={{
                flex: 1,
                padding: 14,
                color: T.text,
                marginLeft: 8
              }}
              placeholder="Enter your email"
              placeholderTextColor={T.subtext}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
            />
          </View>
          {errors.email && <Text style={{ color: '#ef4444', marginTop: 6, fontSize: 12 }}>{errors.email}</Text>}
        </View>

        {/* Password Field */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: T.text, fontWeight: '600', marginBottom: 8 }}>Password</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: T.card,
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: errors.password ? '#ef4444' : T.border
          }}>
            <Lock color={errors.password ? '#ef4444' : T.subtext} size={20} />
            <TextInput
              style={{
                flex: 1,
                padding: 14,
                color: T.text,
                marginLeft: 8
              }}
              placeholder="Enter your password"
              placeholderTextColor={T.subtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              editable={!loading}
            />
          </View>
          {errors.password && <Text style={{ color: '#ef4444', marginTop: 6, fontSize: 12 }}>{errors.password}</Text>}
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{
            backgroundColor: T.primaryAlt,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 16,
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: T.subtext, marginRight: 4 }}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')} disabled={loading}>
            <Text style={{ color: T.primaryAlt, fontWeight: '700' }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
