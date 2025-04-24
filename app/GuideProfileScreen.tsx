// GuideProfileScreen.tsx
import React, { useState } from "react";
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
  TouchableRipple,
  Button,
  Avatar,
  Card,
  Chip,
} from "react-native-paper";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/utils/constants";
import ImageViewer from "react-native-image-zoom-viewer";
const expertiseIcons: Record<string, string> = {
  History: "book-open-page-variant",
  Food: "silverware-fork-knife",
  Adventure: "hiking",
  Culture: "palette-outline",
  Nature: "pine-tree",
  Photography: "camera-outline",
  Architecture: "office-building-outline",
  "Local Experience": "account-group-outline",
};

const screenWidth = Dimensions.get("window").width;
const tabs = ["Personal", "Expertise", "Offerings"];

const GuideProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id, name, email, profileImage } = route.params as {
    id: string;
    name: string;
    email: string;
    profileImage: string;
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: "Profil du Guide" });
  }, [navigation]);

  const [activeTab, setActiveTab] = useState("Personal");
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const phoneNumber = "53583335";

  const certifications = [
    {
      name: "Guide Culturel Certifié",
      organisation: "Ministère du Tourisme",
      date: "2020",
      description: "Formation spécialisée en histoire et patrimoine tunisien.",
    },
    {
      name: "Licence de Guide",
      organisation: "Tourism Academy",
      date: "2018",
      description:
        "Certification officielle pour guider des groupes internationaux.",
    },
  ];

  const expertiseTags = [
    "History",
    "Food",
    "Adventure",
    "Culture",
    "Nature",
    "Photography",
    "Architecture",
    "Local Experience",
  ];

  const offerings = [
    {
      id: "1",
      title: "Balade dans la Médina",
      description:
        "Explorez les souks, monuments et l’histoire cachée de la vieille ville de Tunis.",
      images: [
        "https://i.pravatar.cc/400?img=11",
        "https://i.pravatar.cc/400?img=14",
        "https://i.pravatar.cc/400?img=15",
        "https://i.pravatar.cc/400?img=16",
        "https://i.pravatar.cc/400?img=17",
      ],
    },
    {
      id: "2",
      title: "Aventure au Cap Bon",
      description:
        "Journée nature entre falaises, plages sauvages et découvertes artisanales.",
      images: ["https://i.pravatar.cc/400?img=14"], 
    },
  ];

  const languages = ["Français", "Anglais", "Arabe"];

  const renderStars = (count: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <MaterialIcons
        key={i}
        name={i < count ? "star" : "star-border"}
        size={18}
        color="#f59e0b"
      />
    ));
  const [selectedOfferImages, setSelectedOfferImages] = useState<string[]>([]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: profileImage }} style={styles.avatar} />
        <Text style={styles.name}>
          {name} • <Text style={styles.email}>{email}</Text>
        </Text>

        <View style={styles.tabWrapper}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, isActive && styles.activeTabItem]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[styles.tabLabel, isActive && styles.activeTabLabel]}
                >
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

              <View style={styles.infoRow}>
                <MaterialIcons
                  name="location-on"
                  size={20}
                  color={colors.primary}
                  style={styles.infoIcon}
                />
                <Text style={styles.infoText}>Tunis, Tunisie</Text>
              </View>

              <View style={styles.infoRow}>
                <MaterialIcons
                  name="phone"
                  size={20}
                  color={colors.primary}
                  style={styles.infoIcon}
                />
                <Text style={styles.infoText}>{phoneNumber}</Text>
              </View>

              <Text style={{ ...styles.sectionTitle, marginTop: 16 }}>
                Langues parlées{" "}
              </Text>

              <View>
                <View style={styles.tagContainer}>
                  {languages.map((lang, i) => (
                    <View key={i} style={styles.tag}>
                      <MaterialIcons
                        name="language"
                        size={16}
                        color={colors.primary}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.tagText}>{lang}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                À propos
              </Text>
              <Text style={styles.value}>
                Guide passionné depuis 5 ans. J'adore faire découvrir l'histoire
                et la culture tunisienne aux voyageurs.
              </Text>
            </Card.Content>
          </Card>
        )}

        {activeTab === "Expertise" && (
          <View style={styles.card}>
            <View style={{ padding: 8 }}>
              <Text style={styles.sectionTitle}>Domaines d’expertise</Text>
              <View style={styles.tagContainer}>
                {expertiseTags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <MaterialCommunityIcons
                      name={expertiseIcons[tag] || "tag-outline"}
                      size={16}
                      color={colors.primary}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                Certifications
              </Text>
              {certifications.map((cert, index) => (
                <View key={index} style={styles.certItem}>
                  <MaterialCommunityIcons
                    name="certificate-outline"
                    size={28}
                    color={colors.primary}
                    style={{ marginRight: 10 }}
                  />
                  <View>
                    <Text style={styles.certTitle}>{cert.name}</Text>
                    <Text style={styles.certSubtitle}>
                      {cert.organisation} • {cert.date}
                    </Text>
                    <Text style={styles.certDesc}>{cert.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "Offerings" && (
          <View>
            {offerings.map((offering, index) => (
              <Card key={index} style={styles.offerCard}>
                {/* Header: Avatar et nom du guide */}
                <View style={styles.offerTopHeader}>
                  <Avatar.Image source={{ uri: profileImage }} size={36} />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>{name}</Text>
                    <Text style={{ color: "gray", fontSize: 12 }}>
                      Guide Local
                    </Text>
                  </View>
                </View>

                {/* Image de l'offre */}
                <View style={styles.gridContainer}>
                  {Array.isArray(offering.images) &&
                    offering.images.slice(0, 4).map((img, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => {
                          setSelectedOfferImages(offering.images);
                          setFullscreenIndex(i);
                        }}
                        style={[
                          styles.gridImageWrapper,
                          offering.images.length === 1 &&
                            styles.singleImageFullWidth, // si une seule image
                        ]}
                      >
                        <Image source={{ uri: img }} style={styles.gridImage} />
                        {i === 3 && offering.images.length > 4 && (
                          <View style={styles.overlay}>
                            <Text style={styles.overlayText}>
                              +{offering.images.length - 4}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                </View>

                {/* Détails de l'offre */}
                <View style={styles.offerContent}>
                  <Text style={styles.offerTitle}>{offering.title}</Text>
                  <Text style={styles.offerDescription}>
                    {offering.description}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      {/* <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={() => {}}
          style={styles.contactButton}
          labelStyle={{ fontWeight: "bold", fontSize: 16 }}
          contentStyle={{ paddingVertical: 8 }}
        >
          Contacter
        </Button>
      </View> */}

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
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },

  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderColor: colors.primary,
    borderWidth: 1,
    marginBottom: 8,
  },

  tagText: {
    fontSize: 14,
    color: colors.onPrimaryContainer,
  },

  certItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  certTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
  },

  certSubtitle: {
    fontSize: 13,
    color: "#475569",
    marginTop: 2,
  },

  certDesc: {
    fontSize: 14,
    color: "#334155",
    marginTop: 6,
    lineHeight: 20,
  },

  chip: {
    backgroundColor: "#e0f2fe", // bleu clair
    borderColor: "#38bdf8", // bleu moyen
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 8,
    height: 34,
    justifyContent: "center",
    borderRadius: 16,
  },

  certCard: {
    marginTop: 12,
    backgroundColor: "#f8fafc",
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
    elevation: 0,
    paddingVertical: 8,
    borderRadius: 10,
  },

  tabWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#e5e5e5",
    paddingBottom: 4,
  },

  tabItem: {
    alignItems: "center",
    paddingVertical: 8,
    flex: 1,
  },

  activeTabItem: {
    // pas besoin de plus ici, l’indicateur le montre
  },

  tabLabel: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },

  activeTabLabel: {
    color: colors.primary,
    fontWeight: "700",
  },

  tabIndicator: {
    marginTop: 6,
    height: 3,
    width: "60%",
    borderRadius: 2,
    backgroundColor: colors.primary,
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },

  gridImageWrapper: {
    width: (screenWidth - 48) / 2, // -72 padding horizontal, -8 pour l'espace entre les deux images
    height: (screenWidth - 72 - 10) / 2, // carré
    marginBottom: 8,

    overflow: "hidden",
    backgroundColor: "#eee",
    position: "relative",
  },

  singleImageFullWidth: {
    width: "100%",
    height: 200,
  },

  gridImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  overlayText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  container: { flex: 1, backgroundColor: "#f9f9f9" },
  scrollContent: { alignItems: "center", padding: 20, paddingBottom: 100 },
  offerCard: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
  },
  offerTopHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingBottom: 0,
  },
  offerImage: {
    borderRadius: 0,
    marginTop: 8,
  },
  offerContent: {
    padding: 12,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    color: "#1e293b",
  },
  offerDescription: {
    fontSize: 14,
    color: "#475569",
    marginVertical: 10,
  },

  offerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  value: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 2,
    elevation: 5,
  },
  name: { fontSize: 18, fontWeight: "bold", color: "#1c1c1e", marginBottom: 8 },
  email: { fontSize: 14, color: "gray", marginBottom: 20 },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#e5e5e5",
    marginBottom: 16,
  },
  tab: { flex: 1, alignItems: "center", paddingVertical: 10 },
  tabText: { fontSize: 16, color: "#888" },
  activeTabText: {
    color: colors.primary,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderColor: colors.primary,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    marginBottom: 20,
    elevation: 2,
  },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "transparent",
  },
  contactButton: {
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
});

export default GuideProfileScreen;
