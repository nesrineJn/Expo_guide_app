import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import Avatar from '@/components/display/Avatar';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { scale } from 'react-native-size-matters';
import { colors } from '@/utils/constants';
import { router } from 'expo-router';
import Input from '@/components/Input';
import * as SecureStore from "expo-secure-store";
import { useLoading } from '@/hooks/useLoading';


type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
};

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { userData } = useCurrentUser();
  const { isLoading, startLoading, stopLoading } = useLoading();


  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Modifier mon profil',
    });
  }, [navigation]);
  const params = useLocalSearchParams();

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      fullName: (params.fullName as string) || userData?.fullName || '',
      email: (params.email as string) || userData?.email || '',
      phone: (params.phone as string) || userData?.phoneNumber || '',   
      nationality: (params.nationality as string) || userData?.nationality || '',
    },
  });
  
  
  
  const onSubmit = async (data: FormValues) => {
    try {
      startLoading();
      // console.log('Updated data:', data);
  
      const currentUser = await SecureStore.getItemAsync("currentUser");
      if (!currentUser) {
        throw new Error("Utilisateur non trouvé");
      }
  
      const response = await fetch(`http://192.168.1.16:4000/users/${currentUser}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phone,
          nationality: data.nationality,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du profil");
      }
  
      // console.log('Profil mis à jour avec succès');
  
      // Rediriger seulement après succès
      router.replace('/(tabs)');
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    } finally {
      stopLoading();
    }
  };
  

  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar user={userData} size={scale(80)} />
        <TouchableOpacity style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>Changer la photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {/* Full Name */}
        <Controller
          control={control}
          name="fullName"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Nom complet"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              style={styles.input}
            />
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Email"
              mode="outlined"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              style={styles.input}
            />
          )}
        />

        {/* Phone */}
        <Controller
          control={control}
          name="phone"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Téléphone"
              mode="outlined"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
              style={styles.input}
            />
          )}
        />

        {/* Nationality */}
        <Controller
          control={control}
          name="nationality"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Nationalité"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              style={styles.input}
            />
          )}
        />

        {/* Save button */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.saveButton}
          contentStyle={{ paddingVertical: 5 }}
        >
          Sauvegarder
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9fafb',
    flexGrow: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  changePhotoButton: {
    marginTop: 10,
  },
  changePhotoText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  form: {
    marginTop: 10,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
  },
});