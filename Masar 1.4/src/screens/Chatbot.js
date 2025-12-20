import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, useColorScheme, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { lightTheme, darkTheme } from '../theme/colors';
import { UserContext, API_URL } from '../context/UserContext';
import { Bot, Send, ArrowLeft } from 'lucide-react-native';
import Header from '../components/Header';

export default function Chatbot({ navigation }) {
  const systemScheme = useColorScheme();
  const { appTheme } = useContext(UserContext);
  const scheme = appTheme === 'system' ? systemScheme : appTheme;
  const T = scheme === 'dark' ? darkTheme : lightTheme;
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Masar Assistant. I can help you with route suggestions, crowd predictions, and metro information. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const resp = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          history: messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
        })
      });

      const data = await resp.json();
      const botText = data?.response || "I'm sorry, I couldn't process that request. Please try again.";

      const botMessage = {
        id: Date.now() + 1,
        text: botText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot API error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting to the server. Please check your internet connection and try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading, messages]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Header />
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 16, 
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: T.border,
        backgroundColor: T.card
      }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ marginRight: 12 }}
        >
          <ArrowLeft size={24} color={T.text} />
        </TouchableOpacity>
        <Bot size={24} color={T.primaryAlt} />
        <Text style={{ 
          color: T.text, 
          fontWeight: '800', 
          fontSize: 18, 
          marginLeft: 8 
        }}>
          Masar Assistant
        </Text>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={{
                flexDirection: 'row',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 16
              }}
            >
              {message.sender === 'bot' && (
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: T.primaryAlt,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 8
                }}>
                  <Bot size={18} color="#fff" />
                </View>
              )}
              <View style={{
                maxWidth: '75%',
                backgroundColor: message.sender === 'user' ? T.primaryAlt : T.card,
                borderRadius: 16,
                padding: 12,
                borderWidth: message.sender === 'bot' ? 1 : 0,
                borderColor: T.border
              }}>
                <Text style={{
                  color: message.sender === 'user' ? '#fff' : T.text,
                  fontSize: 15,
                  lineHeight: 20
                }}>
                  {message.text}
                </Text>
                <Text style={{
                  color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : T.subtext,
                  fontSize: 11,
                  marginTop: 4
                }}>
                  {formatTime(message.timestamp)}
                </Text>
              </View>
              {message.sender === 'user' && (
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: T.bg,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 8,
                  borderWidth: 1,
                  borderColor: T.border
                }}>
                  <Text style={{ color: T.text, fontWeight: '700', fontSize: 14 }}>U</Text>
                </View>
              )}
            </View>
          ))}
          {isLoading && (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 16 }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: T.primaryAlt,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8
              }}>
                <Bot size={18} color="#fff" />
              </View>
              <View style={{
                backgroundColor: T.card,
                borderRadius: 16,
                padding: 12,
                borderWidth: 1,
                borderColor: T.border
              }}>
                <Text style={{ color: T.subtext, fontSize: 14 }}>Typing...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: T.border,
          backgroundColor: T.card,
          alignItems: 'center'
        }}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor={T.subtext}
            style={{
              flex: 1,
              backgroundColor: T.bg,
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 10,
              color: T.text,
              fontSize: 15,
              borderWidth: 1,
              borderColor: T.border,
              marginRight: 8
            }}
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: inputText.trim() && !isLoading ? T.primaryAlt : T.border,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Send size={20} color={inputText.trim() && !isLoading ? '#fff' : T.subtext} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

