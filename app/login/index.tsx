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
import colors from "tailwindcss/colors";
import Image from "@/components/display/Image";
import * as SecureStore from "expo-secure-store";
import { Link, Stack } from "expo-router";
import { router } from "expo-router"; 



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

  const handleGoogleLogin = async () => {
    try {
      Alert.alert("Succès", "Connexion réussie avec Google!");
    } catch (error) {
      console.log(error, "erreur lors de la connexion avec Google");
      Alert.alert(
        "Erreur",
        "Échec de la connexion avec Google. Veuillez réessayer plus tard."
      );
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Logo */}
  
          {/* <Text style={styles.title}>Login</Text> */}
          <Image
            source={require("../../assets/images/logoguide.png")}
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
    color: colors.gray[900], // Couleur sombre pour le contraste
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: colors.gray[600], // Couleur plus douce pour l'effet pro
    marginBottom: 25,
  },
  
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  logo: {
    width: '50%',
    height: '35%',
    alignSelf: "center",

  },
  input: {
    marginBottom: 20,
    backgroundColor:colors.white,
    borderColor: colors.white[200],
  },
  errorText: {
    color: colors.red[500],
    marginBottom: 10,
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: colors.blue[500],
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: colors.orange[500],
    borderRadius: 10,
    paddingVertical: 6,
    marginBottom: 20,
  },
  signInButtonText: {
    color: colors.white,
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
    backgroundColor: colors.gray[300],
  },
  dividerText: {
    marginHorizontal: 10,
    color: colors.gray[500],
    fontSize: 14,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    height: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray[300],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
    marginBottom: 20,
  },
  googleButtonText: {
    fontWeight: "bold",
    color: colors.gray[700],
    fontSize: 16,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    color: colors.gray[500],
    fontSize: 14,
  },
  signUpLink: {
    color: colors.blue[500],
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default LoginScreen;