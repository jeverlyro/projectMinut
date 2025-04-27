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
  ToastAndroid,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSavedItems, CulturalItem } from "../../services/SavedItemsContext";
import MapView, { Marker } from "react-native-maps";
import { Audio } from "expo-av";
import { useNavigation, NavigationProp } from "@react-navigation/native";

interface ExtendedCulturalItem extends CulturalItem {
  audioFile?: string;
}

type RootStackParamList = {
  ModelViewer: {
    modelInfo: {
      name: string;
      modelUrl: string;
      description: string;
    };
  };
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const culturalItems: ExtendedCulturalItem[] = [
  {
    id: "1",
    name: "Pantai Likupang",
    type: "Wisata",
    category: "Pantai",
    image: {
      uri: "https://cdn.idntimes.com/content-images/community/2022/08/fromandroid-9ca5bb4c3db071c4c57ff04ca0626c53_600x400.jpg",
    },
    description:
      "Pantai eksotis di Zona Ekonomi Khusus (KEK) yang mencakup Pantai Paal, Pulisan, dan Kinunang dengan pasir putih dan air laut jernih.",
    location: "Likupang Timur, Minahasa Utara",
    coordinates: {
      latitude: 1.6823031142032934,
      longitude: 125.14779381850882,
    },
    audioFile: "Pantai Likupang.mp3",
  },
  {
    id: "2",
    name: "Pulau Lihaga",
    type: "Wisata",
    category: "Pulau",
    image: {
      uri: "https://cdn.idntimes.com/content-images/community/2022/05/217629100-203359038378628-2800122740935437306-n-41de55f2c34bd9d1bd2b234d79dab910-8e53f31fa4f4f222d8cb3d05cca4f08b.jpg",
    },
    description:
      "Pulau kecil dengan pantai berpasir putih dan air laut biru jernih, ideal untuk snorkeling dan diving.",
    location: "Likupang Timur, Minahasa Utara",
    coordinates: {
      latitude: 1.7616158680289602,
      longitude: 125.03677189025609,
    },
    audioFile: "Lihaga.mp3",
  },
  {
    id: "3",
    name: "Pulau Gangga",
    type: "Wisata",
    category: "Pulau",
    image: {
      uri: "https://th.bing.com/th/id/OIP.LMCZcnFEJlfcXQcJdeR8WAEsDI?w=231&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    description:
      "Pulau dengan resort eksklusif, terkenal dengan terumbu karang dan kehidupan laut yang beragam.",
    location: "Likupang Barat, Minahasa Utara",
    coordinates: { latitude: 1.7615957609386508, longitude: 125.0512146946257 },
    audioFile: "gangga.mp3",
  },
  {
    id: "4",
    name: "Pulau Bangka",
    type: "Wisata",
    category: "Pulau",
    image: {
      uri: "https://th.bing.com/th/id/OIP.SH8iwqxN6H609tvMc5JdfAHaEM?w=306&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    description:
      "Pulau indah dengan pantai eksotis dan pemandangan bawah laut yang mempesona untuk kegiatan menyelam.",
    location: "Likupang Barat, Minahasa Utara",
    coordinates: {
      latitude: 1.7974414954372149,
      longitude: 125.18322671097842,
    },
    audioFile: "bangka.mp3",
  },
  {
    id: "5",
    name: "Air Terjun Tunan",
    type: "Wisata",
    category: "Alam",
    image: {
      uri: "https://th.bing.com/th/id/OIP.FfiuEK0whOoqe5HlegDaIQHaEc?rs=1&pid=ImgDetMain",
    },
    description:
      "Air terjun yang indah dengan ketinggian sekitar 20 meter, dikelilingi vegetasi hijau yang asri.",
    location: "Dimembe, Minahasa Utara",
    coordinates: {
      latitude: 1.5684001555483225,
      longitude: 124.97291564932739,
    },
    audioFile: "Tunan.mp3",
  },
  {
    id: "6",
    name: "Gunung Klabat",
    type: "Wisata",
    category: "Alam",
    image: {
      uri: "https://atourin.obs.ap-southeast-3.myhuaweicloud.com/images/destination/minahasa-utara/gunung-klabat-profile1645959098.png?x-image-process=image/resize,p_100,limit_1/imageslim",
    },
    description:
      "Gunung tertinggi di Sulawesi Utara (1995 mdpl) dengan jalur pendakian yang menantang dan pemandangan spektakuler.",
    location: "Airmadidi, Minahasa Utara",
    coordinates: { latitude: 1.4536536565252405, longitude: 125.0317299451305 },
    audioFile: "klabat.mp3",
  },
  {
    id: "7",
    name: "Kaki Dian",
    type: "Wisata",
    category: "Alam",
    image: {
      uri: "https://media-cdn.tripadvisor.com/media/photo-s/05/e5/b8/22/kaki-dian.jpg",
    },
    description:
      "Danau vulkanik berair biru yang terletak di kaki Gunung Klabat dengan keindahan alam yang mempesona.",
    location: "Airmadidi, Minahasa Utara",
    coordinates: {
      latitude: 1.4369417926909949,
      longitude: 124.99302332546253,
    },
    audioFile: "kaki dian.mp3",
  },
  {
    id: "8",
    name: "Hutan Kenangan",
    type: "Wisata",
    category: "Alam",
    image: {
      uri: "https://klikjo.id/wp-content/uploads/2021/08/IMG_20210817_122918.jpg",
    },
    description:
      "Area konservasi alam dengan berbagai jenis vegetasi khas Sulawesi Utara yang asri dan sejuk.",
    location: "Airmadidi, Minahasa Utara",
    coordinates: {
      latitude: 1.4568012450935772,
      longitude: 124.97424136666629,
    },
    audioFile: "hutan kenangan.mp3",
  },
  {
    id: "9",
    name: "Waruga Sawangan",
    type: "Wisata",
    category: "Sejarah",
    image: {
      uri: "https://th.bing.com/th/id/OIP.PYtyafEAFQXfc-joT7gq6gHaE8?w=278&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    description:
      "Situs sejarah berupa kuburan batu tradisional Minahasa yang menunjukkan budaya pemakaman zaman dulu.",
    location: "Sawangan, Minahasa Utara",
    coordinates: { latitude: 1.39280388942744, longitude: 124.96349545105363 },
    audioFile: "waruga sawngan.mp3",
  },
  {
    id: "11",
    name: "Bukit Larata",
    type: "Wisata",
    category: "Alam",
    image: {
      uri: "https://th.bing.com/th/id/OIP.Cqc412uHn8Fu5pYpWu0zdgHaEX?w=299&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    description:
      "Bukit dengan pemandangan panorama indah matahari terbit dan matahari terbenam yang memukau.",
    location: "Likupang Barat, Minahasa Utara",
    coordinates: { latitude: 1.666508499422102, longitude: 125.16217682077153 },
    audioFile: "bukit larata.mp3",
  },
  {
    id: "12",
    name: "Tanjung Tarabitan",
    type: "Wisata",
    category: "Pantai",
    image: {
      uri: "https://th.bing.com/th/id/OIP.6uN1MZzELOHlWnH7r7X2SAHaD4?w=338&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    description:
      "Area tanjung dengan pantai indah dan pemandangan laut lepas yang memukau.",
    location: "Likupang Barat, Minahasa Utara",
    coordinates: {
      latitude: 1.7383812600297632,
      longitude: 124.98513273708187,
    },
    audioFile: "tanjung tarabitan.mp3",
  },
  {
    id: "13",
    name: "Arung Jeram Sawangan",
    type: "Wisata",
    category: "Petualangan",
    image: {
      uri: "https://th.bing.com/th/id/OIP.Xlqmh2h_jMd62wmNDAnn0QHaEK?w=302&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    description:
      "Lokasi arung jeram menantang dengan pemandangan alam yang indah di sepanjang jalur sungai.",
    location: "Sawangan, Minahasa Utara",
    coordinates: {
      latitude: 1.3930915799446035,
      longitude: 124.96360239968145,
    },
    audioFile: "arum jeram sawangan.mp3",
  },
  {
    id: "14",
    name: "Taman Makam Pahlawan Maria Walanda Maramis",
    type: "Wisata",
    category: "Sejarah",
    image: {
      uri: "https://th.bing.com/th/id/OIP.XxnZwa91Ok6pIZwyH76IowHaEK?w=295&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    description:
      "Situs sejarah yang mengenang jasa pahlawan nasional Maria Walanda Maramis, pejuang hak perempuan.",
    location: "Airmadidi, Minahasa Utara",
    coordinates: { latitude: 1.4096, longitude: 124.9833 },
    audioFile: "walanda maramis.mp3",
  },
  {
    id: "15",
    name: "Merawale",
    type: "Budaya",
    category: "Tradisi",
    image: {
      uri: "https://th.bing.com/th/id/OIP.JWq5gRr1drgMdUrKjF7RkwHaFc?w=242&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    description:
      "Tradisi musyawarah masyarakat Minahasa untuk menyelesaikan permasalahan bersama secara kekeluargaan.",
    location: "Minahasa Utara",
    audioFile: "marawale.mp3",
  },
  {
    id: "16",
    name: "Mapalus",
    type: "Budaya",
    category: "Tradisi",
    image: {
      uri: "https://asset-2.tstatic.net/tribunmanadowiki/foto/bank/images/ilustrasi-mapalus.jpg",
    },
    description:
      "Sistem gotong royong dan kerja sama tradisional masyarakat Minahasa dalam berbagai kegiatan sosial dan pertanian.",
    location: "Minahasa Utara",
    audioFile: "mapalus.mp3",
  },
  {
    id: "17",
    name: "Adat Tulude Desa Budo",
    type: "Budaya",
    category: "Upacara",
    image: {
      uri: "https://upload.wikimedia.org/wikipedia/commons/6/65/Kue_tamo.jpg",
    },
    description:
      "Upacara tradisional yang dilaksanakan sebagai ucapan syukur dan harapan untuk tahun baru yang lebih baik.",
    location: "Minahasa Utara",
    audioFile: "desa budo.mp3",
  },
  {
    id: "18",
    name: "Tari Tumatenden",
    type: "Budaya",
    category: "Tarian",
    image: {
      uri: "https://t-2.tstatic.net/tribunnewswiki/foto/bank/images/Tari-Tumatenden-3.jpg",
    },
    description:
      "Tarian tradisional Minahasa yang menggambarkan kesopanan dan keramahan gadis-gadis Minahasa.",
    location: "Minahasa Utara",
    audioFile: "tari tumatenden.mp3",
  },
  {
    id: "19",
    name: "Tari Ampe Wayer",
    type: "Budaya",
    category: "Tarian",
    image: {
      uri: "https://upload.wikimedia.org/wikipedia/commons/1/19/Ampa_wayer.jpg",
    },
    description:
      "Tarian lincah dan energik yang dilakukan secara berkelompok, menunjukkan kegembiraan dan persaudaraan.",
    location: "Minahasa Utara",
    audioFile: "ampe wayer.mp3",
  },
  {
    id: "20",
    name: "Tradisi Pemakaman Waruga",
    type: "Budaya",
    category: "Tradisi",
    image: {
      uri: "https://th.bing.com/th/id/OIP.CqI5tJ5TzSR1HrRbIdni7AHaE7?rs=1&pid=ImgDetMain",
    },
    description:
      "Tradisi pemakaman kuno masyarakat Minahasa menggunakan peti batu berbentuk kubus yang unik.",
    location: "Minahasa Utara",
    audioFile: "waruga.mp3",
  },
  {
    id: "21",
    name: "Pengucapan Syukur",
    type: "Budaya",
    category: "Upacara",
    image: {
      uri: "https://student-activity.binus.ac.id/bssc/wp-content/uploads/sites/38/2022/10/PENGUCAPAN-SYUKUR-MINAHASAN-VERSION-OF-THANKSGIVING-image1.jpg",
    },
    description:
      "Festival tahunan yang menunjukkan rasa syukur atas hasil panen, ditandai dengan pesta dan berbagi makanan.",
    location: "Minahasa Utara",
    audioFile: "pengucapan.mp3",
  },
  {
    id: "22",
    name: "Kolintang",
    type: "Budaya",
    category: "Tradisi",
    image: {
      uri: "https://www.djkn.kemenkeu.go.id/files/images/2021/09/Manado_-_Kolintang_IE1.jpeg",
    },
    description:
      "Kolintang adalah alat musik perkusi tradisional dari Minahasa, terdiri dari bilah-bilah kayu yang disusun sejajar dan dipukul dengan stik khusus untuk menghasilkan melodi yang khas.",
    location: "Minahasa Utara",
    audioFile: "kolintang.mp3",
  },
];

const ExploreScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [activeMainCategory, setActiveMainCategory] = useState("All");
  const [filteredItems, setFilteredItems] =
    useState<ExtendedCulturalItem[]>(culturalItems);
  const [selectedItem, setSelectedItem] = useState<ExtendedCulturalItem | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);

  const { savedItems, saveItem, removeItem, isItemSaved } = useSavedItems();

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

  useEffect(() => {
    let result = culturalItems;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          (item.location && item.location.toLowerCase().includes(query)) ||
          item.category.toLowerCase().includes(query)
      );
    }

    // Filter by main category (Wisata/Budaya/All)
    if (activeMainCategory !== "All") {
      result = result.filter((item) => item.type === activeMainCategory);
    }

    // Filter by subcategory
    if (activeTab === "3D Model") {
      // Show only items with 3D models
      result = result.filter((item) => has3DModel(item.name));
    } else if (activeTab !== "All") {
      result = result.filter((item) => item.category === activeTab);
    }

    setFilteredItems(result);
  }, [searchQuery, activeMainCategory, activeTab]);

  const handleMainCategoryChange = (category: string) => {
    setActiveMainCategory(category);
    setActiveTab("All"); // Reset subcategory when main category changes
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const getSubcategories = () => {
    const subcategories = new Set<string>();

    let items = culturalItems;
    if (activeMainCategory !== "All") {
      items = items.filter((item) => item.type === activeMainCategory);
    }

    items.forEach((item) => subcategories.add(item.category));

    // Check if any filtered items have 3D models
    const has3DItems = items.some((item) => has3DModel(item.name));

    // If there are items with 3D models, add "3D Model" to subcategories
    const allCategories = ["All", ...Array.from(subcategories)];
    if (has3DItems) {
      allCategories.push("3D Model");
    }

    return allCategories;
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
        setIsLoading(true);

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

        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error playing audio:", error);
      setIsLoading(false);
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const seekAudio = async (position: number) => {
    if (sound) {
      await sound.setPositionAsync(position);
    }
  };

  const has3DModel = (itemName: string): boolean => {
    return itemName === "Waruga Sawangan" || itemName === "Kolintang";
  };

  const open3DModel = (itemName: string) => {
    if (has3DModel(itemName)) {
      navigation.navigate("ModelViewer", {
        modelInfo: {
          name: itemName,
          modelUrl: getModelUrlForItem(itemName),
          description: get3DModelDescription(itemName),
        },
      });
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

  const renderCultureItem = ({ item }: { item: ExtendedCulturalItem }) => {
    const saved = isItemSaved(item.id);
    const has3DModel =
      item.name === "Waruga Sawangan" || item.name === "Kolintang";

    return (
      <View>
        <TouchableOpacity
          style={styles.itemCard}
          activeOpacity={0.7}
          onPress={() => handleItemPress(item)}
        >
          <Image source={item.image} style={styles.itemImage} />
          {has3DModel && (
            <View style={styles.model3dBadge}>
              <Ionicons name="cube-outline" size={14} color="#fff" />
              <Text style={styles.model3dBadgeText}>3D</Text>
            </View>
          )}
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
              {has3DModel && (
                <View style={[styles.badge, styles.model3dBadgeSmall]}>
                  <Text style={styles.model3dTypeSmall}>3D</Text>
                </View>
              )}
            </View>
            <Text style={styles.itemDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const handleItemPress = (item: ExtendedCulturalItem) => {
    setSelectedItem(item);
    setModalVisible(true);
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

      <View style={styles.mainCategoryTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mainCategoryTabs}
        >
          <TouchableOpacity
            style={[
              styles.mainCategoryTab,
              activeMainCategory === "All" && styles.activeMainCategoryTab,
            ]}
            onPress={() => handleMainCategoryChange("All")}
          >
            <Text
              style={[
                styles.mainCategoryTabText,
                activeMainCategory === "All" &&
                  styles.activeMainCategoryTabText,
              ]}
            >
              Semua
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.mainCategoryTab,
              activeMainCategory === "Wisata" && styles.activeMainCategoryTab,
            ]}
            onPress={() => handleMainCategoryChange("Wisata")}
          >
            <Text
              style={[
                styles.mainCategoryTabText,
                activeMainCategory === "Wisata" &&
                  styles.activeMainCategoryTabText,
              ]}
            >
              Wisata
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.mainCategoryTab,
              activeMainCategory === "Budaya" && styles.activeMainCategoryTab,
            ]}
            onPress={() => handleMainCategoryChange("Budaya")}
          >
            <Text
              style={[
                styles.mainCategoryTabText,
                activeMainCategory === "Budaya" &&
                  styles.activeMainCategoryTabText,
              ]}
            >
              Budaya
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {getSubcategories().map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => handleTabChange(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab === "All" ? "Semua" : tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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

              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    if (!selectedItem) return;

                    if (isItemSaved(selectedItem.id)) {
                      removeItem(selectedItem.id);
                      ToastAndroid.show(
                        "Item dihapus dari tersimpan",
                        ToastAndroid.SHORT
                      );
                    } else {
                      saveItem(selectedItem);
                      ToastAndroid.show(
                        "Item berhasil disimpan",
                        ToastAndroid.SHORT
                      );
                    }
                  }}
                >
                  <Ionicons
                    name={
                      isItemSaved(selectedItem?.id || "")
                        ? "bookmark"
                        : "bookmark-outline"
                    }
                    size={20}
                    color="#fff"
                    style={styles.actionButtonIcon}
                  />
                  <Text style={styles.actionButtonText}>
                    {isItemSaved(selectedItem?.id || "")
                      ? "Hapus dari Tersimpan"
                      : "Simpan"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    if (!selectedItem) return;
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
                    style={styles.actionButtonIcon}
                  />
                  <Text style={styles.actionButtonText}>Bagikan</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.audioPlayerContainer}>
                <Text style={styles.sectionTitle}>Audio Penjelasan</Text>

                <View style={styles.audioPlayer}>
                  <TouchableOpacity
                    style={styles.playPauseButton}
                    disabled={isLoading}
                    onPress={togglePlayback}
                  >
                    <Ionicons
                      name={
                        isLoading
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

              {(selectedItem?.name === "Waruga Sawangan" ||
                selectedItem?.name === "Kolintang") && (
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

              {selectedItem?.name === "Tari Tumatenden" && (
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
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#252129",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontFamily: "Gabarito-SemiBold",
    fontSize: 14,
  },
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
  itemTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  savedIcon: {
    marginLeft: 6,
  },
  mainCategoryTabsContainer: {
    marginBottom: 8,
  },
  mainCategoryTabs: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  mainCategoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  activeMainCategoryTab: {
    backgroundColor: "#252129",
    borderColor: "#252129",
  },
  mainCategoryTabText: {
    fontFamily: "Gabarito-SemiBold",
    fontSize: 14,
    color: "#666",
  },
  activeMainCategoryTabText: {
    color: "#fff",
  },
  tabsContainer: {
    marginBottom: 10,
  },
  tabs: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
  },
  activeTab: {
    backgroundColor: "#e0e0e0",
  },
  tabText: {
    fontFamily: "Gabarito-Regular",
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#252129",
    fontFamily: "Gabarito-SemiBold",
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

export default ExploreScreen;
