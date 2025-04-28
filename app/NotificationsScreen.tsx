import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Animated,
} from "react-native";
import {
  Swipeable,
  RectButton,
  FlatList,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import moment from "moment";
import { showMessage } from "react-native-flash-message";
import { colors } from "@/utils/constants";
import Pusher from 'pusher-js/react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "alert" | "success";
}

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
const currentUser= useCurrentUser();
const userId = currentUser.userData?._id;
// console.log(userId)
//   const userId =" userData._id"; 


  const fetchNotifications = useCallback(async () => {
    try {
      if (!userId) return;

      const res = await fetch(`http://192.168.1.16:4000/notifs?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });


      if (res.status === 201 || res.status === 200) {
        const dataJson = await res.json();
        // console.log(dataJson)
        const data = dataJson.map((notif: any) => ({
          id: notif._id,
          title: notif.title,
          message: notif.message,
          time: notif.createdAt,
          read: notif.read,
          type: notif.type,
        }));
        setNotifications(data);
      } else {
        console.error("Erreur de chargement des notifications");
      }
    } catch (error) {
      console.error("Erreur fetch notifications:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();

    const pusher = new Pusher("1589737c361949f5beae", {
      cluster: "eu",
      forceTLS: true,
    });

    const channel = pusher.subscribe(`guide-${userId}`);
    channel.bind("new reservation", (data: any) => {
      setNotifications((prev) => [...prev, data]);
    });
    channel.bind("subscribtion", (data: any) => {
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [fetchNotifications, userId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
  };

  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch(`http://192.168.1.16:4000/notifs/${id}`, {
        method: "DELETE",
      });
    //   console.log(res)

      if (res.ok) {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        showMessage({
          message: "Notification supprimée",
          type: "success",
        });
      } else {
        throw new Error("Erreur de suppression");
      }
    } catch (error) {
      console.error("Erreur delete notification:", error);
      showMessage({
        message: "Erreur lors de la suppression",
        type: "danger",
      });
    }
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return { name: "info", color: "#3B82F6" }; 
      case "alert":
        return { name: "warning", color: "#F59E0B" };
      case "success":
        return { name: "check-circle", color: "#10B981" };
      default:
        return { name: "notifications", color: colors.primary };
    }
  };

  const renderRightActions = (progress: any, dragX: any, item: Notification) => (
    <View style={styles.rightAction}>
      <RectButton style={styles.deleteButton} onPress={() => deleteNotification(item.id)}>
        <MaterialIcons name="delete" size={30} color="#fff" />
      </RectButton>
    </View>
  );

  const renderItem = ({ item }: { item: Notification }) => {
    const { name, color } = getIcon(item.type);
  
    return (
      <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}>
        <TouchableOpacity activeOpacity={0.8}>
          <View style={styles.itemContainer}>
            <View style={styles.iconWrapper}>
            
              <MaterialIcons name={name} size={28} color={color} />
            </View>
            <View style={styles.textWrapper}>
             
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{moment(item.time).fromNow()}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };
  
  

  return (
    <GestureHandlerRootView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucune notification.</Text>
            </View>
          }
        />
      )}
    </GestureHandlerRootView>
  );
};

export default NotificationsScreen;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      backgroundColor: "#f9fafb",
    },
    itemContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: "#fff",
      padding: 16,
      borderRadius: 12,
      marginVertical: 6,
      borderWidth: 1,
      borderColor: "#e5e7eb",
    },
    iconWrapper: {
        backgroundColor: "#f1f5f9",
        padding: 10,
        borderRadius: 12,
        marginRight: 14,
        justifyContent: "center",
        alignItems: "center",
      },
      
    textWrapper: {
      flex: 1,
      flexDirection: "column",
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: "#111827",
  
    },
    message: {
      fontSize: 14,
      color: "#4b5563",
      marginBottom: 8,
    },
    time: {
      fontSize: 12,
      color: "#9ca3af",
    },
    rightAction: {
      justifyContent: "center",
      alignItems: "flex-end",
      marginVertical: 6,
    },
    deleteButton: {
      backgroundColor: "#ef4444",
      justifyContent: "center",
      alignItems: "center",
      width: 70,
      height: "100%",
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 50,
    },
    emptyText: {
      fontSize: 16,
      color: "#9ca3af",
    },
  });
  
  
