import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import { colors } from '@/utils/constants';
import { router } from 'expo-router';

const PaymentMethodsScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleOptionPress = (method: string) => {
    setSelectedMethod(method);
  };

  const handleConfirmPayment = () => {
    if (!selectedMethod) return;
    alert(`Paiement confirmé avec ${selectedMethod}`);
  };

  const renderOption = (label: string, icon: string, isLast?: boolean) => {
    const isSelected = selectedMethod === label;

    return (
      <TouchableOpacity
        style={[
          styles.option,
          isSelected && { backgroundColor: colors.primaryContainer },
          isLast && { borderBottomWidth: 0 },
        ]}
        onPress={() => handleOptionPress(label)}
        activeOpacity={0.7}
      >
        <View style={styles.optionContent}>
          <View style={styles.iconBackground}>
            <MaterialIcons name={icon as any} size={22} color="#2563eb" />
          </View>
          <Text style={styles.optionTitle}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Section Credit & Debit Card */}
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Credit & Debit Card</Text>
          <TouchableOpacity
            style={[styles.option, { borderBottomWidth: 0 }]}
            onPress={() => router.push('/AddCardScreen')} 
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={styles.iconBackground}>
                <MaterialIcons name="credit-card" size={22} color="#2563eb" />
              </View>
              <Text style={styles.optionTitle}>Add Card</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Section Wallet */}
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Wallet</Text>
          {renderOption('Wallet', 'account-balance-wallet', true)}
        </View>

        {/* Section More Payment Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>More Payment Options</Text>
          {renderOption('Paypal', 'payment')}
          {renderOption('Apple Pay', 'phone-iphone')}
          {renderOption('Google Pay', 'android', true)}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          !selectedMethod && { backgroundColor: '#cbd5e1' },
        ]}
        onPress={handleConfirmPayment}
        disabled={!selectedMethod}
      >
        <Text style={styles.confirmButtonText}>Confirmer Paiement</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentMethodsScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    paddingVertical: 10,
    flexGrow: 1,
  },
  optionsContainer: {
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBackground: {
    backgroundColor: '#e0e7ff',
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTitle: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    padding: 16,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
