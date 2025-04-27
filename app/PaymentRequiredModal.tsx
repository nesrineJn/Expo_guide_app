import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/utils/constants'; 

interface Props {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void; // <-- ajouter ici
  }
  

const PaymentRequiredModal = ({ visible, onClose, onConfirm }: Props) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          {/* Icône principale */}
          <View style={styles.iconContainer}>
            <MaterialIcons name="credit-card" size={48} color={colors.primary} />
          </View>

          {/* Titre */}
          <Text style={styles.title}>Ajoutez votre carte</Text>

          {/* Description */}
          <Text style={styles.description}>
            Vous devez associer une carte bancaire pour finaliser votre réservation.
          </Text>

          {/* Bouton Ajouter une carte */}
          <Button
            mode="contained"
            style={styles.button}
            buttonColor={colors.primary}
            textColor="#fff"
            onPress={onConfirm} 
          >
            Ajouter une carte
          </Button>

          {/* Bouton Fermer */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentRequiredModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    backgroundColor: colors.primaryContainer,
    padding: 16,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    marginTop: 10,
    borderRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
  },
});
