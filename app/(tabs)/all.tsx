import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { useTheme } from "@react-navigation/native";
import Header from "@/components/Header copy";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/utils/constants";

const fakeUsers = [
  { id: "1", avatar: "https://i.pravatar.cc/300?img=1" },
  { id: "2", avatar: "https://i.pravatar.cc/300?img=2" },
  { id: "3", avatar: "https://i.pravatar.cc/300?img=3" },
];

interface Offre {
  _id: string;
  photos: string[];
  titre: string;
  prix: number;
  startDate: string;
  endDate: string;
  guideReview: string
  guideInfo:{
    _id: string,
    fullName: string

  }
}

const AllScreen = () => {
  const { colors } = useTheme();
  const [offres, setOffres] = useState<Offre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const response = await fetch("http:/192.168.1.16:4000/offres");
        const data = await response.json();
        setOffres(data);
      } catch (err) {
        console.error("Erreur API:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffres();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
// console.log(JSON.stringify(offres, null, 2),"**")
  return (
    <View style={styles.container}>
      <FlatList
        data={offres}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <>
            <Header title="Popular Packages" showAvatar showNotificationIcon />
            <Text style={styles.subTitle}>All Popular Trip Packages</Text>
          </>
        }
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Link href={`/details/${item._id}`} asChild>
            <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
              <View style={styles.card}>
                <Image
                  source={{ uri: item.photos[0] }}
                  style={styles.cardImage}
                />

                <View style={styles.cardContent}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={2}>
                      {item.titre}
                    </Text>

                    <View style={styles.priceTag}>
                      <Text style={styles.priceText}>{item.prix} TND</Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <MaterialIcons name="calendar-today" size={14} color="gray" />
                    <Text style={styles.dateText}>
                      {new Date(item.startDate).toLocaleDateString()} -{" "}
                      {new Date(item.endDate).toLocaleDateString()}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                      <MaterialIcons name="person" size={14} color="gray" />
                      <Text style={[styles.dateText, { marginRight: 20 }]}>
                        {item.guideInfo.fullName ?? "Guide"}
                      </Text> 
                      
                      {[...Array(3)].map((_, index) => (
                        <MaterialIcons key={index} name="star" size={14} color="#facc15" />
                      ))}
                      
                      <Text style={styles.ratingText}>{item.guideReview}</Text>
                    </View>


                  <View style={styles.infoRow}>
                    <View style={styles.avatarsContainer}>
                      {fakeUsers.map((user, index) => (
                        <Image
                          key={user.id}
                          source={{ uri: user.avatar }}
                          style={[styles.avatar, { marginLeft: index === 0 ? 0 : -8 }]}
                        />
                      ))}
                    </View>
                    <Text style={styles.participantsText}>24 Joined</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
};

export default AllScreen;

const styles = StyleSheet.create({
  container: {

    flex: 1,
    backgroundColor: colors.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    // color: "#64748b",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 1,
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  cardContent: {
    padding: 15,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginRight: 10,
  },
  priceTag: {
    backgroundColor: colors.primaryContainer,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  priceText: {
    fontSize: 12,
    color: colors.onPrimaryContainer,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  dateText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#64748b",
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#64748b",
  },
  avatarsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#fff",
  },
  participantsText: {
    fontSize: 12,
    color: "#64748b",
  },
});
