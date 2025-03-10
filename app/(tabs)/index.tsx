import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Link, useNavigation } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import Header from "@/components/Header copy";

const fakeUsers = [
  { id: "1", avatar: "https://i.pravatar.cc/300?img=1" },
  { id: "2", avatar: "https://i.pravatar.cc/300?img=2" },
  { id: "3", avatar: "https://i.pravatar.cc/300?img=3" },
];

export default function HomeScreen() {
  const { colors } = useTheme();
  const [offres, setOffres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        setIsLoading(true);
        fetch("http://172.16.19.203:4000/offres")
          .then((response) => response.json())
          .then((json) => {
            setOffres(json);
            console.log("offressss", offres);
          });
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header showNotificationIcon showAvatar showLoginButton />

      <View style={styles.banner}>
        <Text style={[styles.bannerText, { color: colors.onBackground }]}>
          Discover Tunisia's Hidden{" "}
          <Text style={styles.bannerHighlight}>Treasures!</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Top Destinations
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("all")}
          >
            <Text style={[styles.viewAll]}>
              View all
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={offres}
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.destinationList}
          renderItem={({ item }) => (
            <Link href={`/details/${item._id}`} asChild>
            <TouchableOpacity style={styles.card}>

              <Image
                source={{ uri: item.photos[0] }}
                style={styles.cardImage}
                resizeMode="cover"
                onError={(error) =>
                  console.log("Erreur image:", error.nativeEvent)
                }
              />

              <View style={styles.cardContent}>
                <Text
                  style={[styles.cardTitle, { color: colors.onBackground }]}
                >
                  {item.titre}
                </Text>

                <View style={styles.locationRow}>
                  <Text
                    style={[styles.cardLocation, { color: colors.onSurface }]}
                  >
                    {item.categorie}
                  </Text>

                  <View style={styles.avatarsRow}>
                    {fakeUsers.slice(0, 3).map((user, index) => (
                      <Image
                        key={user.id}
                        source={{ uri: user.avatar }}
                        style={[
                          styles.avatar,
                          { marginLeft: index === 0 ? 0 : -10 },
                        ]}
                      />
                    ))}
                    {fakeUsers.length > 3 && (
                      <View style={styles.extraUsers}>
                        <Text style={styles.extraUsersText}>
                          +{fakeUsers.length - 3}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            </Link>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 4 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  banner: { marginVertical: 20, paddingHorizontal: 16 },
  bannerText: { fontSize: 28, fontWeight: "bold", lineHeight: 34 },
  bannerHighlight: { color: "#f97316" },

  section: { marginTop: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold" },
  viewAll:{
    color: "#f97316",
    fontWeight: "bold",
    // i want to add bottom border to this text
    textDecorationLine: "underline",

  }
,
  destinationList: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    width: 280,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFF",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardImage: { width: "100%", height: 250 },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  avatarsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  extraUsers: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -10,
  },
  extraUsersText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardLocation: {
    fontSize: 14,
    flex: 1,
  },
});
