import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSavedItems } from "../../services/SavedItemsContext";
import { StackNavigationProp } from "@react-navigation/stack";
import MapView, { Marker } from "react-native-maps";

type RootStackParamList = {
  SavedItems: undefined;
  Profile: undefined;
};

type SavedItemsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "SavedItems">;
};

const SavedItemsScreen = ({ navigation }: SavedItemsScreenProps) => {
  const { savedItems, removeItem, isLoading, error } = useSavedItems();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRemoveItem = async (id: string) => {
    await removeItem(id);

    // Close modal if the removed item is currently shown in the modal
    if (selectedItem && selectedItem.id === id) {
      setModalVisible(false);
    }
  };

  const handleItemPress = (item: any) => {
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

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => handleItemPress(item)}
    >
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <View style={styles.badgeContainer}>
          <View
            style={[
              styles.badge,
              item.type === "Wisata" ? styles.wisataBadge : styles.budayaBadge,
            ]}
          >
            <Text style={styles.itemType}>{item.type}</Text>
          </View>
          <View style={[styles.badge, styles.categoryBadge]}>
            <Text style={styles.categoryType}>{item.category}</Text>
          </View>
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
                    const message = `Lihat destinasi menarik ini: ${selectedItem.name} di ${selectedItem.location}`;
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
  },
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 8,
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
});

export default SavedItemsScreen;
