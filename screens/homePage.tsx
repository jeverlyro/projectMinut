import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Image,
  SafeAreaView,
  StatusBar as RNStatusBar,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Font from "expo-font";
import MapView, { Marker } from "react-native-maps";

const { width, height } = Dimensions.get("window");
const SPACING = 16;

const loadFonts = () => {
  return Font.loadAsync({
    "Gabarito-Regular": require("../assets/fonts/Gabarito-Regular.ttf"),
    "Gabarito-Bold": require("../assets/fonts/Gabarito-Bold.ttf"),
    "Gabarito-SemiBold": require("../assets/fonts/Gabarito-SemiBold.ttf"),
  });
};

export default function HomePage() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Please wait ...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1556513989-9f53e6ed8fe1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.4)"]}
          style={styles.gradientOverlay}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.header,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.locationRow}>
              <View style={styles.locationPin}>
                <Feather name="map-pin" size={18} color="#fff" />
              </View>
              <Text style={styles.locationText}>Minahasa Utara, Indonesia</Text>
            </View>
            <Text style={styles.pageTitle}>Minahasa Utara</Text>
          </Animated.View>

          {/* Content Cards */}
          <View style={styles.contentContainer}>
            {/* History Card */}
            <Animated.View
              style={[
                styles.card,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: Animated.multiply(slideAnim, 1.2) },
                  ],
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Feather name="clock" size={18} color="#333" />
                </View>
                <Text style={styles.cardTitle}>Sejarah</Text>
              </View>

              <Image
                source={{
                  uri: "https://atourin.obs.ap-southeast-3.myhuaweicloud.com/images/destination/minahasa-utara/gunung-klabat-profile1645959098.png",
                }}
                style={styles.cardImage}
              />

              <View style={styles.cardBody}>
                <Text style={styles.paragraph}>
                  Minahasa Utara adalah kabupaten di provinsi Sulawesi Utara,
                  Indonesia. Didirikan pada tahun 2004, kabupaten ini memisahkan
                  diri dari Kabupaten Minahasa dengan sejarah kaya yang
                  membentang selama berabad-abad.
                </Text>
                <Text style={styles.paragraph}>
                  Masyarakat Minahasa mempertahankan warisan budaya unik yang
                  dilestarikan melalui generasi, memadukan tradisi asli dengan
                  pengaruh dari sejarah kolonial Belanda.
                </Text>
              </View>
            </Animated.View>

            {/* Geography Card */}
            <Animated.View
              style={[
                styles.card,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: Animated.multiply(slideAnim, 1.4) },
                  ],
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Feather name="map" size={18} color="#333" />
                </View>
                <Text style={styles.cardTitle}>Geografi</Text>
              </View>

              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: 1.5268, // Minahasa Utara coordinates
                    longitude: 124.9593,
                    latitudeDelta: 0.3,
                    longitudeDelta: 0.3,
                  }}
                >
                  <Marker
                    coordinate={{ latitude: 1.4348, longitude: 124.992 }}
                    title="Airmadidi"
                    description="Ibu kota Minahasa Utara"
                  />
                  <Marker
                    coordinate={{ latitude: 1.6223, longitude: 124.8372 }}
                    title="Taman Nasional Bunaken"
                    description="Destinasi menyelam terkenal"
                  />
                  <Marker
                    coordinate={{ latitude: 1.4719, longitude: 125.2289 }}
                    title="Selat Lembeh"
                    description="Destinasi menyelam terkenal"
                  />
                  <Marker
                    coordinate={{ latitude: 1.4903, longitude: 125.0035 }}
                    title="Gunung Klabat"
                    description="Puncak tertinggi di Sulawesi Utara"
                  />
                </MapView>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.paragraph}>
                  Terletak di ujung timur laut Pulau Sulawesi, Indonesia.
                  Wilayah ini mencakup area sekitar 1.059,24 km² dan berbatasan
                  dengan Laut Celebes.
                </Text>

                <View style={styles.divider} />

                <Text style={styles.subheading}>Lokasi Penting</Text>

                <View style={styles.locationList}>
                  {[
                    "Airmadidi - Ibu kota kabupaten",
                    "Taman Nasional Bunaken",
                    "Selat Lembeh - Destinasi menyelam terkenal",
                    "Gunung Klabat - Puncak tertinggi di Sulawesi Utara",
                  ].map((item, index) => (
                    <View key={index} style={styles.locationItem}>
                      <View style={styles.locationBullet} />
                      <Text style={styles.keyLocation}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Animated.View>

            {/* Culture Section */}
            <Animated.View
              style={[
                styles.card,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: Animated.multiply(slideAnim, 1.6) },
                  ],
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Feather name="users" size={18} color="#333" />
                </View>
                <Text style={styles.cardTitle}>Budaya</Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.cultureSection}>
                  <View style={styles.cultureSectionHeader}>
                    <Feather name="music" size={18} color="#555" />
                    <Text style={styles.cultureSectionTitle}>
                      Tarian Tradisional
                    </Text>
                  </View>
                  <Text style={styles.paragraph}>
                    Masyarakat Minahasa dikenal dengan tarian tradisional yang
                    dinamis seperti tari perang Kabasaran, tari panen Maengket,
                    dan Cakalele yang ditampilkan selama perayaan.
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.cultureSection}>
                  <View style={styles.cultureSectionHeader}>
                    <Feather name="coffee" size={18} color="#555" />
                    <Text style={styles.cultureSectionTitle}>Kuliner</Text>
                  </View>
                  <Text style={styles.paragraph}>
                    Minahasa Utara terkenal dengan masakan unik dan lezat.
                    Hidangan populer termasuk Tinutuan (bubur Manado), Woku
                    (hidangan seafood atau ayam pedas), dan makanan tradisional
                    lainnya.
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.cultureSection}>
                  <View style={styles.cultureSectionHeader}>
                    <Feather name="speaker" size={18} color="#555" />
                    <Text style={styles.cultureSectionTitle}>
                      Musik Tradisional
                    </Text>
                  </View>
                  <Text style={styles.paragraph}>
                    Kolintang, alat musik perkusi kayu, adalah bagian penting
                    dari identitas budaya Minahasa. Musik memainkan peran
                    signifikan dalam upacara, perayaan, dan kehidupan
                    sehari-hari.
                  </Text>
                </View>
              </View>
            </Animated.View>
          </View>

          {/* Footer Button */}
          <Animated.View
            style={[
              styles.footerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: Animated.multiply(slideAnim, 1.8) }],
              },
            ]}
          >
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Jelajahi Minahasa Utara</Text>
              <Feather
                name="arrow-right"
                size={18}
                color="#00000"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: RNStatusBar.currentHeight || 0,
  },
  backgroundImage: {
    flex: 1,
  },
  backgroundImageStyle: {
    opacity: 0.8,
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: SPACING * 2,
    marginBottom: SPACING * 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationPin: {
    marginRight: 6,
  },
  locationText: {
    color: "white",
    fontSize: 15,
    fontFamily: "Gabarito-Regular",
  },
  keyLocation: {
    color: "black",
    fontSize: 15,
    fontFamily: "Gabarito-Regular",
  },
  pageTitle: {
    fontSize: 38,
    color: "#ffffff",
    marginTop: SPACING,
    marginBottom: SPACING,
    fontFamily: "Gabarito-Bold",
  },
  contentContainer: {
    paddingHorizontal: SPACING * 1.5,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: SPACING * 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING * 1.5,
    paddingVertical: SPACING,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    color: "#333",
    fontFamily: "Gabarito-SemiBold",
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  cardBody: {
    padding: SPACING * 1.5,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#505050",
    marginBottom: SPACING,
    fontFamily: "Gabarito-Regular",
    textAlign: "justify",
  },
  subheading: {
    fontSize: 16,
    color: "#333",
    marginBottom: SPACING,
    fontFamily: "Gabarito-SemiBold",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginVertical: SPACING * 1.5,
  },
  locationList: {
    marginTop: SPACING / 2,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING * 0.75,
  },
  locationBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3498db",
    marginTop: 8,
    marginRight: 8,
  },
  mapContainer: {
    width: "100%",
    height: 250,
    position: "relative",
  },
  map: {
    width: "100%",
    height: 200,
    backgroundColor: "#f5f5f5",
  },
  mapLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Gabarito-Regular",
  },
  mapPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  mapPlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: "rgba(0,0,0,0.4)",
  },
  cultureSection: {
    marginBottom: SPACING,
  },
  cultureSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING / 2,
  },
  cultureSectionTitle: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
    fontFamily: "Gabarito-SemiBold",
  },
  footerContainer: {
    alignItems: "center",
    marginTop: SPACING,
    paddingHorizontal: SPACING * 2,
  },
  button: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontFamily: "Gabarito-SemiBold",
  },
  buttonIcon: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
