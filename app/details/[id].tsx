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
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
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
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PaymentRequiredModal from "../PaymentRequiredModal";
import { showMessage } from "react-native-flash-message";
import RenderHTML from "react-native-render-html";

import { useWindowDimensions } from "react-native";

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
    guideReview: string;
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
  const { width } = useWindowDimensions();
  const [address, setAddress] = useState<string | null>(null);

  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            "User-Agent": "YourAppNameHere/1.0", // ✨ ajoute un nom d'app ici
            "Accept-Language": "fr", // facultatif si tu veux que l'adresse soit en français
          },
        }
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de l'adresse");
      }
      const data = await response.json();
      setAddress(data.display_name);
    } catch (error) {
      console.error("Erreur de géocodage inverse :", error);
    }
  };

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
            if (json.location && Array.isArray(json.location)) {
              fetchAddress(json.location[0], json.location[1]);
            }
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
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [pendingReservation, setPendingReservation] = useState<{
    touristId: string;
    offerId: string;
    numberOfPersons: string;
  } | null>(null);

  const { userData, isLoading: isUserLoading } = useCurrentUser();
  const hasCart = userData?.hasCart;
  console.log(userData?.hasCart);
  // const hasCard = false;

  const closeModal = async () => {
    const placesToSend = reservationType === "personal" ? 1 : Number(numPlaces);

    if (!placesToSend || isNaN(placesToSend) || placesToSend <= 0) {
      alert("Veuillez entrer un nombre valide de places.");
      return;
    }

    setIsModalVisible(false);

    const idUser = await SecureStore.getItemAsync("currentUser");

    if (hasCart) {
      try {
        const response = await fetch("http://192.168.1.16:4000/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            touristId: idUser,
            offerId: id,
            numberOfPersons: placesToSend,
          }),
        });

        const responseText = await response.text();
        if (!response.ok) throw new Error(responseText);

        const json = JSON.parse(responseText);
        setReservation(json);
        showMessage({
          message: "Réservation en attente ⏳",
          description:
            "Votre réservation est en attente de confirmation du guide. 🤝",
          type: "warning",
          duration: 4000,
        });
      } catch (error: any) {
        console.error("Erreur de réservation:", error);

        const message = error.message?.toLowerCase();
        const isPlacesError =
          message?.includes("number of persons exceeds") ||
          message?.includes("maximum limit") ||
          message?.includes("place");

        showMessage({
          message: "Erreur ❗",
          description: isPlacesError
            ? "Nombre de places insuffisant pour effectuer la réservation. 🚫"
            : "Erreur lors de la création de la réservation.",
          type: "danger",
          duration: 4000,
        });
      }
    } else {
      setIsPaymentModalVisible(true);
      setPendingReservation({
        touristId: idUser,
        offerId: id,
        numberOfPersons: placesToSend.toString(),
      });
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

      showMessage({
        message: "Réservation mise à jour ✅",
        description: "Le nombre de places a été modifié avec succès.",
        type: "success",
        duration: 4000,
      });
    } catch (error: any) {
      console.error("Update failed:", error);

      const message = error.message?.toLowerCase();
      const isPlacesError =
        message?.includes("number of persons exceeds") ||
        message?.includes("maximum limit") ||
        message?.includes("place");

      showMessage({
        message: "Erreur ❗",
        description: isPlacesError
          ? "Nombre de places insuffisant pour mettre à jour. 🚫"
          : "Impossible de mettre à jour la réservation.",
        type: "danger",
        duration: 4000,
      });
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

              showMessage({
                message: "Réservation annulée ❌",
                description: "Votre réservation a été annulée avec succès.",
                type: "danger",
                duration: 4000,
              });
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
  console.log(JSON.stringify(offer, null, 2));

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
          <Text style={styles.title}>{offer.titre}</Text>
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
            <View style={styles.guideInfo}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.guideName}>
                  {offer.guideId.fullName || ""}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 15,
                  }}
                >
                  <MaterialIcons
                    name="star"
                    size={16}
                    color="gold"
                    style={{ marginRight: 2 }}
                  />
                  <Text style={styles.ratingText}>{offer.guideReview || "N/N"}</Text>
                </View>
              </View>
              <Text style={styles.guideEmail}>{offer.guideId.email || ""}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Prix: </Text>
            <Text style={styles.price}>{offer.prix} TND/Personne</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <MaterialIcons
              name="location-on"
              size={14}
              color="gray"
              style={{ marginRight: 4 }}
            />
            <Text
              style={styles.location}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {address || "Chargement..."}
            </Text>
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
          <View style={{ marginTop: 5 }}>
            <RenderHTML
              contentWidth={width}
              source={{ html: offer.description }}
              baseStyle={styles.description}
            />
          </View>
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
        <ModalPhoto
          visible={isModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContent}
            >
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Select Reservation Type</Text>
                  <View style={{ width: 24 }} /> {/* équilibre */}
                </View>

                {/* Le reste du contenu */}
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

                {/* input si group */}
                {reservationType === "group" && (
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Number of seats"
                    value={numPlaces}
                    onChangeText={setNumPlaces}
                  />
                )}

                {/* bouton de validation */}
                <Button
                  mode="contained"
                  onPress={reservation ? updateReservation : closeModal}
                  style={styles.confirmButton}
                >
                  {reservation ? "Update Reservation" : "Confirm"}
                </Button>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </ModalPhoto>
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
      <PaymentRequiredModal
        visible={isPaymentModalVisible}
        onClose={() => setIsPaymentModalVisible(false)}
        onConfirm={() => {
          if (pendingReservation) {
            router.push({
              pathname: "/AddCardScreen",
              params: pendingReservation,
            });
            setIsPaymentModalVisible(false);
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
    width: "100%",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },

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
    marginLeft: 3,
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
    paddingTop: 12,
    paddingHorizontal: 0,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "lightgray",
    marginBottom: 10,
    backgroundColor: "#fff",
    marginTop: 15,
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
