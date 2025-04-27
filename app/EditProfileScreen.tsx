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

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
};

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { userData } = useCurrentUser();


  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Modifier mon profil',
    });
  }, [navigation]);
  const params = useLocalSearchParams();

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      fullName: params.fullName as string || '',
      email: params.email as string || '',
      phone: params.phone as string || '',
      nationality: params.nationality as string || '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Updated data:', data);
    router.back(); 
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
          contentStyle={{ paddingVertical: 8 }}
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
