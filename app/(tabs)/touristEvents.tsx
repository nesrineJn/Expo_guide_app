import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import * as SecureStore from "expo-secure-store";
import dayjs from "dayjs";

import MiniCalendar from "@/components/calenderHeader";
import EventCard from "@/components/eventCard";
import tw from "@/utils/tailwind copy";
import Header from "@/components/Header copy";
import utc from "dayjs/plugin/utc";
import { colors } from "@/utils/constants";

dayjs.extend(utc);

const TouristEvents = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<string | null>(null);
  interface Event {
    _id: string;
    status: string;
    numberOfPersons: number;
    createdAt: string;
    offerId: {
      _id: string;
      titre: string;
      startDate: string;
      location?: string;
      photos?: string[];
    };
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredDates, setFilteredDates] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserAndEvents = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);

      const idUser = await SecureStore.getItemAsync("currentUser");
      if (!idUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(idUser);

      const formattedDates = filteredDates.map((date) =>
        dayjs.utc(date).startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
      );

      const requestBody =
        formattedDates.length > 0 ? { dates: formattedDates } : {};

      const response = await fetch(
        `http:/192.168.1.16:4000/reservations/byTouriste/${idUser}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) throw new Error("Error while loading events");

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error("API Error:", err);
      //@ts-expect-error
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserAndEvents();
  }, [filteredDates]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserAndEvents(true);
  };

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.background}]}>
      <Header
        showNotificationIcon
        showAvatar
        showLoginButton
        grandTitle="Tourist Reservations"
      />
      <MiniCalendar onSelectDates={setFilteredDates} />

      {loading ? (
        <View style={tw`items-center justify-center flex-1`}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={tw`mt-2 text-gray-500`}>Loading events...</Text>
        </View>
      ) : user ? (
        events.length > 0 ? (
          <FlatList
            data={events}
            keyExtractor={(item) => item._id.toString()}
           
            renderItem={({ item }) => (
               //@ts-expect-error
              <EventCard item={item} navigation={navigation} />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        ) : (
          <View style={tw`items-center justify-center flex-1`}>
            <MaterialIcons name="event-busy" size={50} color="gray" />
            <Text style={tw`mt-4 text-sm text-center text-gray-400`}>
              No events scheduled for this date.
            </Text>
          </View>
        )
      ) : (
        <View style={tw`items-center justify-center flex-1`}>
          <MaterialIcons name="lock-outline" size={50} color="gray" />
          <Text style={tw`mt-4 text-sm text-center text-gray-400`}>
            Please log in to view your scheduled events.
          </Text>
        </View>
      )}
    </View>
  );
};

export default TouristEvents;
