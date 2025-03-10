import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Appbar } from "react-native-paper";
import Avatar from "./display/Avatar";
import { scale } from "react-native-size-matters";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";

export interface HeaderProps {
  showBackButton?: boolean;
  showAvatar?: boolean;
  showNotificationIcon?: boolean;
  showLoginButton?: boolean; // ✅ Nouvelle prop pour afficher ou non le bouton Login
  onBackActionPressed?: () => void;
  onAvatarPressed?: () => void;
  onNotificationPressed?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({
  showBackButton = false,
  showAvatar = false,
  showNotificationIcon = false,
  showLoginButton = false, // ✅ Par défaut, il ne s'affiche pas
  onBackActionPressed,
  onAvatarPressed,
  onNotificationPressed,
  title = "",
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await SecureStore.getItemAsync("token");
      const avatar = await SecureStore.getItemAsync("avatar");
      if (token) {
        setIsLoggedIn(true);
        setUserAvatar(avatar || "https://i.pravatar.cc/300");
      } else {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const onBackActionClicked = useCallback(
    () =>
      typeof onBackActionPressed === "function"
        ? onBackActionPressed()
        : navigation.goBack(),
    [navigation, onBackActionPressed]
  );

  return (
    <Appbar.Header
      style={[styles.header, { backgroundColor: colors.background }]}
    >
      {/* ✅ Bouton de retour */}
      {showBackButton && (
        <TouchableOpacity
          onPress={onBackActionClicked}
          style={styles.backButton}
        >
          <Appbar.Action
            icon="arrow-left"
            size={scale(25)}
            color={colors.onSurface}
          />
        </TouchableOpacity>
      )}

      {/* ✅ Bouton Login à gauche, mais seulement si showLoginButton est vrai */}
      {!isLoggedIn && showLoginButton && (
        <TouchableOpacity style={styles.loginButton}>
          <Link href={`/login`} asChild>
            <Text style={styles.loginText}>Login</Text>
          </Link>
        </TouchableOpacity>
      )}

      {/* ✅ Titre centré */}
      <View style={styles.titleContainer}>
        <Text
          style={[styles.title, { color: colors.onSurface }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      {/* ✅ Icône de notification et avatar à droite */}
      <View style={styles.rightContainer}>
        {showNotificationIcon && (
          <TouchableOpacity
            onPress={onNotificationPressed}
            style={styles.iconButton}
          >
            <Appbar.Action
              icon="bell-outline"
              size={scale(25)}
              color={colors.onSurface}
            />
          </TouchableOpacity>
        )}

        {isLoggedIn && showAvatar && (
          <TouchableOpacity onPress={onAvatarPressed} style={styles.iconButton}>
            <Avatar user={userAvatar} size={30} />
          </TouchableOpacity>
        )}
      </View>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 0,
    shadowOpacity: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  backButton: {
    right: 25,
  },
  loginButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#f97316",
    borderRadius: 20,
    marginLeft: 10,
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  titleContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 10,
  },
});

export default Header;
