import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, useColorScheme, Alert, ActivityIndicator } from 'react-native';
import { UserContext } from '../context/UserContext';
import { t } from '../utils/translations';
import { lightTheme, darkTheme } from '../theme/colors';
import { Mail, Lock, User, Phone } from 'lucide-react-native';

export default function Signup({ navigation }) {
  const systemScheme = useColorScheme();
  const { appTheme, appLanguage, register } = useContext(UserContext);
  const tr = (key) => t(appLanguage, key);
  const isRTL = appLanguage === 'ar';
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
      newErrors.name = tr('nameRequired');
    }
    if (!email) {
      newErrors.email = tr('emailRequired');
    } else if (!email.includes('@')) {
      newErrors.email = tr('invalidEmail');
    }
    if (!phone) {
      newErrors.phone = tr('phoneRequired');
    }
    if (!password) {
      newErrors.password = tr('passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = tr('passwordMinLength');
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = tr('passwordsMismatch');
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
        Alert.alert(tr('signupFailed'), result.error || tr('pleaseRetry'));
      }
    } catch (error) {
      Alert.alert(tr('error'), tr('unexpectedError'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.bg }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 20 }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 32, fontWeight: '800', color: T.text, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>{tr('createAccount')}</Text>
        <Text style={{ fontSize: 16, color: T.subtext, marginBottom: 32, textAlign: isRTL ? 'right' : 'left' }}>{tr('signUpSubtitle')}</Text>

        {[
          { key: 'name', label: tr('fullName'), placeholder: tr('enterFullName'), value: name, set: setName, Icon: User, keyboard: 'default', secure: false },
          { key: 'email', label: tr('email'), placeholder: tr('enterEmail'), value: email, set: setEmail, Icon: Mail, keyboard: 'email-address', secure: false },
          { key: 'phone', label: tr('phoneNumber'), placeholder: tr('enterPhone'), value: phone, set: setPhone, Icon: Phone, keyboard: 'phone-pad', secure: false },
          { key: 'password', label: tr('password'), placeholder: tr('enterPassword'), value: password, set: setPassword, Icon: Lock, keyboard: 'default', secure: true },
          { key: 'confirmPassword', label: tr('confirmPassword'), placeholder: tr('confirmPasswordPlaceholder'), value: confirmPassword, set: setConfirmPassword, Icon: Lock, keyboard: 'default', secure: true },
        ].map(({ key, label, placeholder, value, set, Icon, keyboard, secure }, i, arr) => (
          <View key={key} style={{ marginBottom: i === arr.length - 1 ? 24 : 16 }}>
            <Text style={{ color: T.text, fontWeight: '600', marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>{label}</Text>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', backgroundColor: T.card, borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: errors[key] ? '#ef4444' : T.border }}>
              <Icon color={errors[key] ? '#ef4444' : T.subtext} size={20} />
              <TextInput
                style={{ flex: 1, padding: 14, color: T.text, marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0, textAlign: isRTL ? 'right' : 'left' }}
                placeholder={placeholder}
                placeholderTextColor={T.subtext}
                value={value}
                onChangeText={set}
                keyboardType={keyboard}
                secureTextEntry={secure}
                editable={!loading}
              />
            </View>
            {errors[key] && <Text style={{ color: '#ef4444', marginTop: 6, fontSize: 12, textAlign: isRTL ? 'right' : 'left' }}>{errors[key]}</Text>}
          </View>
        ))}

        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          style={{ backgroundColor: T.primaryAlt, padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16, opacity: loading ? 0.6 : 1 }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{tr('createAccount')}</Text>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: T.subtext, marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }}>{tr('alreadyHaveAccount')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
            <Text style={{ color: T.primaryAlt, fontWeight: '700' }}>{tr('signIn')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
