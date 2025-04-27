import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import Screen from '@/components/screen';
import { useCurrentUser } from '@/hooks/useCurrentUser'; 
import Avatar from '@/components/display/Avatar';
import { scale } from 'react-native-size-matters';
import { colors } from '@/utils/constants'; 
import { router } from 'expo-router';

const MoreScreen = () => {
  const { userData, isLoading, isError } = useCurrentUser();
  const handleNavigate = (destination: string) => {
    if (destination === 'Profile') {
      router.push({
        pathname: "/EditProfileScreen",
        params: {
          fullName: userData?.fullName || '',
          email: userData?.email || '',
          phone: userData?.phone || '',
          nationality: userData?.nationality || '',
          profileImage: userData?.profileImage || '',
        },
      });
    } else if (destination === 'Payments') {
      router.push("/PaymentMethodsScreen"); 
    } else {
      console.log('Navigate to:', destination);
    }
  };
  
  const profileOptions = [
    { title: 'Your Profile', icon: 'person', destination: 'Profile' },
    { title: 'Payment Methods', icon: 'credit-card', destination: 'Payments' },
    { title: 'My Wallet', icon: 'account-balance-wallet', destination: 'Wallet' },
    { title: 'Settings', icon: 'settings', destination: 'Settings' },
    { title: 'Help Center', icon: 'help-outline', destination: 'Help' },
    { title: 'Privacy Policy', icon: 'privacy-tip', destination: 'Privacy' },
    { title: 'Log out', icon: 'logout', destination: 'Logout' },
  ];

  
  if (isLoading) {
    return (
      <Screen>
        <View >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }
console.log(userData)
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Avatar user={userData} size={scale(70)} />
          <Text style={styles.name}>
            {userData?.fullName || "Utilisateur"}
          </Text>
        </View>

        {/* List */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => handleNavigate(item.destination)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View style={styles.iconBackground}>
                  {/* @ts-expect-error */}
                  <MaterialIcons name={item.icon} size={22} color="#2563eb" />
                </View>
                <Text style={styles.optionTitle}>{item.title}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default MoreScreen;


const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 0,
    backgroundColor: '#f9fafb',
    flexGrow: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop:15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginTop:8,
  },
  optionsContainer: {
    marginTop: 5,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    // overflow: 'hidden',
    // elevation: 3,
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
    backgroundColor: '#e0e7ff', // Light blue background
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
});
