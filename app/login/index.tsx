import React from "react";
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
import Image from "@/components/display/Image";
import * as SecureStore from "expo-secure-store";
import { Link, Stack } from "expo-router";
import { router } from "expo-router"; 
import { colors } from "@/utils/constants";




export type LoginForm = {
  email: string;
  password: string;
};

const LoginScreen = ({ navigation }: any) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const { isLoading, startLoading, stopLoading } = useLoading();

  const handleLogin = async (data: any) => {
    startLoading();
    const { email, password,_id } = data;

    fetch("http:/192.168.1.16:4000/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Password or email incorrect");
        }
        return response.json();
      })
      .then(async (json) => {
        console.log(json, "json");
        await SecureStore.setItemAsync("token", json.access_token);
        await SecureStore.setItemAsync("email", email);
         await SecureStore.setItemAsync("currentUser",json._id)
         console.log(await SecureStore.getItemAsync("token"))
        const storedToken = await SecureStore.getItemAsync("token");
        console.log(storedToken, "storedToken");
        stopLoading();
        router.replace('/(tabs)')
      })
      .catch((error) => {
        console.log(error, "erreur");
        stopLoading();
        
      });
  };



  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Logo */}
  
          {/* <Text style={styles.title}>Login</Text> */}
          <Image
            source={require("../../assets/images/logo1.png")}
            style={styles.logo}
          />

        <Text style={styles.subtitle}>Welcome back! Please log in to continue.</Text>
          {/* Email Input */}
          <Controller
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
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
                style={styles.input}
              />
            )}
            name="email"
          />
          {errors.email && (
            <Text style={styles.errorText}>
              {errors.email.message}
            </Text>
          )}

          {/* Password Input */}
          <Controller
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
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
            <Text style={styles.errorText}>
              {errors.password.message}
            </Text>
          )}

          {/* Forgot Password Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <Button
            onPress={handleSubmit(handleLogin)}
            mode="contained"
            style={styles.signInButton}
            labelStyle={styles.signInButtonText}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Sign In"}
          </Button>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.dividerLine} />
          </View>


          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account?</Text>
            <Link href="/register" asChild>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Link>
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
   
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: colors.outline, // Couleur sombre pour le contraste
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.onBackground,
    marginBottom: 20,
    marginTop:20
  }
,  
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 160,
    alignSelf: "center",

  },
  input: {
    marginBottom: 20,
    backgroundColor: colors.background,
    // borderColor: colors.white[200],
  },
  errorText: {
    color: colors.error,
    marginBottom: 10,
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 6,
    marginBottom: 20,
  },
  signInButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outline,
  },
  dividerText: {
    marginHorizontal: 10,
    color: colors.outline,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.outline,
    height: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.outline,
    shadowColor: colors.onBackground,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
    marginBottom: 20,
  },
  googleButtonText: {
    fontWeight: "bold",
    color: colors.outline,
    fontSize: 16,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    color: colors.onBackground,
    fontSize: 14,
  },
  signUpLink: {
    color: colors.primary,
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default LoginScreen;