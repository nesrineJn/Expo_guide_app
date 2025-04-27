import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Appbar } from "react-native-paper";
import Avatar from "./display/Avatar";
import { scale } from "react-native-size-matters";
import { Link } from "expo-router";
import { colors } from "@/utils/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export interface HeaderProps {
  showBackButton?: boolean;
  showAvatar?: boolean;
  showNotificationIcon?: boolean;
  showLoginButton?: boolean;
  showTitle?: boolean; // <-- 🆕 nouveau props
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
  showTitle = false, // <-- 🆕 par défaut false
  onBackActionPressed,
  onAvatarPressed,
  onNotificationPressed,
  title = "",
  grandTitle = "",
}) => {
  const navigation = useNavigation();
  const { userData } = useCurrentUser(); 

  const onBackActionClicked = useCallback(
    () =>
      typeof onBackActionPressed === "function"
        ? onBackActionPressed()
        : navigation.goBack(),
    [navigation, onBackActionPressed]
  );

  const defaultAvatar = "https://i.pravatar.cc/300";

  // 🆕 extraire prénom si besoin
  const getFirstName = (fullName: string) => {
    if (!fullName) return "";
    return fullName.split(" ")[0]; // premier mot
  };

  return (
    <Appbar.Header style={[styles.header, { backgroundColor: colors.background }]}>
      {userData && showAvatar && (
        <TouchableOpacity onPress={onAvatarPressed} style={styles.avatarButton}>
        
          <Avatar user={userData} size={30} />
        </TouchableOpacity>
      )}

      {showBackButton && (
        <TouchableOpacity
          onPress={onBackActionClicked}
          style={styles.backButton}
        >
          <Appbar.Action icon="arrow-left" size={scale(25)} />
        </TouchableOpacity>
      )}

      {!userData && showLoginButton && (
        <TouchableOpacity style={styles.loginButton}>
          <Link href={`/login`} asChild>
            <Text style={styles.loginText}>Login</Text>
          </Link>
        </TouchableOpacity>
      )}

      <View style={styles.titleContainer}>
        {grandTitle ? (
          <Text style={[styles.grandTitle]}>{grandTitle}</Text>
        ) : showTitle && userData ? (
          <Text style={styles.bonjourText}>
            Bonjour, {getFirstName(userData.fullName).toLowerCase()} 👋
          </Text> // <-- 🆕 Bonjour prénom 👋
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
    color: "#000",
  },
  grandTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bonjourText: { // <-- 🆕 style pour Bonjour
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "capitalize",
  },
  iconButton: {
    marginLeft: 10,
  },
});

export default Header;
