import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Appbar } from "react-native-paper";
import Avatar from "./display/Avatar";
import { scale } from "react-native-size-matters";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { colors } from "@/utils/constants";

export interface HeaderProps {
  showBackButton?: boolean;
  showAvatar?: boolean;
  showNotificationIcon?: boolean;
  showLoginButton?: boolean;
  onBackActionPressed?: () => void;
  onAvatarPressed?: () => void;
  onNotificationPressed?: () => void;
  title?: string;
  grandTitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  showBackButton = false,
  showAvatar = false,
  showNotificationIcon = false,
  showLoginButton = false,
  onBackActionPressed,
  onAvatarPressed,
  onNotificationPressed,
  title = "",
  grandTitle = "",
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");

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
      {isLoggedIn && showAvatar && (
        <TouchableOpacity onPress={onAvatarPressed} style={styles.avatarButton}>
          {/* @ts-expect-error */}
          <Avatar user={userAvatar} size={30} />
        </TouchableOpacity>
      )}

      {showBackButton && (
        <TouchableOpacity
          onPress={onBackActionClicked}
          style={styles.backButton}
        >
          <Appbar.Action
            icon="arrow-left"
            size={scale(25)}
            // color={colors.onSurface}
          />
        </TouchableOpacity>
      )}

      {!isLoggedIn && showLoginButton && (
        <TouchableOpacity style={styles.loginButton}>
          <Link href={`/login`} asChild>
            <Text style={styles.loginText}>Login</Text>
          </Link>
        </TouchableOpacity>
      )}

      <View style={styles.titleContainer}>
        {grandTitle ? (
          <Text style={[styles.grandTitle]}>{grandTitle}</Text>
        ) : (
          <Text style={[styles.title]}>{title}</Text>
        )}
      </View>

      {showNotificationIcon && (
        <TouchableOpacity
          onPress={onNotificationPressed}
          style={styles.iconButton}
        >
          <Appbar.Action icon="bell-outline" size={scale(25)} />
        </TouchableOpacity>
      )}
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
  avatarButton: {
    marginRight: 10,
  },
  backButton: {
    right: 10,
  },
  loginButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: colors.primary,
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
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  grandTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  iconButton: {
    marginLeft: 10,
  },
});

export default Header;
