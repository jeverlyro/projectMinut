import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Modal,
  ScrollView,
  Linking,
  Dimensions,
  ToastAndroid,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSavedItems, CulturalItem } from "../../services/SavedItemsContext";
import { StackNavigationProp } from "@react-navigation/stack";
import MapView, { Marker } from "react-native-maps";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";

interface ExtendedCulturalItem extends CulturalItem {
  audioFile?: string;
}

type RootStackParamList = {
  SavedItems: undefined;
  Profile: undefined;
  ModelViewer: {
    modelInfo: {
      name: string;
      modelUrl: string;
      description: string;
    };
  };
};

type SavedItemsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "SavedItems">;
};

const SavedItemsScreen = ({ navigation }: SavedItemsScreenProps) => {
  const { savedItems, removeItem, isLoading, error } = useSavedItems();
  const [selectedItem, setSelectedItem] = useState<ExtendedCulturalItem | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (!modalVisible && sound) {
      sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setPlaybackPosition(0);
      setPlaybackDuration(0);
    }
  }, [modalVisible]);

  const handleRemoveItem = async (id: string) => {
    await removeItem(id);

    // Close modal if the removed item is currently shown in the modal
    if (selectedItem && selectedItem.id === id) {
      setModalVisible(false);
    }
  };

  const handleItemPress = (item: ExtendedCulturalItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const openInGoogleMaps = () => {
    if (selectedItem && selectedItem.coordinates) {
      const { latitude, longitude } = selectedItem.coordinates;
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url).catch((err) =>
        console.error("Error opening Google Maps:", err)
      );
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);
      setPlaybackDuration(status.durationMillis);

      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    }
  };

  const togglePlayback = async () => {
    if (!selectedItem?.audioFile) return;

    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        setIsLoadingAudio(true);

        try {
          let audioModule;

          switch (selectedItem.audioFile) {
            case "ampe wayer.mp3":
              audioModule = require("../../assets/audios/ampe wayer.mp3");
              break;
            case "arum jeram sawangan.mp3":
              audioModule = require("../../assets/audios/arum jeram sawangan.mp3");
              break;
            case "bangka.mp3":
              audioModule = require("../../assets/audios/bangka.mp3");
              break;
            case "bukit larata.mp3":
              audioModule = require("../../assets/audios/bukit larata.mp3");
              break;
            case "desa budo.mp3":
              audioModule = require("../../assets/audios/desa budo.mp3");
              break;
            case "gangga.mp3":
              audioModule = require("../../assets/audios/gangga.mp3");
              break;
            case "hutan kenangan.mp3":
              audioModule = require("../../assets/audios/hutan kenangan.mp3");
              break;
            case "kaki dian.mp3":
              audioModule = require("../../assets/audios/kaki dian.mp3");
              break;
            case "klabat.mp3":
              audioModule = require("../../assets/audios/klabat.mp3");
              break;
            case "kuliner pasar tradisional.mp3":
              audioModule = require("../../assets/audios/kuliner pasar tradisional.mp3");
              break;
            case "Lihaga.mp3":
              audioModule = require("../../assets/audios/Lihaga.mp3");
              break;
            case "mapalus.mp3":
              audioModule = require("../../assets/audios/mapalus.mp3");
              break;
            case "marawale.mp3":
              audioModule = require("../../assets/audios/marawale.mp3");
              break;
            case "Pantai Likupang.mp3":
              audioModule = require("../../assets/audios/Pantai Likupang.mp3");
              break;
            case "pengucapan.mp3":
              audioModule = require("../../assets/audios/pengucapan.mp3");
              break;
            case "tanjung tarabitan.mp3":
              audioModule = require("../../assets/audios/tanjung tarabitan.mp3");
              break;
            case "tari tumatenden.mp3":
              audioModule = require("../../assets/audios/tari tumatenden.mp3");
              break;
            case "Tunan.mp3":
              audioModule = require("../../assets/audios/Tunan.mp3");
              break;
            case "walanda maramis.mp3":
              audioModule = require("../../assets/audios/walanda maramis.mp3");
              break;
            case "waruga sawngan.mp3":
              audioModule = require("../../assets/audios/waruga sawngan.mp3");
              break;
            case "waruga.mp3":
              audioModule = require("../../assets/audios/waruga.mp3");
              break;
            case "kolintang.mp3":
              audioModule = require("../../assets/audios/kolintang.mp3");
              break;
            default:
              throw new Error(
                `Audio file not found: ${selectedItem.audioFile}`
              );
          }

          const { sound: newSound } = await Audio.Sound.createAsync(
            audioModule,
            { shouldPlay: true },
            onPlaybackStatusUpdate
          );

          setSound(newSound);
          setIsPlaying(true);
        } catch (error) {
          console.log("Error loading audio:", error);
          Alert.alert("Audio Error", "Tidak dapat memuat audio");
        }

        setIsLoadingAudio(false);
      }
    } catch (error) {
      console.log("Error playing audio:", error);
      setIsLoadingAudio(false);
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const has3DModel = (itemName: string): boolean => {
    return itemName === "Waruga Sawangan" || itemName === "Kolintang";
  };

  const getModelUrlForItem = (itemName: string) => {
    switch (itemName) {
      case "Waruga Sawangan":
        return "https://v.magiscan.app/model/67f932c6f602c12a2789b986.html";
      case "Kolintang":
        return "https://v.magiscan.app/model/67fd0976f602c12a278a40da.html";
      default:
        return "https://v.magiscan.app/model/67fd0976f602c12a278a40da.html";
    }
  };

  const get3DModelDescription = (itemName: string): string => {
    switch (itemName) {
      case "Waruga Sawangan":
        return "Model 3D ini menampilkan detail dari situs Waruga di Sawangan, tempat pemakaman batu tradisional berbentuk kubus yang unik dari budaya Minahasa.";
      case "Kolintang":
        return "Model 3D ini memperlihatkan detail instrumen musik tradisional Kolintang dari Minahasa, yang terbuat dari bilah-bilah kayu dengan berbagai ukuran untuk menghasilkan nada yang berbeda.";
      default:
        return "";
    }
  };

  const openYoutubeVideo = (itemName: string) => {
    switch (itemName) {
      case "Tari Tumatenden":
        Linking.openURL("https://youtu.be/jWGP87gq-cw?si=TO8zIsfr1LE9OKXR");
        break;
      // Add more cases for other items with videos in the future
      default:
        return;
    }
  };

  const renderItem = ({ item }: { item: ExtendedCulturalItem }) => {
    const has3D = has3DModel(item.name);

    return (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() => handleItemPress(item)}
      >
        <Image source={item.image} style={styles.itemImage} />
        {has3D && (
          <View style={styles.model3dBadge}>
            <Ionicons name="cube-outline" size={14} color="#fff" />
            <Text style={styles.model3dBadgeText}>3D</Text>
          </View>
        )}
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <View style={styles.badgeContainer}>
            <View
              style={[
                styles.badge,
                item.type === "Wisata"
                  ? styles.wisataBadge
                  : styles.budayaBadge,
              ]}
            >
              <Text style={styles.itemType}>{item.type}</Text>
            </View>
            <View style={[styles.badge, styles.categoryBadge]}>
              <Text style={styles.categoryType}>{item.category}</Text>
            </View>
            {has3D && (
              <View style={[styles.badge, styles.model3dBadgeSmall]}>
                <Text style={styles.model3dTypeSmall}>3D</Text>
              </View>
            )}
          </View>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const DetailModal = () => {
    if (!selectedItem) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedItem.name}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#252129" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              <Image
                source={selectedItem.image}
                style={styles.modalImage}
                resizeMode="cover"
              />

              <View style={styles.modalBadgeContainer}>
                <View
                  style={[
                    styles.badge,
                    selectedItem.type === "Wisata"
                      ? styles.wisataBadge
                      : styles.budayaBadge,
                  ]}
                >
                  <Text style={styles.itemType}>{selectedItem.type}</Text>
                </View>
                <View style={[styles.badge, styles.categoryBadge]}>
                  <Text style={styles.categoryType}>
                    {selectedItem.category}
                  </Text>
                </View>
              </View>

              {/* Location information */}
              {selectedItem.location && (
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={18} color="#252129" />
                  <Text style={styles.locationText}>
                    {selectedItem.location}
                  </Text>
                </View>
              )}

              <Text style={styles.modalDescription}>
                {selectedItem.description}
              </Text>

              {/* Audio player section */}
              {selectedItem.audioFile && (
                <View style={styles.audioPlayerContainer}>
                  <Text style={styles.sectionTitle}>Audio Penjelasan</Text>

                  <View style={styles.audioPlayer}>
                    <TouchableOpacity
                      style={styles.playPauseButton}
                      disabled={isLoadingAudio}
                      onPress={togglePlayback}
                    >
                      <Ionicons
                        name={
                          isLoadingAudio
                            ? "hourglass-outline"
                            : isPlaying
                            ? "pause"
                            : "play"
                        }
                        size={24}
                        color="#fff"
                      />
                    </TouchableOpacity>

                    <View style={styles.progressContainer}>
                      <Text style={styles.timeText}>
                        {formatTime(playbackPosition)}
                      </Text>

                      <View style={styles.sliderContainer}>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width:
                                  playbackDuration > 0
                                    ? `${
                                        (playbackPosition / playbackDuration) *
                                        100
                                      }%`
                                    : "0%",
                              },
                            ]}
                          />
                        </View>
                      </View>

                      <Text style={styles.timeText}>
                        {formatTime(playbackDuration)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Map preview for items with coordinates */}
              {selectedItem.coordinates && (
                <View style={styles.mapPreviewContainer}>
                  <Text style={styles.sectionTitle}>Lokasi</Text>
                  <View style={styles.mapContainer}>
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: selectedItem.coordinates.latitude,
                        longitude: selectedItem.coordinates.longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                      }}
                      pitchEnabled={false}
                      rotateEnabled={false}
                      zoomEnabled={false}
                      scrollEnabled={false}
                    >
                      <Marker
                        coordinate={selectedItem.coordinates}
                        title={selectedItem.name}
                      />
                    </MapView>
                    <TouchableOpacity
                      style={styles.openMapButton}
                      onPress={openInGoogleMaps}
                    >
                      <Ionicons name="navigate" size={16} color="#fff" />
                      <Text style={styles.openMapText}>
                        Buka di Google Maps
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* 3D Model Button */}
              {has3DModel(selectedItem.name) && (
                <View style={styles.modelButtonContainer}>
                  <Text style={styles.sectionTitle}>Model 3D</Text>
                  <TouchableOpacity
                    style={styles.model3dButton}
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate("ModelViewer", {
                        modelInfo: {
                          name: selectedItem.name,
                          modelUrl: getModelUrlForItem(selectedItem.name),
                          description: get3DModelDescription(selectedItem.name),
                        },
                      });
                    }}
                  >
                    <Ionicons
                      name="cube-outline"
                      size={20}
                      color="#fff"
                      style={styles.model3dButtonIcon}
                    />
                    <Text style={styles.model3dButtonText}>Lihat Model 3D</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* YouTube Button for specific items */}
              {selectedItem.name === "Tari Tumatenden" && (
                <View style={styles.youtubeContainer}>
                  <Text style={styles.sectionTitle}>Video Tarian</Text>
                  <TouchableOpacity
                    style={styles.youtubeButton}
                    onPress={() => openYoutubeVideo(selectedItem.name)}
                  >
                    <Ionicons
                      name="logo-youtube"
                      size={20}
                      color="#fff"
                      style={styles.youtubeButtonIcon}
                    />
                    <Text style={styles.youtubeButtonText}>
                      Tonton di YouTube
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.modalAction}>
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.8}
                  onPress={() => handleRemoveItem(selectedItem.id)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color="#fff"
                    style={styles.actionIcon}
                  />
                  <Text style={styles.actionText}>Hapus dari Tersimpan</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    const message = `Lihat destinasi menarik ini: ${
                      selectedItem.name
                    } di ${selectedItem.location || "Minahasa Utara"}`;
                    Linking.openURL(
                      `whatsapp://send?text=${encodeURIComponent(message)}`
                    );
                  }}
                >
                  <Ionicons
                    name="share-social-outline"
                    size={20}
                    color="#fff"
                    style={styles.actionIcon}
                  />
                  <Text style={styles.actionText}>Bagikan</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#252129" />
        </TouchableOpacity>
        <Text style={styles.title}>Tersimpan</Text>
        <View style={styles.placeholder} />
      </View>

      {isLoading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#252129" />
          <Text style={[styles.emptyStateText, { marginTop: 16 }]}>
            Memuat item tersimpan...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color="#ff4d4d"
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyStateTitle}>Gagal Memuat Data</Text>
          <Text style={styles.emptyStateText}>{error}</Text>
        </View>
      ) : savedItems.length > 0 ? (
        <FlatList
          data={savedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons
            name="bookmark-outline"
            size={64}
            color="#ccc"
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyStateTitle}>Belum Ada Yang Tersimpan</Text>
          <Text style={styles.emptyStateText}>
            Anda belum menyimpan destinasi wisata atau budaya apapun.
          </Text>
        </View>
      )}

      <DetailModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  placeholder: {
    width: 34,
  },
  title: {
    fontSize: 22,
    fontFamily: "Gabarito-Bold",
    color: "#252129",
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 15,
    padding: 5,
    zIndex: 10,
  },
  itemImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
    margin: 10,
  },
  itemContent: {
    flex: 1,
    padding: 14,
    justifyContent: "center",
  },
  itemTitle: {
    fontFamily: "Gabarito-Bold",
    fontSize: 18,
    marginBottom: 6,
    color: "#252129",
  },
  badgeContainer: {
    flexDirection: "row",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  wisataBadge: {
    backgroundColor: "#f1f1ff",
  },
  budayaBadge: {
    backgroundColor: "#f1f1ff",
  },
  categoryBadge: {
    backgroundColor: "#f5f5f5",
  },
  itemType: {
    fontFamily: "Gabarito-Regular",
    fontSize: 13,
    color: "#252129",
  },
  categoryType: {
    fontFamily: "Gabarito-Regular",
    fontSize: 13,
    color: "#666",
  },
  itemDescription: {
    fontFamily: "Gabarito-Regular",
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontFamily: "Gabarito-Bold",
    fontSize: 20,
    color: "#252129",
    marginBottom: 10,
  },
  emptyStateText: {
    fontFamily: "Gabarito-Regular",
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontFamily: "Gabarito-Bold",
    fontSize: 24,
    color: "#252129",
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  modalBadgeContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  modalDescription: {
    fontFamily: "Gabarito-Regular",
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  locationText: {
    marginLeft: 6,
    fontFamily: "Gabarito-Regular",
    fontSize: 14,
    color: "#444",
  },
  sectionTitle: {
    fontFamily: "Gabarito-Bold",
    fontSize: 18,
    marginBottom: 12,
    color: "#252129",
  },
  mapPreviewContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  openMapButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#252129",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  openMapText: {
    color: "#fff",
    fontFamily: "Gabarito-SemiBold",
    fontSize: 14,
    marginLeft: 6,
  },
  modalAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: "#252129",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 0.48,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    color: "#fff",
    fontFamily: "Gabarito-SemiBold",
    fontSize: 16,
  },
  // Audio player styles
  audioPlayerContainer: {
    marginBottom: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 16,
  },
  audioPlayer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  playPauseButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#252129",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  progressContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sliderContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#252129",
    borderRadius: 2,
  },
  timeText: {
    fontFamily: "Gabarito-Regular",
    fontSize: 12,
    color: "#666",
  },
  // 3D model styles
  model3dBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#3498db",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  model3dBadgeText: {
    color: "#fff",
    fontFamily: "Gabarito-SemiBold",
    fontSize: 12,
    marginLeft: 2,
  },
  model3dBadgeSmall: {
    backgroundColor: "#3498db",
  },
  model3dTypeSmall: {
    fontFamily: "Gabarito-Regular",
    fontSize: 13,
    color: "#fff",
  },
  modelButtonContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  model3dButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#252129",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  model3dButtonIcon: {
    marginRight: 8,
  },
  model3dButtonText: {
    color: "#fff",
    fontFamily: "Gabarito-SemiBold",
    fontSize: 14,
  },
  // YouTube button styles
  youtubeContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  youtubeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  youtubeButtonIcon: {
    marginRight: 8,
  },
  youtubeButtonText: {
    color: "#fff",
    fontFamily: "Gabarito-SemiBold",
    fontSize: 14,
  },
});

export default SavedItemsScreen;
