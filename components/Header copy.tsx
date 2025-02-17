import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Appbar } from "react-native-paper";
import Avatar from "./display/Avatar";
import { scale } from "react-native-size-matters";
import { Link } from "expo-router";

export interface HeaderProps {
  showBackButton?: boolean;
  showAvatar?: boolean;
  showNotificationIcon?: boolean;
  onBackActionPressed?: () => void;
  onAvatarPressed?: () => void;
  onNotificationPressed?: () => void;
  title?: string; // ✅ Ajout de la prop pour le titre
}

const Header: React.FC<HeaderProps> = ({
  showBackButton = false,
  showAvatar = false,
  showNotificationIcon = false,
  onBackActionPressed,
  onAvatarPressed,
  onNotificationPressed,
  title = "", // ✅ Titre par défaut vide
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  // Données fictives pour l'utilisateur
  const fakeUser = {
    _id: "1",
    avatar: "https://i.pravatar.cc/300", // URL d'un avatar fictif
    fullName: "John Doe",
  };

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
      {/* ✅ Bouton de retour à gauche */}
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

      {/* ✅ Titre centré */}
      <View style={styles.titleContainer}>
        <Text
          style={[styles.title, { color: colors.onSurface }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      {/* ✅ Avatar et icône de notification à droite */}
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
        {/* {showAvatar && (
          <TouchableOpacity onPress={onAvatarPressed} style={styles.iconButton}>
            <Avatar user={fakeUser.avatar} size={30} />
          </TouchableOpacity>
        )} */}
        *
        <TouchableOpacity onPress={() => {}}>
          <Link href={`/login`} asChild>
            <Text style={{ color: colors.onSurface }}>Login</Text>
          </Link>
        </TouchableOpacity>
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
  titleContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
