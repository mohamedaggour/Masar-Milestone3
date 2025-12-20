import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, useColorScheme, Alert, ActivityIndicator } from 'react-native';
import { UserContext } from '../context/UserContext';
import { lightTheme, darkTheme } from '../theme/colors';
import { Mail, Lock, User, Phone } from 'lucide-react-native';

export default function Signup({ navigation }) {
  const systemScheme = useColorScheme();
  const { appTheme, register } = useContext(UserContext);
  const scheme = appTheme === 'system' ? systemScheme : appTheme;
  const T = scheme === 'dark' ? darkTheme : lightTheme;
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!name) {
      newErrors.name = 'Name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!phone) {
      newErrors.phone = 'Phone is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const result = await register(email, password, name, phone);
      if (result.success) {
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        // Navigation happens automatically in App.js
      } else {
        Alert.alert('Signup Failed', result.error || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.bg }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 20 }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 32, fontWeight: '800', color: T.text, marginBottom: 8 }}>Create Account</Text>
        <Text style={{ fontSize: 16, color: T.subtext, marginBottom: 32 }}>Join Masar for seamless travel</Text>

        {/* Name Field */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: T.text, fontWeight: '600', marginBottom: 8 }}>Full Name</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: T.card,
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: errors.name ? '#ef4444' : T.border
          }}>
            <User color={errors.name ? '#ef4444' : T.subtext} size={20} />
            <TextInput
              style={{
                flex: 1,
                padding: 14,
                color: T.text,
                marginLeft: 8
              }}
              placeholder="Enter your full name"
              placeholderTextColor={T.subtext}
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          </View>
          {errors.name && <Text style={{ color: '#ef4444', marginTop: 6, fontSize: 12 }}>{errors.name}</Text>}
        </View>

        {/* Email Field */}
        <View style={{ marginBottom: 16 }}>
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

        {/* Phone Field */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: T.text, fontWeight: '600', marginBottom: 8 }}>Phone Number</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: T.card,
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: errors.phone ? '#ef4444' : T.border
          }}>
            <Phone color={errors.phone ? '#ef4444' : T.subtext} size={20} />
            <TextInput
              style={{
                flex: 1,
                padding: 14,
                color: T.text,
                marginLeft: 8
              }}
              placeholder="Enter your phone number"
              placeholderTextColor={T.subtext}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>
          {errors.phone && <Text style={{ color: '#ef4444', marginTop: 6, fontSize: 12 }}>{errors.phone}</Text>}
        </View>

        {/* Password Field */}
        <View style={{ marginBottom: 16 }}>
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

        {/* Confirm Password Field */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: T.text, fontWeight: '600', marginBottom: 8 }}>Confirm Password</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: T.card,
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: errors.confirmPassword ? '#ef4444' : T.border
          }}>
            <Lock color={errors.confirmPassword ? '#ef4444' : T.subtext} size={20} />
            <TextInput
              style={{
                flex: 1,
                padding: 14,
                color: T.text,
                marginLeft: 8
              }}
              placeholder="Confirm your password"
              placeholderTextColor={T.subtext}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              editable={!loading}
            />
          </View>
          {errors.confirmPassword && <Text style={{ color: '#ef4444', marginTop: 6, fontSize: 12 }}>{errors.confirmPassword}</Text>}
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={handleSignup}
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
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: T.subtext, marginRight: 4 }}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
            <Text style={{ color: T.primaryAlt, fontWeight: '700' }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
