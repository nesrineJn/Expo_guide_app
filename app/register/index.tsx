import React, { useRef } from "react";
import {
  ScrollView,
  View,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import Screen from "@/components/screen";
import Input from "@/components/Input";
import Typography from "@/components/typography";
import { useLoading } from "@/hooks/useLoading";
import { Button, Text } from "react-native-paper";
import colors from "tailwindcss/colors";
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
    // apis.authService
    //   .login(email, password)
    //   .then((response) => {
    //     storage.set("isLoggedIn", "true");
    //     const tokenResponse: TokenResponse = {
    //       access_token: response.access_token,
    //       refresh_token: response.refresh_token,
    //       token_type: "Bearer",
    //       expires_in: response.expires_in,
    //     };
    //     console.log(tokenResponse);
    //     idpStoragePersister.saveTokenResponse(tokenResponse);
    //     stopLoading();
    //     navigation.navigate("app", { userEmail: email });
    fetch("http://192.168.1.23:4000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        fullName: fullName,
        phoneNumber: phoneNumber,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Password or email incorrect");
        }
        return response.json();
      })
      .then(async (json) => {
        stopLoading();
      })
      .catch((error) => {
        console.log(error, "erreur");
        stopLoading();
        Alert.alert("error", "Password or email incorrect. Please try again.");
      });
  };
  return (
    <Screen>
      <View>
        <ScrollView>
          <TouchableOpacity onPress={() => {}}>
            <Image
              source={require("../../assets/images/logoguide.png")}
              style={styles.logoptp}
            />
          </TouchableOpacity>
          <Text>Create an Account</Text>
          <Text>Welcome! Please fill in the form to register.</Text>
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
              />
            )}
            name="fullName"
          />
          {errors.fullName && <Text>{errors.fullName.message}</Text>}
          {/* Phone Number */}
          <Controller
            control={control}
            rules={{
              required: "Phone number is required.",
              minLength: {
                value: 6,
                message: "Phone number must be at least 6 digits long.",
              },
              maxLength: {
                value: 15,
                message: "Phone number cannot exceed 15 digits.",
              },
              pattern: {
                value: /^[0-9]+$/,
                message: "Phone number can only contain numbers.",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Phone Number"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            )}
            name="phoneNumber"
          />
          {errors.phoneNumber && <Text>{errors.phoneNumber.message}</Text>}
          {/* Email */}
          <Controller
            control={control}
            rules={{
              required: "Email is required.",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address.",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            )}
            name="email"
          />
          {errors.email && <Text>{errors.email.message}</Text>}
          {/* Password */}
          <Controller
            control={control}
            rules={{
              required: "Password is required.",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long.",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
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
              />
            )}
            name="password"
          />
          {errors.password && <Text>{errors.password.message}</Text>}
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
              />
            )}
            name="confirmPassword"
          />
          {errors.confirmPassword && (
            <Text>{errors.confirmPassword.message}</Text>
          )}
          <Button onPress={handleSubmit(onSubmit)} mode="contained">
            <Text style={styles.buttonText}>Register</Text>
          </Button>
          {/* Sign Up Text */}
          <View>
            <Text>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("register")}>
              <Text>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  buttonText: {
    color: colors.white,
    fontSize: 16,
  },
  logo: {
    width: 50,
    height: 50,
  },
  logoptp: {
    width: 150,
    height: 150,
  },
});
export default RegisterScreen;
