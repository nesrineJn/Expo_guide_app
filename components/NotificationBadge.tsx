import { colors } from "@/utils/constants";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const NotificationBadge = () => {
  const { userData } = useCurrentUser();
  const userId = userData?._id;
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!userId) return;

        const response = await fetch(`http://192.168.1.16:4000/notifs?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setNotificationCount(data.length); 
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  if (loading || !userId) return null; // pendant le chargement, rien afficher

  if (notificationCount <= 0) return null; // aucune notif => rien

  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{notificationCount}</Text>
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
