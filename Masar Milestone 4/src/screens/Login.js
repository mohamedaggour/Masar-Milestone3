import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, useColorScheme, Alert, ActivityIndicator } from 'react-native';
import { UserContext } from '../context/UserContext';
import { t } from '../utils/translations';
import { lightTheme, darkTheme } from '../theme/colors';
import { Mail, Lock } from 'lucide-react-native';

export default function Login({ navigation }) {
  const systemScheme = useColorScheme();
  const { appTheme, appLanguage, login } = useContext(UserContext);
  const tr = (key) => t(appLanguage, key);
  const isRTL = appLanguage === 'ar';
  const scheme = appTheme === 'system' ? systemScheme : appTheme;
  const T = scheme === 'dark' ? darkTheme : lightTheme;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = tr('emailRequired');
    } else if (!email.includes('@')) {
      newErrors.email = tr('invalidEmail');
    }

    if (!password) {
      newErrors.password = tr('passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = tr('passwordMinLength');
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
        setEmail('');
        setPassword('');
      } else {
        Alert.alert(tr('loginFailed'), result.error || tr('pleaseRetry'));
      }
    } catch (error) {
      Alert.alert(tr('error'), tr('unexpectedError'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.bg }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 32, fontWeight: '800', color: T.text, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>{tr('welcomeBack')}</Text>
        <Text style={{ fontSize: 16, color: T.subtext, marginBottom: 32, textAlign: isRTL ? 'right' : 'left' }}>{tr('signInSubtitle')}</Text>

        {/* Email Field */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: T.text, fontWeight: '600', marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>{tr('email')}</Text>
          <View style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            backgroundColor: T.card,
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: errors.email ? '#ef4444' : T.border
          }}>
            <Mail color={errors.email ? '#ef4444' : T.subtext} size={20} />
            <TextInput
              style={{ flex: 1, padding: 14, color: T.text, marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0, textAlign: isRTL ? 'right' : 'left' }}
              placeholder={tr('enterEmail')}
              placeholderTextColor={T.subtext}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
            />
          </View>
          {errors.email && <Text style={{ color: '#ef4444', marginTop: 6, fontSize: 12, textAlign: isRTL ? 'right' : 'left' }}>{errors.email}</Text>}
        </View>

        {/* Password Field */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: T.text, fontWeight: '600', marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>{tr('password')}</Text>
          <View style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            backgroundColor: T.card,
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: errors.password ? '#ef4444' : T.border
          }}>
            <Lock color={errors.password ? '#ef4444' : T.subtext} size={20} />
            <TextInput
              style={{ flex: 1, padding: 14, color: T.text, marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0, textAlign: isRTL ? 'right' : 'left' }}
              placeholder={tr('enterPassword')}
              placeholderTextColor={T.subtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              editable={!loading}
            />
          </View>
          {errors.password && <Text style={{ color: '#ef4444', marginTop: 6, fontSize: 12, textAlign: isRTL ? 'right' : 'left' }}>{errors.password}</Text>}
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{ backgroundColor: T.primaryAlt, padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16, opacity: loading ? 0.6 : 1 }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{tr('signIn')}</Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: T.subtext, marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }}>{tr('noAccount')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')} disabled={loading}>
            <Text style={{ color: T.primaryAlt, fontWeight: '700' }}>{tr('signUp')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
