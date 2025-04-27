import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TextInput,
} from "react-native";
import { Text } from "react-native-paper";
import {
  CardField,
  CardFieldInput,
  useStripe,
} from "@stripe/stripe-react-native";

import { colors } from "@/utils/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const AddCardScreen = () => {
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(
    null
  );
  const [cardHolderName, setCardHolderName] = useState("");
  const [isCardComplete, setIsCardComplete] = useState(false);

  const stripe = useStripe();
  //ya maher hedha current user mena djibou  
  const currentUser = useCurrentUser()
  const userId = currentUser.userData?._id;
//   console.log(userId)
    const handleAddCard = async () => {
    // if (!cardDetails?.complete || !cardHolderName.trim()) {
    //   alert("Veuillez remplir toutes les informations.");
    //   return;
    // }
  
    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: { name: cardHolderName },
        },
      });
  
      if (error || !paymentMethod) {
        alert(error?.message || "Erreur lors de la création du moyen de paiement.");
        return;
      }
  
      // Ici APPEL À TON BACKEND
      const body = {
        paymentMethodId: paymentMethod.id,
        cardHolderName: cardHolderName,
        userId: userId, 
      };
  
      console.log("Sending body to /add-card:", body);
  
      const response = await fetch("http://192.168.1.16:4000/stripe/add-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        //   Authorization: `Bearer ${currentUser.token}`, // si besoin d'un token
        },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Votre carte a été ajoutée avec succès !");
      } else {
        console.error(data);
        alert(data.message || "Erreur lors de l'ajout de la carte.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout de la carte.");
    }
  };
  

  const formatCardNumber = (number: string | undefined) => {
    if (!number) return "**** **** **** ****";
    const cleanNumber = number.replace(/\s/g, "");
    const formatted = cleanNumber.replace(/(.{4})/g, "$1 ").trim();
    return formatted.length < 19
      ? formatted + "*".repeat(19 - formatted.length)
      : formatted;
  };

  const formatExpiryDate = (
    month: number | undefined,
    year: number | undefined
  ) => {
    if (!month || !year) return "MM/YY";
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedYear = year.toString().slice(-2);
    return `${formattedMonth}/${formattedYear}`;
  };

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Carte de prévisualisation */}
        <View style={styles.cardImageContainer}>
          <ImageBackground
            source={require("@/assets/images/card.png")}
            style={styles.card}
            imageStyle={styles.cardImage}
          >
            <View style={styles.cardNumberContainer}>
              <Text style={styles.cardNumberText}>
                {formatCardNumber(cardDetails?.number)}
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.cardHolderNameText}>
                {cardHolderName || "Nom du titulaire"}
              </Text>
              <Text style={styles.expiryDateText}>
                {formatExpiryDate(
                  cardDetails?.expiryMonth,
                  cardDetails?.expiryYear
                )}
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          <Text style={styles.label}>Nom du titulaire</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom du titulaire"
            placeholderTextColor="#9ca3af"
            value={cardHolderName}
            onChangeText={setCardHolderName}
          />

          <Text style={styles.label}>Détails de la carte</Text>
          <CardField
            postalCodeEnabled={false}
            placeholders={{ number: "4242 4242 4242 4242" }}
            cardStyle={{
                backgroundColor: "#f9fafb",
                textColor: "#1e293b",
                placeholderColor: "#9ca3af",
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 12,
            }}
            style={styles.cardContainer}
            onCardChange={(details) => {
                setIsCardComplete(details.complete ?? false); 
            }}
            />


            <TouchableOpacity
            style={[
                styles.button,
                (!cardHolderName || !cardDetails?.complete) && {
                // backgroundColor: "#cbd5e1",
                },
            ]}
            onPress={handleAddCard}
            // disabled={!cardHolderName || !cardDetails?.complete}
            >
            <Text style={styles.buttonText}>Ajouter Carte</Text>
            </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

export default AddCardScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    padding: 16,
    alignItems: "center",
  },
  cardImageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  cardNumberContainer: {
    position: "absolute",
    top: "70%",
    left: 25,
  },
  cardNumberText: {
    color: "#fff",
    fontSize: 18,
    letterSpacing: 3,
  },

  card: {
    width: 395,
    height: 235,
    borderRadius: 16,
    padding: 25,
    overflow: "hidden",
  },
  cardImage: {
    borderRadius: 16,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  cardHolderNameText: {
    color: "#fff",
    fontSize: 16,
  },
  expiryDateText: {
    color: "#fff",
    fontSize: 14,
    position: "absolute",
    bottom: 1,
    right: 15,
  },

  form: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#1e293b",
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    color: "#1e293b",
  },
  cardContainer: {
    height: 50,
    marginBottom: 24,
    borderRadius: 12,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    alignItems: "center",
    borderRadius: 12,
    marginTop: "60%",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
