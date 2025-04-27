import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Modal as ModalPhoto,
} from "react-native";
import React, { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import {
  Portal,
  Button,
  useTheme,
  ActivityIndicator,
  Modal,
} from "react-native-paper";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as SecureStore from "expo-secure-store";

import { Alert } from "react-native";
import { colors } from "@/utils/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageViewer from "react-native-image-zoom-viewer";
import { tr } from "date-fns/locale";
const Details = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { colors } = useTheme();
  interface Offer {
    photos: string[];
    titre: string;
    prix: number;
    description: string;
    guideId: {
      _id: string;
      fullName: string;
      email: string;
      profileImage: string;
    };
  }

  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reservationType, setReservationType] = useState("personal");
  const [numPlaces, setNumPlaces] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  interface Reservation {
    _id: string;
    numberOfPersons: number;
    status: string;
  }

  const [reservation, setReservation] = useState<Reservation | null>(null);
  useEffect(() => {
    navigation.setOptions({ title: "Détails de l'offre" });

    const fetchOfferDetails = async () => {
      const token = await SecureStore.getItemAsync("token");
      setToken(token);
      try {
        setIsLoading(true);
        fetch(`http:/192.168.1.16:4000/offres/${id}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Erreur lors du chargement des détails.");
            }
            return response.json();
          })
          .then((json) => {
            setOffer(json);
          });
      } catch (error) {
        console.error("Erreur lors du chargement des détails:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    const checkReservation = async () => {
      const idUser = await SecureStore.getItemAsync("currentUser");
      if (!idUser) return;

      try {
        const response = await fetch(
          "http:/192.168.1.16:4000/reservations/getByOfferAndTouristId",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              touristId: idUser,
              offerId: id,
            }),
          }
        );

        if (response.ok) {
          const resData = await response.json();

          // console.log("resData", response);
          if (resData.length > 0) {
            setReservation(resData[0]);
          }
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "Invalid number of seats. Please enter a valid number."
        );
        console.error(
          "Erreur lors de la récupération de la réservation:",
          error
        );
      }
    };

    fetchOfferDetails();
    checkReservation();
  }, [id]);

  const handleReservation = async () => {
    setIsModalVisible(true);
    if (!token) return router.replace("/login");
  };

  const closeModal = async () => {
    const placesToSend = reservationType === "personal" ? 1 : Number(numPlaces);

    if (!placesToSend || isNaN(placesToSend) || placesToSend <= 0) {
      alert("Please enter a valid number of places.");
      return;
    }

    setIsModalVisible(false);
    const idUser = await SecureStore.getItemAsync("currentUser");

    console.log("Sending data:", {
      touristId: idUser,
      offerId: id,
      numberOfPersons: placesToSend,
    });

    try {
      const response = await fetch("http:/192.168.1.16:4000/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          touristId: idUser,
          offerId: id,
          numberOfPersons: placesToSend,
        }),
      });

      const responseText = await response.text();
      // console.log("Raw server response:", responseText);

      if (!response.ok) {
        console.error("Server Error:", response.status, response.statusText);
        throw new Error("Error creating reservation.");
      }

      const json = JSON.parse(responseText);
      // console.log("Server response:", json)

      setReservation(json);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (reservationType === "personal") {
      setNumPlaces("1");
    } else if (
      reservationType === "group" &&
      (!numPlaces || numPlaces === "1")
    ) {
      setNumPlaces("");
    }
  }, [reservationType]);

  const handleUpdateReservation = () => {
    if (!reservation) return;

    const isGroup = reservation.numberOfPersons > 1;

    setReservationType(isGroup ? "group" : "personal");
    setNumPlaces(isGroup ? String(reservation.numberOfPersons) : "");

    setIsModalVisible(true);
  };

  const updateReservation = async () => {
    if (!reservation) return;

    try {
      const response = await fetch(
        `http:/192.168.1.16:4000/reservations/${reservation._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ numberOfPersons: numPlaces }),
        }
      );

      if (!response.ok) throw new Error("Error updating reservation.");

      console.log("Reservation updated successfully!");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleCancelReservation = () => {
    if (!reservation) return;

    Alert.alert(
      "Cancel Reservation",
      "Are you sure you want to cancel this reservation? This action cannot be undone.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `http:/192.168.1.16:4000/reservations/${reservation._id}`,
                {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                }
              );

              if (!response.ok) throw new Error("Error canceling reservation.");

              console.log("Reservation canceled successfully!");
              setReservation(null);
            } catch (error) {
              console.error("Cancel failed:", error);
            }
          },
        },
      ]
    );
  };

  if (isError || !offer) {
    return (
      <View style={styles.errorContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  // console.log(JSON.stringify(offer, null, 2))

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => {
            setSelectedImageIndex(0);
            setIsImageViewerVisible(true);
          }}
        >
          <Image source={{ uri: offer.photos[0] }} style={styles.headerImage} />
        </TouchableOpacity>

        <View style={styles.detailsContainer}>
          <TouchableOpacity
            style={styles.guideContainer}
            onPress={() =>
              router.push({
                pathname: "/GuideProfileScreen",
                params: {
                  id: offer.guideId._id,
                  name: offer.guideId.fullName,
                  email: offer.guideId.email,
                  profileImage: offer.guideId.profileImage,
                },
              })
            }
          >
            <Image
              source={{ uri: offer.guideId.profileImage || "" }}
              style={styles.avatar}
            />
            <View style={styles.guideInfo || ""}>
              <Text style={styles.guideName}>
                {offer.guideId.fullName || ""}
              </Text>
              <Text style={styles.guideEmail}>{offer.guideId.email || ""}</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>{offer.titre}</Text>

          <Text style={styles.location}>
            <MaterialIcons name="location-on" size={14} color="gray" /> Tunisia,
            Sidi Bou Said
          </Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="star" size={14} color="gold" />
            <Text style={styles.ratingText}>4.5 (2498 avis)</Text>
            <Text style={styles.price}>{offer.prix} TND/Personne</Text>
          </View>

          <FlatList
            data={offer.photos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedImageIndex(index);
                  setIsImageViewerVisible(true);
                }}
              >
                <Image source={{ uri: item }} style={styles.thumbnail} />
              </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photoList}
          />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {offer.description.replace(/<[^>]*>/g, "")}
          </Text>
        </View>

        {/* <TouchableOpacity style={styles.bookButton} onPress={handleReservation}>
          <Text style={styles.bookButtonText}>Réserver Maintenant</Text>
        </TouchableOpacity> */}
      </ScrollView>
      <View style={styles.fixedButtonContainer}>
        {reservation ? (
          reservation.status === "CANCELED" ? (
            <Text style={styles.cancelledText}>
              This reservation has been canceled.
            </Text>
          ) : reservation.status === "ONGOING" ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => handleUpdateReservation()}
              >
                <Text style={styles.bookButtonText}>Update</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelReservation}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : null
        ) : (
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleReservation}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        )}
      </View>

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Select Reservation Type</Text>

          <View style={styles.choiceContainer}>
            <TouchableOpacity
              style={[
                styles.choiceButton,
                reservationType === "personal" && styles.selectedChoice,
              ]}
              onPress={() => setReservationType("personal")}
            >
              <Text
                style={[
                  styles.choiceText,
                  reservationType === "personal" && styles.selectedText,
                ]}
              >
                Personal Reservation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.choiceButton,
                reservationType === "group" && styles.selectedChoice,
              ]}
              onPress={() => setReservationType("group")}
            >
              <Text
                style={[
                  styles.choiceText,
                  reservationType === "group" && styles.selectedText,
                ]}
              >
                Group Reservation
              </Text>
            </TouchableOpacity>
          </View>

          {reservationType === "group" && (
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Number of seats"
              value={numPlaces}
              onChangeText={setNumPlaces}
            />
          )}

          <Button
            mode="contained"
            onPress={reservation ? updateReservation : closeModal}
            style={styles.confirmButton}
          >
            {reservation ? "Update Reservation" : "Confirm"}
          </Button>
        </Modal>
      </Portal>
      <ModalPhoto
        visible={isImageViewerVisible}
        onDismiss={() => setIsImageViewerVisible(false)}
        transparent={true}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
          <ImageViewer
            imageUrls={offer.photos.map((url) => ({ url }))}
            index={selectedImageIndex}
            enableSwipeDown
            onSwipeDown={() => setIsImageViewerVisible(false)}
            onCancel={() => setIsImageViewerVisible(false)}
          />
        </SafeAreaView>
      </ModalPhoto>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerImage: { width: "100%", height: 250 },
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
    backgroundColor: colors.primaryContainer,
    padding: 4,
    borderRadius: 10,
    color: colors.onPrimaryContainer,
  },
  photoList: { marginVertical: 10 },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 15,
    marginRight: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  description: { fontSize: 14, color: "gray", marginTop: 10 },
  bookButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    width: "90%",
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  bookButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    marginTop: 580,
    minHeight: 250,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,

    width: "100%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  choiceContainer: { flexDirection: "row", justifyContent: "space-between" },
  choiceButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    flex: 1,
    alignItems: "center",
  },
  selectedChoice: { borderColor: colors.primary },
  choiceText: { fontSize: 14, fontWeight: "bold" },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 8,
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "lightgray",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderColor: colors.primary,
    borderWidth: 2,
    paddingVertical: 8,
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.primary,
    fontWeight: "bold",
  },

  updateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelledText: {},
  selectedText: {},
  guideContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    paddingHorizontal: 0,
    // borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "lightgray",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  guideInfo: {
    flex: 1,
  },
  guideName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  guideEmail: {
    fontSize: 14,
    color: "gray",
  },
});

export default Details;
