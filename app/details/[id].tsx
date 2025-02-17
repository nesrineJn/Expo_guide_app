import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";

const Details = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [offer, setOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: "Détails de l'offre" });
    const fetchOfferDetails = async () => {
      try {
        setIsLoading(true);
        fetch("http://192.168.192.166:4000/offres/" + id).then((response) =>
          response.json().then((json) => {
            setOffer(json);
          })
        );
      } catch (error) {
        console.error("Erreur lors du chargement des détails:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfferDetails();
  }, [id]);

  if (isError || !offer) {
    return (
      <View style={styles.errorContainer}>
        <Text>Erreur lors du chargement des détails de l'offre.</Text>
      </View>
    );
  }

  const renderImageItem = ({ item, index }) => {
    if (index < 4) {
      return <Image source={{ uri: item }} style={styles.thumbnail} />;
    } else if (index === 4) {
      return (
        <View style={styles.extraPhotosContainer}>
          <Image source={{ uri: item }} style={styles.thumbnail} />
          <View style={styles.overlay}>
            <Text style={styles.extraPhotosText}>
              +{offer.photos.length - 4}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <Image source={{ uri: offer.photos[0] }} style={styles.headerImage} />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{offer.titre}</Text>

        <Text style={styles.location}>
          <MaterialIcons name="location-on" size={14} color="gray" /> tunisia ,{" "}
          sidi bou said
        </Text>

        <View style={styles.infoRow}>
          <MaterialIcons name="star" size={14} color="gold" />
          <Text style={styles.ratingText}>4.5 (2498 avis)</Text>
          <Text style={styles.price}>{offer.prix} TND/Personne</Text>
        </View>

        <FlatList
          data={offer.photos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderImageItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photoList}
        />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {offer.description.replace(/<[^>]*>/g, "")}
        </Text>
      </View>

      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Réserver Maintenant</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerImage: { width: "100%", height: 250 },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#00000080",
    padding: 8,
    borderRadius: 20,
  },

  detailsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },

  title: { fontSize: 20, fontWeight: "bold" },
  location: { fontSize: 14, color: "gray", marginVertical: 5 },

  infoRow: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  ratingText: { marginLeft: 5, color: "gray" },
  price: {
    marginLeft: "auto",
    backgroundColor: "#FF7043",
    padding: 6,
    borderRadius: 10,
    color: "#fff",
  },

  photoList: { marginVertical: 10 },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 15,
    marginRight: 8,
  },
  extraPhotosContainer: {
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  extraPhotosText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  description: { fontSize: 14, color: "gray", marginTop: 10 },

  bookButton: {
    backgroundColor: "orange",
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 40,
  },
  bookButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default Details;
