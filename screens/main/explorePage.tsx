import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  UIManager,
  Modal,
  Dimensions,
  Pressable,
  ToastAndroid,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSavedItems, CulturalItem } from "../../services/SavedItemsContext";
import MapView, { Marker } from "react-native-maps";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const culturalItems: CulturalItem[] = [
  {
    id: "1",
    name: "Pantai Likupang",
    type: "Wisata",
    category: "Pantai",
    image: { uri: "https://cdn.idntimes.com/content-images/community/2022/08/fromandroid-9ca5bb4c3db071c4c57ff04ca0626c53_600x400.jpg" },
    description:
      "Pantai eksotis di Zona Ekonomi Khusus (KEK) yang mencakup Pantai Paal, Pulisan, dan Kinunang dengan pasir putih dan air laut jernih.",
    location: "Likupang Timur, Minahasa Utara",
    coordinates: { latitude: 1.6823031142032934, longitude: 125.14779381850882 }, 
  },
  {
    id: "2",
    name: "Pulau Lihaga",
    type: "Wisata",
    category: "Pulau",
    image: { uri: "https://cdn.idntimes.com/content-images/community/2022/05/217629100-203359038378628-2800122740935437306-n-41de55f2c34bd9d1bd2b234d79dab910-8e53f31fa4f4f222d8cb3d05cca4f08b.jpg" },
    description:
      "Pulau kecil dengan pantai berpasir putih dan air laut biru jernih, ideal untuk snorkeling dan diving.",
    location: "Likupang Timur, Minahasa Utara",
    coordinates: { latitude: 1.7616158680289602,longitude: 125.03677189025609 }, 
  },
  {
    id: "3",
    name: "Pulau Gangga",
    type: "Wisata",
    category: "Pulau",
    image: { uri: "https://th.bing.com/th/id/OIP.LMCZcnFEJlfcXQcJdeR8WAEsDI?w=231&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
    description:
      "Pulau dengan resort eksklusif, terkenal dengan terumbu karang dan kehidupan laut yang beragam.",
    location: "Likupang Barat, Minahasa Utara",
    coordinates: { latitude: 1.7615957609386508,  longitude: 125.0512146946257 },
  },
  {
    id: "4",
    name: "Pulau Bangka",
    type: "Wisata",
    category: "Pulau",
    image: { uri: "https://th.bing.com/th/id/OIP.SH8iwqxN6H609tvMc5JdfAHaEM?w=306&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
    description:
      "Pulau indah dengan pantai eksotis dan pemandangan bawah laut yang mempesona untuk kegiatan menyelam.",
    location: "Likupang Barat, Minahasa Utara",
    coordinates: { latitude: 1.7974414954372149,  longitude: 125.18322671097842 }, 
  },
  {
    id: "5",
    name: "Air Terjun Tunan",
    type: "Wisata",
    category: "Alam",
    image: { uri: "https://th.bing.com/th/id/OIP.FfiuEK0whOoqe5HlegDaIQHaEc?rs=1&pid=ImgDetMain" },
    description:
      "Air terjun yang indah dengan ketinggian sekitar 20 meter, dikelilingi vegetasi hijau yang asri.",
    location: "Dimembe, Minahasa Utara",
    coordinates: { latitude: 1.5684001555483225, longitude: 124.97291564932739 }, 
  },
  {
    id: "6",
    name: "Gunung Klabat",
    type: "Wisata",
    category: "Alam",
    image: { uri: "data:image/jpeg;base64,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" },
    description:
      "Gunung tertinggi di Sulawesi Utara (1995 mdpl) dengan jalur pendakian yang menantang dan pemandangan spektakuler.",
    location: "Airmadidi, Minahasa Utara",
    coordinates: { latitude: 1.4536536565252405,  longitude: 125.0317299451305 },
  },
  {
    id: "7",
    name: "Kaki Dian",
    type: "Wisata",
    category: "Alam",
    image: { uri: "https://media-cdn.tripadvisor.com/media/photo-s/05/e5/b8/22/kaki-dian.jpg" },
    description:
      "Danau vulkanik berair biru yang terletak di kaki Gunung Klabat dengan keindahan alam yang mempesona.",
    location: "Airmadidi, Minahasa Utara",
    coordinates: { latitude: 1.4369417926909949, longitude: 124.99302332546253 },  
  },
  {
    id: "8",
    name: "Hutan Kenangan",
    type: "Wisata",
    category: "Alam",
    image: { uri: "https://klikjo.id/wp-content/uploads/2021/08/IMG_20210817_122918.jpg" },
    description:
      "Area konservasi alam dengan berbagai jenis vegetasi khas Sulawesi Utara yang asri dan sejuk.",
    location: "Airmadidi, Minahasa Utara", 
    coordinates: { latitude: 1.4568012450935772,  longitude: 124.97424136666629 }, 
  },
  {
    id: "9",
    name: "Waruga Sawangan",
    type: "Wisata",
    category: "Sejarah",
    image: { uri: "https://th.bing.com/th/id/OIP.PYtyafEAFQXfc-joT7gq6gHaE8?w=278&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
    description:
      "Situs sejarah berupa kuburan batu tradisional Minahasa yang menunjukkan budaya pemakaman zaman dulu.",
    location: "Sawangan, Minahasa Utara",
    coordinates: { latitude: 1.39280388942744, longitude: 124.96349545105363 },  
  },
  {
    id: "10",
    name: "Kuliner & Pasar Tradisional",
    type: "Wisata",
    category: "Kuliner",
    image: { uri: "https://th.bing.com/th/id/OIP.Cqc412uHn8Fu5pYpWu0zdgHaEX?w=299&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
    description:
      "Pusat jajanan dan kuliner khas Minahasa Utara dengan berbagai masakan tradisional yang menggugah selera.",
    location: "Airmadidi, Minahasa Utara",
  },
  {
    id: "11",
    name: "Bukit Larata",
    type: "Wisata",
    category: "Alam",
    image: { uri: "https://th.bing.com/th/id/OIP.VRB_svlCt33L7FBrXo7j9QHaDt?rs=1&pid=ImgDetMain" },
    description:
      "Bukit dengan pemandangan panorama indah matahari terbit dan matahari terbenam yang memukau.",
    location: "Likupang Barat, Minahasa Utara",
    coordinates: { latitude:1.666508499422102, longitude: 125.16217682077153 },
  },
  {
    id: "12",
    name: "Tanjung Tarabitan",
    type: "Wisata",
    category: "Pantai",
    image: { uri: "https://th.bing.com/th/id/OIP.6uN1MZzELOHlWnH7r7X2SAHaD4?w=338&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
    description:
      "Area tanjung dengan pantai indah dan pemandangan laut lepas yang memukau.",
    location: "Likupang Barat, Minahasa Utara",
    coordinates: { latitude: 1.7383812600297632, longitude: 124.98513273708187 },
  },
  {
    id: "13",
    name: "Arung Jeram Sawangan",
    type: "Wisata",
    category: "Petualangan",
    image: { uri: "https://th.bing.com/th/id/OIP.Xlqmh2h_jMd62wmNDAnn0QHaEK?w=302&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
    description:
      "Lokasi arung jeram menantang dengan pemandangan alam yang indah di sepanjang jalur sungai.",
    location: "Sawangan, Minahasa Utara",
    coordinates: { latitude:  1.3930915799446035, longitude:  124.96360239968145 },
  },
  {
    id: "14",
    name: "Taman Makam Pahlawan Maria Walanda Maramis",
    type: "Wisata",
    category: "Sejarah",
    image: { uri: "https://th.bing.com/th/id/OIP.XxnZwa91Ok6pIZwyH76IowHaEK?w=295&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
    description:
      "Situs sejarah yang mengenang jasa pahlawan nasional Maria Walanda Maramis, pejuang hak perempuan.",
    location: "Airmadidi, Minahasa Utara",
  },

  // Budaya category
  {
    id: "15",
    name: "Merawale",
    type: "Budaya",
    category: "Tradisi",
    image: { uri: "https://th.bing.com/th/id/OIP.JWq5gRr1drgMdUrKjF7RkwHaFc?w=242&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
    description:
      "Tradisi musyawarah masyarakat Minahasa untuk menyelesaikan permasalahan bersama secara kekeluargaan.",
    location: "Minahasa Utara",
  },
  {
    id: "16",
    name: "Mapalus",
    type: "Budaya",
    category: "Tradisi",
    image: { uri: "https://asset-2.tstatic.net/tribunmanadowiki/foto/bank/images/ilustrasi-mapalus.jpg " },
    description:
      "Sistem gotong royong dan kerja sama tradisional masyarakat Minahasa dalam berbagai kegiatan sosial dan pertanian.",
    location: "Minahasa Utara",
  },
  {
    id: "18",
    name: "Tari Tumatenden",
    type: "Budaya",
    category: "Tarian",
    image: { uri: "https://t-2.tstatic.net/tribunnewswiki/foto/bank/images/Tari-Tumatenden-3.jpg" },
    description:
      "Tarian tradisional Minahasa yang menggambarkan kesopanan dan keramahan gadis-gadis Minahasa.",
    location: "Minahasa Utara",
  },
  {
    id: "20",
    name: "Tradisi Pemakaman Waruga",
    type: "Budaya",
    category: "Tradisi",
    image: { uri: "https://oppal.co.id/wp-content/uploads/2022/09/0-b0kcUfFUOGnWV3hT.jpg" },
    description:
      "Tradisi pemakaman kuno masyarakat Minahasa menggunakan peti batu berbentuk kubus yang unik.",
    location: "Minahasa Utara",
  },
  {
    id: "21",
    name: "Pengucapan Syukur",
    type: "Budaya",
    category: "Upacara",
    image: { uri: "https://student-activity.binus.ac.id/bssc/wp-content/uploads/sites/38/2022/10/PENGUCAPAN-SYUKUR-MINAHASAN-VERSION-OF-THANKSGIVING-image1.jpg" },
    description:
      "Festival tahunan yang menunjukkan rasa syukur atas hasil panen, ditandai dengan pesta dan berbagi makanan.",
    location: "Minahasa Utara",
  },
];

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [activeMainCategory, setActiveMainCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState(culturalItems);
  const [selectedItem, setSelectedItem] = useState<CulturalItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { savedItems, saveItem, removeItem, isItemSaved } = useSavedItems();

  useEffect(() => {
    const items = culturalItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeTab === "All" ||
        item.type === activeTab ||
        item.category === activeTab;

      return matchesSearch && matchesCategory;
    });

    setFilteredItems(items);
  }, [searchQuery, activeTab]);

  const getSubcategories = (mainCategory: string) => {
    const items = culturalItems.filter((item) => item.type === mainCategory);
    const categories = [...new Set(items.map((item) => item.category))];
    return categories;
  };

  const handleMainTabChange = (tab: string) => {
    setActiveMainCategory(tab);
    setActiveTab(tab);
  };

  const handleSubTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleItemPress = (item: CulturalItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleSaveItem = async (item: CulturalItem) => {
    try {
      if (isItemSaved(item.id)) {
        await removeItem(item.id);
        if (Platform.OS === "android") {
          ToastAndroid.show("Item dihapus dari tersimpan", ToastAndroid.SHORT);
        } else {
          Alert.alert("Tersimpan", "Item dihapus dari tersimpan");
        }
      } else {
        await saveItem(item);
        if (Platform.OS === "android") {
          ToastAndroid.show("Item berhasil disimpan", ToastAndroid.SHORT);
        } else {
          Alert.alert("Tersimpan", "Item berhasil disimpan");
        }
      }
    } catch (error) {
      console.error("Error toggling save item:", error);
    }
  };

  const renderCultureItem = ({ item }: { item: CulturalItem }) => {
    const saved = isItemSaved(item.id);

    return (
      <View>
        <TouchableOpacity
          style={styles.itemCard}
          activeOpacity={0.7}
          onPress={() => handleItemPress(item)}
        >
          <Image source={item.image} style={styles.itemImage} />
          <View style={styles.itemContent}>
            <View style={styles.itemTitleRow}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              {saved && (
                <Ionicons
                  name="bookmark"
                  size={18}
                  color="#292125"
                  style={styles.savedIcon}
                />
              )}
            </View>
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
            </View>
            <Text style={styles.itemDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>
          Temukan wisata & budaya menarik di Minahasa Utara
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari destinasi..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeMainCategory === "All" && styles.activeTab,
            ]}
            onPress={() => handleMainTabChange("All")}
          >
            <Text
              style={[
                styles.tabText,
                activeMainCategory === "All" && styles.activeTabText,
              ]}
            >
              Semua
            </Text>
          </TouchableOpacity>

          {/* Main categories */}
          <TouchableOpacity
            style={[
              styles.tab,
              activeMainCategory === "Wisata" && styles.activeTab,
            ]}
            onPress={() => handleMainTabChange("Wisata")}
          >
            <Text
              style={[
                styles.tabText,
                activeMainCategory === "Wisata" && styles.activeTabText,
              ]}
            >
              Wisata
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeMainCategory === "Budaya" && styles.activeTab,
            ]}
            onPress={() => handleMainTabChange("Budaya")}
          >
            <Text
              style={[
                styles.tabText,
                activeMainCategory === "Budaya" && styles.activeTabText,
              ]}
            >
              Budaya
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Subcategories based on selected main category */}
      {(activeMainCategory === "Wisata" || activeMainCategory === "Budaya") && (
        <View style={styles.subTabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getSubcategories(activeMainCategory).map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.subTab,
                  activeTab === category && styles.activeSubTab,
                ]}
                onPress={() => handleSubTabChange(category)}
              >
                <Text
                  style={[
                    styles.subTabText,
                    activeTab === category && styles.activeSubTabText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={filteredItems}
        renderItem={renderCultureItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={50}
              color="#ccc"
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyStateText}>
              Tidak ada destinasi ditemukan
            </Text>
          </View>
        }
      />

      {/* Item Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
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
                source={selectedItem?.image}
                style={styles.modalImage}
                resizeMode="cover"
              />

              <View style={styles.modalBadgeContainer}>
                <View
                  style={[
                    styles.badge,
                    selectedItem?.type === "Wisata"
                      ? styles.wisataBadge
                      : styles.budayaBadge,
                  ]}
                >
                  <Text style={styles.itemType}>{selectedItem?.type}</Text>
                </View>
                <View style={[styles.badge, styles.categoryBadge]}>
                  <Text style={styles.categoryType}>
                    {selectedItem?.category}
                  </Text>
                </View>
              </View>

              {/* Location information */}
              {selectedItem?.location && (
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={18} color="#252129" />
                  <Text style={styles.locationText}>
                    {selectedItem.location}
                  </Text>
                </View>
              )}

              <Text style={styles.modalDescription}>
                {selectedItem?.description}
              </Text>

              {/* Map preview for items with coordinates */}
              {selectedItem?.coordinates && (
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
                    <TouchableOpacity style={styles.openMapButton}>
                      <Ionicons name="navigate" size={16} color="#fff" />
                      <Text style={styles.openMapText}>Buka di Peta</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles.modalAction}>
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.8}
                  onPress={() => selectedItem && handleSaveItem(selectedItem)}
                >
                  <Ionicons
                    name={
                      selectedItem && isItemSaved(selectedItem.id)
                        ? "bookmark"
                        : "bookmark-outline"
                    }
                    size={20}
                    color="#fff"
                    style={styles.actionIcon}
                  />
                  <Text style={styles.actionText}>
                    {selectedItem && isItemSaved(selectedItem.id)
                      ? "Tersimpan"
                      : "Simpan"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.8}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: "Gabarito-Bold",
    marginBottom: 4,
    color: "#252129",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Gabarito-Regular",
    color: "#666",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontFamily: "Gabarito-Regular",
    fontSize: 16,
  },
  tabContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeTab: {
    backgroundColor: "#252129",
  },
  tabText: {
    fontFamily: "Gabarito-Regular",
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
    fontFamily: "Gabarito-Bold",
  },
  subTabContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  subTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  activeSubTab: {
    backgroundColor: "#e0e0e0",
    borderColor: "#c0c0c0",
  },
  subTabText: {
    fontFamily: "Gabarito-Regular",
    fontSize: 13,
    color: "#000",
  },
  activeSubTabText: {
    color: "#000",
    fontFamily: "Gabarito-SemiBold",
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
    backgroundColor: "#f1f1ff",
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
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyStateText: {
    fontFamily: "Gabarito-Regular",
    fontSize: 16,
    color: "#999",
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
    height: "80%", // Takes 80% of screen height
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
  itemTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  savedIcon: {
    marginLeft: 8,
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
});

export default ExploreScreen;
