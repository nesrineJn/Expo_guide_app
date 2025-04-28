import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { colors } from "@/utils/constants";
import { MaterialIcons } from "@expo/vector-icons";

export default function TopGuidesListScreen() {
  const [guides, setGuides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://192.168.1.16:4000/users/top-guides");
        const data = await response.json();
        setGuides(data);
      } catch (error) {
        console.error("Erreur lors du chargement des guides:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuides();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={guides}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.guideCard}
            onPress={() => router.push({ pathname: "/GuideProfileScreen", params: { id: item._id } })}
          >
            <Image source={{ uri: item.profileImage }} style={styles.guideImage} />
            <View style={styles.guideInfo}>
              <Text style={styles.guideName}>{item.fullName}</Text>
              <Text style={styles.guideEmail}>{item.email}</Text>
              <View style={styles.ratingRow}>
                {[...Array(Math.floor(item.ratingAverage || 0))].map((_, index) => (
                  <MaterialIcons key={index} name="star" size={16} color="#facc15" />
                ))}
                <Text style={styles.ratingText}>
                  {item.ratingAverage?.toFixed(1) ?? "0.0"}
                </Text>
              </View>
            </View>

            {/* ➡️ Flèche chevron right ici */}
            <MaterialIcons
              name="chevron-right"
              size={28}
              color="#9ca3af"
              style={styles.chevronIcon}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun guide trouvé.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { padding: 16 },
  guideCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
  },
  guideImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  guideInfo: {
    flex: 1,
    justifyContent: "center",
  },
  guideName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  guideEmail: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#6b7280",
  },
  chevronIcon: {
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
  },
});
