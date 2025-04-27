import { colors } from "@/utils/constants";
import { View, Text, StyleSheet } from "react-native";

interface NotificationBadgeProps {
  unreadCount: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ unreadCount }) => {
  if (unreadCount <= 0) return null; // Ne rien afficher si aucune notif non lue

  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{unreadCount}</Text>
    </View>
  );
};

export default NotificationBadge;

const styles = StyleSheet.create({
  badgeContainer: {
    position: "absolute",
    top: 10,
    right: 8,
    backgroundColor: colors.error,
    borderRadius: 9999,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
