import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
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

dayjs.extend(utc);

const TouristEvents = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<string | null>(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredDates, setFilteredDates] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchUserAndEvents = async (isRefresh = false) => {
      try {
        if (!isRefresh) setLoading(true); // ✅ Afficher le loading uniquement si ce n'est pas un refresh
    
        const idUser = await SecureStore.getItemAsync("currentUser");
        if (!idUser) {
          setUser(null);
          setLoading(false);
          return;
        }
        setUser(idUser);
    
        const formattedDates = filteredDates.map(date => 
          dayjs.utc(date).startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        );
    
        const requestBody = formattedDates.length > 0 ? { dates: formattedDates } : {};
    
        const response = await fetch(
          `http://192.168.1.16:4000/reservations/byTouriste/${idUser}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          }
        );
    
        if (!response.ok) throw new Error("Erreur lors du chargement des événements");
    
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Erreur API:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setRefreshing(false); // ✅ Stop le refresh
      }
    };
    
    fetchUserAndEvents();
  }, [filteredDates]); 
  

  return (
    <View style={tw`flex-1`}>
      <Header showNotificationIcon showAvatar showLoginButton />
      <MiniCalendar onSelectDates={setFilteredDates} /> 

      {loading ? (
        <View style={tw`items-center justify-center flex-1`}>
          <ActivityIndicator size="large" color="orange" />
          <Text style={tw`mt-2 text-gray-500`}>Loading events...</Text>
        </View>
      ) : user ? (
        events.length > 0 ? (
          <FlatList
            data={events}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => <EventCard item={item} navigation={navigation} />}
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
