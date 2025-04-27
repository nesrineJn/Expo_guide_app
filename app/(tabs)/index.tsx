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

import { useEffect, useState } from "react";
import { Link, useNavigation } from "expo-router";
import Header from "@/components/Header copy";
import { colors } from "@/utils/constants";
;
import * as SecureStore from "expo-secure-store";
import PendingReviewModal from "../PendingReviewModal";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

const fakeUsers = [
  { id: "1", avatar: "https://i.pravatar.cc/300?img=1" },
  { id: "2", avatar: "https://i.pravatar.cc/300?img=2" },
  { id: "3", avatar: "https://i.pravatar.cc/300?img=3" },
];
const fakeGuides = [
  { id: "1", name: "Ahmed Ben Salah", avatar: "https://i.pravatar.cc/150?img=10", rating: 4.8 },
  { id: "2", name: "Sarah Mlika", avatar: "https://i.pravatar.cc/150?img=11", rating: 4.7 },
  { id: "3", name: "Mohamed Kefi", avatar: "https://i.pravatar.cc/150?img=12", rating: 4.9 },
];

export default function HomeScreen() {

  interface Offre {
    _id: string;
    photos: string[];
    titre: string;
    categorie: string;
  }

  const [offres, setOffres] = useState<Offre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigation = useNavigation();
  const [pendingReview, setPendingReview] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [topGuides, setTopGuides] = useState<any[]>([]);

  console.log(pendingReview)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
    
        const offresResponse = await fetch("http://192.168.1.16:4000/offres");
        const offresData = await offresResponse.json();
        setOffres(offresData);
    
        const idUser = await SecureStore.getItemAsync("currentUser");
        if (idUser) {
          const pendingResponse = await fetch(`http://192.168.1.16:4000/reservations/pending-reviews/${idUser}`);
          const pendingData = await pendingResponse.json();
          if (pendingData.length > 0) {
            setPendingReview(pendingData[0]);
            setShowReviewModal(true);
          }
        }
    
        // 🔥 Ici on ajoute guides
        const guidesResponse = await fetch("http://192.168.1.16:4000/users/top-guides");
        console.log(guidesResponse,'fff')
        const guidesData = await guidesResponse.json();
        setTopGuides(guidesData);
    
      } catch (err) {
        console.error("Erreur API:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header showNotificationIcon showAvatar showLoginButton  showTitle/>

      <View style={styles.banner}>
        <Text style={[styles.bannerText]}>
          Discover Tunisia's Hidden{" "}
          <Text style={styles.bannerHighlight}>Treasures!</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle]}>
            Top Destinations
          </Text>
          <TouchableOpacity
          //@ts-expect-error
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
                  style={[styles.cardTitle]}
                >
                  {item.titre}
                </Text>

                <View style={styles.locationRow}>
                  <Text
                    style={[styles.cardLocation]}
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
      <View style={styles.section}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Top Guides</Text>
    <TouchableOpacity
      onPress={() => {
        // Navigation vers la liste complète si besoin
      }}
    >
      <Text style={styles.viewAll}>View all</Text>
    </TouchableOpacity>
  </View>

  <FlatList
  horizontal
  data={topGuides}
  keyExtractor={(item) => item._id}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.destinationList}
  renderItem={({ item }) => (
    <View style={styles.guideCard}>
      <Image source={{ uri: item.profileImage }} style={styles.guideImage} />
      <Text style={styles.guideName}>{item.fullName}</Text>
      <View style={styles.guideRatingRow}>
        {/* Afficher les étoiles */}
        {[...Array(Math.floor(item.ratingAverage || 0))].map((_, index) => (
          <MaterialIcons
            key={index}
            name="star"
            size={14}
            color="#facc15"
          />
        ))}
        {/* Afficher la note à côté */}
        <Text style={styles.guideRatingText}>
          {item.ratingAverage?.toFixed(1) ?? "0.0"}
        </Text>
      </View>
    </View>
  )}
/>

</View>

      {pendingReview && (
  <PendingReviewModal
    visible={showReviewModal}
    pendingReview={pendingReview}
    onClose={() => setShowReviewModal(false)}
    onSubmitReview={(rating, comment) => {
      console.log("Envoyer le Review:", rating, comment);
      setShowReviewModal(false);
    }}
  />
)}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 4 , backgroundColor: colors.background },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  banner: { marginVertical: 15, paddingHorizontal: 16 },
  bannerText: { fontSize: 25, fontWeight: "700", lineHeight: 30 },
  bannerHighlight: { color: colors.primary },

  section: { marginTop: 5 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600" },
  viewAll:{
    color: colors.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",

  }
,
destinationList: {
  paddingHorizontal: 16,
  paddingBottom: 20, // pas 200 !
},

  card: {
    
    width: 280,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    // shadowRadius: 5,
  },
  cardImage: { width: "100%", height: 250 },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 15, fontWeight: "500", marginBottom: 4 },
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
  guideCard: {
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 16,
    alignItems: "center",
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  guideImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  guideName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
    color: "#1f2937",
  },
  guideRatingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  guideRatingText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#6b7280",
  },

});
