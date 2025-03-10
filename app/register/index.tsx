import React from "react";
import {
  ScrollView,
  View,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Button, Text } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { Link, Stack } from "expo-router";
import colors from "tailwindcss/colors";

import Screen from "@/components/screen";
import Input from "@/components/Input";
import Typography from "@/components/typography";
import { useLoading } from "@/hooks/useLoading";
import Image from "@/components/display/Image";

export type RegisterForm = {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  confirmPassword: string;
};

const RegisterScreen = ({ navigation }: any) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();
  const { isLoading, startLoading, stopLoading } = useLoading();

  const onSubmit = async (data: any) => {
    startLoading();
    const { email, password, fullName, phoneNumber } = data;
    console.log(email,password,fullName,phoneNumber)

    fetch("http://172.16.19.203:4000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password, fullName: fullName, phoneNumber: phoneNumber, role: "TOURISTE" }),
    })
      .then((response) => {
        console.log(JSON.stringify(response,null,2))
        if (!response.ok) throw new Error("Registration failed.");
        return response.json();
      })
      .then(async () => stopLoading())
      .catch(() => {
        stopLoading();
        // Alert.alert("Error", "Registration failed. Please try again.");
      });
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {/* Logo */}
            {/* <Image
              // source={require("../../assets/images/logoguide.png")}
              style={styles.logo}
            /> */}

            {/* Title */}
            <Text style={styles.title}>Create an Account</Text>
            <Text style={styles.subtitle}>
              Welcome! Please fill in the form to register.
            </Text>

            {/* Full Name */}
            <Controller
              control={control}
              rules={{ required: "Full name is required." }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter your full name"
                  style={styles.input}
                />
              )}
              name="fullName"
            />
            {errors.fullName && (
              <Text style={styles.errorText}>{errors.fullName.message}</Text>
            )}

            {/* Phone Number */}
            <Controller
              control={control}
              rules={{
                required: "Phone number is required.",
                minLength: { value: 6, message: "Must be at least 6 digits." },
                maxLength: { value: 15, message: "Max 15 digits allowed." },
                pattern: { value: /^[0-9]+$/, message: "Only numbers allowed." },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Phone Number"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              )}
              name="phoneNumber"
            />
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>
            )}

            {/* Email */}
            <Controller
              control={control}
              rules={{
                required: "Email is required.",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email." },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  style={styles.input}
                />
              )}
              name="email"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}

            {/* Password */}
            <Controller
              control={control}
              rules={{
                required: "Password is required.",
                minLength: { value: 6, message: "At least 6 characters." },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                  message: "Must contain uppercase, lowercase & number.",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter your password"
                  secureTextEntry
                  style={styles.input}
                />
              )}
              name="password"
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            {/* Confirm Password */}
            <Controller
              control={control}
              rules={{
                validate: (value) =>
                  value === watch("password") || "Passwords do not match.",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirm Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Re-enter your password"
                  secureTextEntry
                  style={styles.input}
                />
              )}
              name="confirmPassword"
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>
                {errors.confirmPassword.message}
              </Text>
            )}

            {/* Register Button */}
            <Button
              onPress={handleSubmit(onSubmit)}
              mode="contained"
              style={styles.registerButton}
              labelStyle={styles.buttonText}
              disabled={isLoading}
              
            >
              
              {isLoading ? "Registering..." : "Register"}
            </Button>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account?</Text>
              <Link href="/login" asChild>
                <Text style={styles.signInLink}>Sign In</Text>
              </Link>
            </View>
          </ScrollView>
        </View>
     
    </Screen>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 15,
  },
  errorText: {
    color: colors.red[500],
    fontSize: 13,
  },
  registerButton: {
    backgroundColor: colors.orange[500],
    borderRadius: 10,
    paddingVertical: 6,
    marginBottom: 20,
    width: "100%",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
  },
  signInContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  signInText: {
    fontSize: 14,
  },
  signInLink: {
    color: colors.blue[500],
    marginLeft: 5,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
