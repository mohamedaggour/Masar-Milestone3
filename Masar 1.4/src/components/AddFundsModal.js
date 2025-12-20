import React, { useContext, useState, useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, useColorScheme, Alert } from 'react-native';
import { UserContext, API_URL } from '../context/UserContext';
import { lightTheme, darkTheme } from '../theme/colors';
import axios from 'axios';

export default function AddFundsModal() {
  const systemScheme = useColorScheme();
  const { appTheme, showAddFunds, setShowAddFunds, balance, setBalance, token } = useContext(UserContext);
  const scheme = appTheme === 'system' ? systemScheme : appTheme;
  const T = scheme === 'dark' ? darkTheme : lightTheme;
  
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddFunds = useCallback(async () => {
    const v = parseFloat(amount);
    if (!isNaN(v) && v > 0) {
      setLoading(true);
      try {
        const response = await axios.put(
          `${API_URL}/auth/user/balance`,
          { amount: v },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success) {
          setBalance(response.data.balance);
          setAmount('');
          setShowAddFunds(false);
          Alert.alert('Success', `Added EGP ${v.toFixed(2)} to your account`);
        } else {
          Alert.alert('Error', response.data.error || 'Failed to add funds');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to add funds. Please try again.');
        console.error('Add funds error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
    }
  }, [amount, token, setBalance, setShowAddFunds]);

  const PRESET_AMOUNTS = [50, 100, 200, 500];

  return (
    <Modal visible={showAddFunds} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <View style={{ backgroundColor: T.card, borderRadius: 24, padding: 24, width: '100%', borderWidth: 1, borderColor: T.border }}>
          <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 8, color: T.text }}>Add Funds</Text>
          <Text style={{ color: T.subtext, marginBottom: 16, fontSize: 14 }}>Current Balance: EGP {balance.toFixed(2)}</Text>
          
          <Text style={{ color: T.text, fontWeight: '600', marginBottom: 8 }}>Amount (EGP)</Text>
          <TextInput
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            editable={!loading}
            placeholderTextColor={T.subtext}
            style={{
              borderWidth: 2,
              borderColor: T.border,
              borderRadius: 14,
              padding: 12,
              fontSize: 16,
              marginBottom: 16,
              color: T.text,
              backgroundColor: T.bg
            }}
          />
          
          <Text style={{ color: T.text, fontWeight: '600', marginBottom: 8, fontSize: 14 }}>Quick Amount</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {PRESET_AMOUNTS.map(v => (
              <TouchableOpacity
                key={v}
                onPress={() => setAmount(String(v))}
                disabled={loading}
                style={{
                  backgroundColor: T.primaryAlt,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  flex: 1,
                  minWidth: '45%'
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center' }}>EGP {v}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            onPress={handleAddFunds}
            disabled={loading}
            style={{
              backgroundColor: T.primaryAlt,
              padding: 14,
              borderRadius: 14,
              opacity: loading ? 0.6 : 1
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '800', textAlign: 'center' }}>
              {loading ? 'Processing...' : 'Add Funds'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setShowAddFunds(false)}
            disabled={loading}
            style={{ marginTop: 12 }}
          >
            <Text style={{ textAlign: 'center', color: T.subtext, fontWeight: '600' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}