import React from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
} from "react-native";

import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Link, useNavigation } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Header from "@/components/Header copy";
const fakeUsers = [
  { id: "1", avatar: "https://i.pravatar.cc/300?img=1" },
  { id: "2", avatar: "https://i.pravatar.cc/300?img=2" },
  { id: "3", avatar: "https://i.pravatar.cc/300?img=3" },
];

const all = () => {
  const { colors } = useTheme();
  const [offres, setOffres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        setIsLoading(true);
        fetch("http://192.168.1.16:4000/offres")
          .then((response) => response.json())
          .then((json) => {
            setOffres(json);
          });
        console.log("offres", offres);
      } catch (err) {
        console.error("Erreur API:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffres();
  }, []);

  return (
    <View style={styles.container}>
      <Header showBackButton title="Popular Packages" />

      {/* <Text style={styles.subTitle}>All Popular Trip Packages</Text> */}

      <FlatList
        data={offres}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Link href={`/details/${item._id}`} asChild>
            <Pressable>
              {({ pressed }) => (
                <View style={styles.card}>
                  <Image
                    source={{ uri: item.photos[0] }}
                    style={styles.cardImage}
                  />

                  <View style={styles.cardContent}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.title}>{item.titre}</Text>

                      <View style={styles.priceTag}>
                        <Text style={styles.priceText}>{item.prix} TND</Text>
                      </View>
                    </View>

                    <View style={styles.infoRow}>
                      <MaterialIcons
                        name="calendar-today"
                        size={14}
                        color="gray"
                      />
                      <Text style={styles.dateText}>
                        {new Date(item.startDate).toLocaleDateString()} -{" "}
                        {new Date(item.endDate).toLocaleDateString()}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.dateText}>mohamed</Text>
                      {[...Array(3)].map((_, index) => (
                        <MaterialIcons
                          key={index}
                          name="star"
                          size={14}
                          color="gold"
                        />
                      ))}
                      <Text style={styles.ratingText}>4.5</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.avatarsContainer}>
                        {fakeUsers.map((user, index) => (
                          <Image
                            key={user.id}
                            source={{ uri: user.avatar }}
                            style={[
                              styles.avatar,
                              { marginLeft: index === 0 ? 0 : -10 },
                            ]}
                          />
                        ))}
                      </View>
                      <Text style={styles.participantsText}>
                        24 People Joined
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", paddingHorizontal: 15 },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    flexDirection: "row",
    padding: 10,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: 100,
    height: 120,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    marginLeft: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  priceTag: {
    backgroundColor: "#FF70434D",
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  priceText: {
    color: "#FF7043",
    // fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  dateText: {
    marginLeft: 5,
    color: "gray",
    fontSize: 12,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 12,
    color: "gray",
  },
  avatarsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 5,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "white",
  },
  participantsText: {
    marginLeft: 5,
    color: "gray",
    fontSize: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default all;
