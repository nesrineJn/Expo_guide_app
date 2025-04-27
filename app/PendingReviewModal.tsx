import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/utils/constants";
import * as SecureStore from "expo-secure-store";
interface PendingReviewModalProps {
  visible: boolean;
  onClose: () => void;
  pendingReview: {
    reservationId: string;
    offerTitle: string;
    offerId: string;
    offerEndDate: string;
  } | null;
  onSubmitReview: (rating: number, comment: string) => void;
}

const PendingReviewModal: React.FC<PendingReviewModalProps> = ({
  visible,
  onClose,
  pendingReview,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleStarPress = (value: number) => {
    setRating(value);
  };
  const handleCancel = async () => {
    if (pendingReview) {
      try {
        await fetch(
          `http://192.168.1.16:4000/reservations/mark-reviewed/${pendingReview.reservationId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (error) {
        console.error("Erreur lors du marquage comme revu", error);
      }
    }
    onClose(); // Fermer normalement après
  };

  const handleSubmit = async () => {
    if (rating > 0 && comment.trim() !== "" && pendingReview) {
      try {
        const userId = await SecureStore.getItemAsync("currentUser"); 
        if (!userId) {
          alert("Utilisateur non connecté !");
          return;
        }

        const body = {
          userId: userId,
          offreId: pendingReview.offerId,
          rating: rating,
          comment: comment,
          reservationId :pendingReview.reservationId,
        };
        console.log(body);
        const response = await fetch("http://192.168.1.16:4000/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi de l'avis");
        }

        // Si tout est OK
        alert("Merci pour votre avis !");
        onSubmitReview(rating, comment); // appel de ta fonction callback
        setRating(0);
        setComment("");
        onClose();
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'avis:", error);
        alert("Erreur lors de l'envoi de l'avis");
      }
    } else {
      alert("Veuillez donner une note et écrire un commentaire.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Laisser un avis</Text>
          <Text style={styles.subtitle}>
            Partagez votre expérience sur{" "}
            <Text style={styles.bold}>{pendingReview?.offerTitle}</Text>
          </Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((index) => (
              <Pressable
                key={index}
                onPress={() => handleStarPress(index)}
                style={({ pressed }) => [
                  styles.starButton,
                  pressed && { transform: [{ scale: 1.2 }] },
                ]}
              >
                <MaterialIcons
                  name={index <= rating ? "star" : "star-border"}
                  size={32}
                  color="#facc15"
                />
              </Pressable>
            ))}
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="Écrivez votre avis ici..."
            multiline
            value={comment}
            onChangeText={setComment}
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Envoyer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PendingReviewModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 16,
  },
  bold: {
    color: colors.primary,
    fontWeight: "700",
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  starButton: {
    marginHorizontal: 4,
  },
  textInput: {
    width: "100%",
    height: 100,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1e293b",
    marginBottom: 20,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: "#94a3b8",
    fontSize: 14,
  },
});
