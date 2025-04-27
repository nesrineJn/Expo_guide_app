import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  Text,
  ActivityIndicator,
  Avatar,
  Card,
} from "react-native-paper";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/utils/constants";
import ImageViewer from "react-native-image-zoom-viewer";

const screenWidth = Dimensions.get("window").width;
const tabs = ["Personal", "Expertise", "Offerings"];

const GuideProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: string };

  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Personal");
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [selectedOfferImages, setSelectedOfferImages] = useState<string[]>([]);

  useEffect(() => {
    navigation.setOptions({ title: "Profil du Guide" });
  }, [navigation]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://192.168.1.16:4000/users/${id}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Erreur lors du fetch du guide:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading || !userData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const {
    fullName,
    email,
    profileImage,
    phoneNumber,
    languages = [],
    certifications = [],
    posts = [],
    preferredGuests = [],
    location,
    about,
  } = userData;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {profileImage && (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        )}
        <Text style={styles.name}>
          {fullName} • <Text style={styles.email}>{email}</Text>
        </Text>

        <View style={styles.tabWrapper}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                //@ts-expect-error
                style={[styles.tabItem, isActive && styles.activeTabItem]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                  {tab}
                </Text>
                {isActive && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {activeTab === "Personal" && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Informations personnelles</Text>

              {location && (
                <View style={styles.infoRow}>
                  <MaterialIcons name="location-on" size={20} color={colors.primary} style={styles.infoIcon} />
                  <Text style={styles.infoText}>{location}</Text>
                </View>
              )}

              {phoneNumber && (
                <View style={styles.infoRow}>
                  <MaterialIcons name="phone" size={20} color={colors.primary} style={styles.infoIcon} />
                  <Text style={styles.infoText}>{phoneNumber}</Text>
                </View>
              )}

              {languages.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                    Langues parlées
                  </Text>
                  <View style={styles.tagContainer}>
                    {languages.map((lang: string, i: number) => (
                      <View key={i} style={styles.tag}>
                        <MaterialIcons name="language" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                        <Text style={styles.tagText}>{lang}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              {about && (
                <>
                  <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                    À propos
                  </Text>
                  <Text style={styles.value}>
                    {about}
                  </Text>
                </>
              )}
            </Card.Content>
          </Card>
        )}

        {activeTab === "Expertise" && (
          <View style={styles.card}>
            <View style={{ padding: 8 }}>
              <Text style={styles.sectionTitle}>Type de clients préférés</Text>
              <View style={styles.tagContainer}>
                {preferredGuests.length > 0 ? (
                  preferredGuests.map((guest: any, index: number) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>
                        {guest.icon} {guest.name}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.value}>Aucune préférence spécifiée.</Text>
                )}
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                Certifications
              </Text>
              {certifications.length > 0 ? (
                certifications.map((cert: any, index: number) => (
                  <View key={index} style={styles.certItem}>
                    <MaterialCommunityIcons name="certificate-outline" size={28} color={colors.primary} style={{ marginRight: 10 }} />
                    <View>
                      <Text style={styles.certTitle}>{cert.name}</Text>
                      <Text style={styles.certSubtitle}>{cert.organisation} • {cert.date}</Text>
                      <Text style={styles.certDesc}>{cert.description}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.value}>Aucune certification.</Text>
              )}
            </View>
          </View>
        )}

        {activeTab === "Offerings" && (
          <View>
            {posts.length > 0 ? (
              posts.map((offering: any, index: number) => (
                <Card key={index} style={styles.offerCard}>
                  <View style={styles.offerTopHeader}>
                    <Avatar.Image source={{ uri: profileImage }} size={36} />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={{ fontWeight: "bold" }}>{fullName}</Text>
                      <Text style={{ color: "gray", fontSize: 12 }}>Guide Local</Text>
                    </View>
                  </View>

                  <View style={styles.gridContainer}>
                    {offering.images?.slice(0, 4).map((img: string, i: number) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => {
                          setSelectedOfferImages(offering.images);
                          setFullscreenIndex(i);
                        }}
                        style={[
                          styles.gridImageWrapper,
                          offering.images.length === 1 && styles.singleImageFullWidth,
                        ]}
                      >
                        <Image source={{ uri: img }} style={styles.gridImage} />
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.offerContent}>
                    <Text style={styles.offerTitle}>{offering.title}</Text>
                    <Text style={styles.offerDescription}>{offering.content}</Text>
                  </View>
                </Card>
              ))
            ) : (
              <Text style={styles.value}>Aucune offre disponible.</Text>
            )}
          </View>
        )}
      </ScrollView>

      <Modal visible={fullscreenIndex !== null} transparent={true}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
          {fullscreenIndex !== null && selectedOfferImages.length > 0 && (
            <ImageViewer
              imageUrls={selectedOfferImages.map((url) => ({ url }))}
              index={fullscreenIndex}
              onCancel={() => {
                setFullscreenIndex(null);
                setSelectedOfferImages([]);
              }}
              enableSwipeDown
              onSwipeDown={() => {
                setFullscreenIndex(null);
                setSelectedOfferImages([]);
              }}
            />
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  scrollContent: { alignItems: "center", padding: 20, paddingBottom: 100 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 8 },
  name: { fontSize: 18, fontWeight: "bold", color: "#1c1c1e" },
  email: { fontSize: 14, color: "gray", marginBottom: 20 },
  tabWrapper: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16, borderBottomWidth: 1, borderColor: "#e5e5e5", paddingBottom: 4 },
  tabItem: { alignItems: "center", paddingVertical: 8, flex: 1 },
  tabLabel: { fontSize: 14, color: "#888", fontWeight: "500" },
  activeTabLabel: { color: colors.primary, fontWeight: "700" },
  tabIndicator: { marginTop: 6, height: 3, width: "60%", borderRadius: 2, backgroundColor: colors.primary },
  card: { width: "100%", backgroundColor: "#fff", borderRadius: 12, padding: 8, marginBottom: 20, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1e293b", marginBottom: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  infoIcon: { marginRight: 8 },
  infoText: { fontSize: 14, color: "#334155", fontWeight: "500" },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: { flexDirection: "row", alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: 24, paddingHorizontal: 12, paddingVertical: 6, borderColor: colors.primary, borderWidth: 1, marginBottom: 8 },
  tagText: { fontSize: 14, color: colors.onPrimaryContainer },
  certItem: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#f1f5f9", borderRadius: 12, padding: 12, marginBottom: 12 },
  certTitle: { fontSize: 14, fontWeight: "bold", color: "#0f172a" },
  certSubtitle: { fontSize: 13, color: "#475569", marginTop: 2 },
  certDesc: { fontSize: 14, color: "#334155", marginTop: 6, lineHeight: 20 },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 8 },
  gridImageWrapper: { width: (screenWidth - 48) / 2, height: (screenWidth - 72 - 10) / 2, marginBottom: 8, overflow: "hidden", backgroundColor: "#eee", position: "relative" },
  singleImageFullWidth: { width: "100%", height: 200 },
  gridImage: { width: "100%", height: "100%", resizeMode: "cover" },
  offerCard: { marginBottom: 24, borderRadius: 12, overflow: "hidden", backgroundColor: "#fff", elevation: 0 },
  offerTopHeader: { flexDirection: "row", alignItems: "center", padding: 12, paddingBottom: 0 },
  offerContent: { padding: 12 },
  offerTitle: { fontSize: 16, fontWeight: "bold", marginTop: 8, color: "#1e293b" },
  offerDescription: { fontSize: 14, color: "#475569", marginVertical: 10 },
  value: { fontSize: 14, color: "#475569", lineHeight: 20 },
});

export default GuideProfileScreen;
