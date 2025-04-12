import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Gabarito_400Regular, Gabarito_500Medium, Gabarito_600SemiBold, Gabarito_700Bold } from '@expo-google-fonts/gabarito';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const HISTORY_DATA = [
  {
    id: '1',
    title: 'Masa Kolonial',
    year: '1694-1945',
    description: 'Minahasa Utara didirikan di bawah pemerintahan kolonial Belanda, menjadi pos perdagangan penting untuk rempah-rempah dan produk pertanian di Indonesia Timur.',
    image: 'https://asset-a.grid.id/crop/0x0:0x0/700x465/photo/2023/01/14/kerja-rodijpg-20230114120151.jpg'
  },
  {
    id: '2',
    title: 'Era Kemerdekaan',
    year: '1945-1995',
    description: 'Setelah kemerdekaan Indonesia, wilayah ini mulai mengembangkan identitas budayanya yang unik sambil mempertahankan praktik tradisionalnya.',
    image: 'https://asset.kompas.com/crops/M6g2jc3L0CM75Yx3Mp4sD6_cZfg=/25x0:577x368/780x390/data/photo/2024/04/28/662e681b5c936.jpg'
  },
  {
    id: '3',
    title: 'Pertumbuhan Modern',
    year: '1995-Sekarang',
    description: 'Minahasa Utara secara resmi dibentuk sebagai kabupaten pada tahun 2003, memisahkan diri dari Kabupaten Minahasa untuk lebih baik melayani kebutuhan unik masyarakatnya.',
    image: 'https://lh3.googleusercontent.com/-yCDeqL43WNk/ZHnxlZrdflI/AAAAAAAAAgg/XdR1bhkJaUEgNn_AuGS7SAYRUJnNP1T5wCNcBGAsYHQ/s1600/e60ce523bb2772ee4c60396e8b51974610690d8bc39ca0705da0288624d41aac.0.JPG.jpg'
  }
];

const CULTURAL_LANDMARKS = [
  {
    id: '1',
    name: 'Pulau Lihaga',
    description: 'Pantai pasir putih yang masih alami dengan air kristal yang jernih',
    image: 'https://source.unsplash.com/qCrocisvGwc'
  },
  {
    id: '2',
    name: 'Pulau Gangga',
    description: 'Terkenal dengan terumbu karang yang indah dan tempat menyelam',
    image: 'https://source.unsplash.com/5hvn-2WW6rY'
  },
  {
    id: '3',
    name: 'Gunung Klabat',
    description: 'Puncak tertinggi di Sulawesi Utara dengan pemandangan yang menakjubkan',
    image: 'https://source.unsplash.com/a_V4dDwJ7_0'
  }
];

const LOCAL_FOODS = [
  {
    id: '1',
    name: 'Tinutuan (Bubur Manado)',
    description: 'Bubur sayur dengan nasi kuning dan berbagai macam rempah lokal',
    image: 'https://asset.kompas.com/crops/8IPl4RcIfLh3fkwXhKHPuPHqoz8=/81x22:892x563/750x500/data/photo/2020/05/13/5ebbdec618a37.jpg'
  },
  {
    id: '2',
    name: 'Cakalang Fufu',
    description: 'Ikan cakalang asap, hidangan khas daerah ini',
    image: 'https://resepmamiku.com/wp-content/uploads/2022/06/cakalang-fufu-rica-rica-yscooking-e1681434213206-850x771.jpg'
  }
];

const { width } = Dimensions.get('window');

const NorthMinahasa = () => {
  const scrollY = new Animated.Value(0);
  const scrollRef = useRef(null);

  const [fontsLoaded] = useFonts({
    GabaritoRegular: Gabarito_400Regular,
    GabaritoMedium: Gabarito_500Medium,
    GabaritoSemiBold: Gabarito_600SemiBold,
    GabaritoBold: Gabarito_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  const navOpacity = scrollY.interpolate({
    inputRange: [0, 100, 150],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.heroContainer}>
        <ImageBackground 
          source={{uri: 'https://source.unsplash.com/xeBVehbu_2U'}}
          style={styles.heroImage}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
            style={styles.heroOverlay}
          >
            <View style={styles.heroContent}>
              <View style={styles.locationBadge}>
                <Icon name="location" size={14} color="#fff" />
                <Text style={styles.locationText}>SULAWESI UTARA, INDONESIA</Text>
              </View>
              <Text style={styles.heroTitle}>Minahasa Utara</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Main Content */}
      <ScrollView>
        {/* Overview Section */}
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Icon name="information-circle" size={24} color="#252129" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Deskripsi</Text>
            </View>
          </View>
          
          <View style={styles.overviewCard}>
            <Text style={styles.overviewText}>
              Minahasa Utara adalah kabupaten di provinsi Sulawesi Utara, Indonesia, yang didirikan pada tahun 2003. Terkenal dengan pantainya yang menakjubkan, air laut yang jernih, dan warisan budaya yang kaya, kabupaten ini merupakan permata tersembunyi di Indonesia Timur.
            </Text>
            
            <View style={styles.factContainer}>
              <View style={styles.factItem}>
                <Icon name="people-outline" size={24} color="#252129" />
                <Text style={styles.factValue}>~200.000</Text>
                <Text style={styles.factLabel}>Populasi</Text>
              </View>
              <View style={styles.factItem}>
                <Icon name="map-outline" size={24} color="#252129" />
                <Text style={styles.factValue}>1.059,24 km²</Text>
                <Text style={styles.factLabel}>Luas</Text>
              </View>
              <View style={styles.factItem}>
                <Icon name="business-outline" size={24} color="#252129" />
                <Text style={styles.factValue}>Airmadidi</Text>
                <Text style={styles.factLabel}>Ibukota</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* History Timeline Section */}
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Icon name="time" size={24} color="#252129" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Timeline Sejarah</Text>
            </View>
          </View>
          
          <View style={styles.timelineContainer}>
            {HISTORY_DATA.map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineLine}>
                  <View style={styles.timelineDot} />
                  {index !== HISTORY_DATA.length - 1 && <View style={styles.timelineConnector} />}
                </View>
                <View style={styles.timelineCard}>
                  <Image source={{ uri: item.image }} style={styles.timelineImage} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineYear}>{item.year}</Text>
                    <Text style={styles.timelineTitle}>{item.title}</Text>
                    <Text style={styles.timelineDescription}>{item.description}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Icon name="compass" size={24} color="#252129" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Landmark</Text>
            </View>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.landmarksContainer}
          >
            {CULTURAL_LANDMARKS.map((landmark) => (
              <TouchableOpacity key={landmark.id} style={styles.landmarkCard}>
                <Image source={{ uri: landmark.image }} style={styles.landmarkImage} />
                <View style={styles.landmarkContent}>
                  <Text style={styles.landmarkName}>{landmark.name}</Text>
                  <Text style={styles.landmarkDescription}>{landmark.description}</Text>
                  <View style={styles.landmarkButton}>
                    <Text style={styles.landmarkButtonText}>Jelajahi</Text>
                    <Icon name="arrow-forward" size={16} color="#fff" style={styles.landmarkButtonIcon} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Interactive Map Section */}
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Icon name="map" size={24} color="#252129" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Geografi</Text>
            </View>
          </View>
          
          <View style={styles.mapContainer}>
            <Image 
              source={{uri: 'https://source.unsplash.com/pJ-fHPL2nbU'}} 
              style={styles.mapImage}
            />
            
            <View style={styles.mapOverlay}>
              <Text style={styles.mapTitle}>Wilayah Minahasa Utara</Text>
              <Text style={styles.mapSubtitle}>10 kecamatan • 125 desa</Text>
            </View>
            
            {/* Map Markers */}
            <View style={[styles.mapMarker, { top: '30%', left: '25%' }]}>
              <View style={[styles.markerDot, {backgroundColor: '#3498db'}]} />
              <View style={styles.markerLabel}>
                <Text style={styles.markerText}>Likupang</Text>
              </View>
            </View>
            
            <View style={[styles.mapMarker, { top: '50%', left: '60%' }]}>
              <View style={[styles.markerDot, {backgroundColor: '#27ae60'}]} />
              <View style={styles.markerLabel}>
                <Text style={styles.markerText}>Airmadidi</Text>
              </View>
            </View>
            
            <View style={[styles.mapMarker, { top: '70%', left: '40%' }]}>
              <View style={[styles.markerDot, {backgroundColor: '#f39c12'}]} />
              <View style={styles.markerLabel}>
                <Text style={styles.markerText}>Kema</Text>
              </View>
            </View>
            
            <View style={styles.mapLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, {backgroundColor: '#3498db'}]} />
                <Text style={styles.legendText}>Wilayah Pesisir</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, {backgroundColor: '#27ae60'}]} />
                <Text style={styles.legendText}>Dataran Tinggi</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, {backgroundColor: '#f39c12'}]} />
                <Text style={styles.legendText}>Pusat Kota</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.map3DButton}>
              <Text style={styles.map3DButtonText}>Lihat Peta 3D</Text>
              <Icon name="cube-outline" size={18} color="#fff" style={{marginLeft: 8}} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.mapInfoCard}>
            <View style={styles.mapInfoHeader}>
              <Icon name="analytics-outline" size={20} color="#252129" />
              <Text style={styles.mapInfoTitle}>Data Geografi</Text>
            </View>
            <View style={styles.mapInfoGrid}>
              <View style={styles.mapInfoItem}>
                <Text style={styles.mapInfoValue}>45%</Text>
                <Text style={styles.mapInfoLabel}>Dataran Tinggi</Text>
              </View>
              <View style={styles.mapInfoItem}>
                <Text style={styles.mapInfoValue}>35%</Text>
                <Text style={styles.mapInfoLabel}>Pesisir</Text>
              </View>
              <View style={styles.mapInfoItem}>
                <Text style={styles.mapInfoValue}>20%</Text>
                <Text style={styles.mapInfoLabel}>Perkotaan</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Tourism Section */}
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Icon name="restaurant" size={24} color="#252129" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Kuliner Lokal</Text>
            </View>
          </View>
          
          <View style={styles.foodGrid}>
            {LOCAL_FOODS.map((food) => (
              <TouchableOpacity key={food.id} style={styles.foodCard}>
                <Image source={{ uri: food.image }} style={styles.foodImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.9)']}
                  style={styles.foodGradient}
                />
                <View style={styles.foodContent}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodDescription}>{food.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Traditional Arts Section */}
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Icon name="brush" size={24} color="#252129" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Seni Tradisional</Text>
            </View>
          </View>
          
          <View style={styles.artCard}>
            <Image source={{uri: 'https://source.unsplash.com/7b9a04MFields'}} style={styles.artImage} />
            <View style={styles.artContent}>
              <Text style={styles.artTitle}>Tari Cakalele</Text>
              <Text style={styles.artDescription}>
                Tarian perang tradisional masyarakat Minahasa yang ditampilkan selama upacara dan perayaan. Penari menggunakan perisai dan tombak sambil bergerak dalam pola yang sinkron.
              </Text>
              <TouchableOpacity style={styles.artButton}>
                <Text style={styles.artButtonText}>Tonton Pertunjukan</Text>
                <Icon name="play-circle-outline" size={20} color="#252129" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NorthMinahasa;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  heroContainer: {
    height: 280,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  heroContent: {
    padding: 24,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 33, 41, 0.8)',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 14,
  },
  locationText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'GabaritoMedium',
    marginLeft: 6,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 40,
    fontFamily: 'GabaritoBold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  navTitle: {
    fontSize: 18,
    fontFamily: 'GabaritoSemiBold',
    color: '#252129',
  },
  navIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navIcon: {
    padding: 10,
    marginLeft: 12,
  },
  tabsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tabsScrollContent: {
    paddingHorizontal: 24,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: '#252129',
  },
  tabText: {
    fontSize: 15,
    fontFamily: 'GabaritoRegular',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontFamily: 'GabaritoSemiBold',
  },
  contentSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    paddingTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'GabaritoBold',
    color: '#333',
  },
  overviewCard: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  overviewText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#555',
    marginBottom: 24,
    fontFamily: 'GabaritoRegular',
    textAlign: 'justify',
  },
  factContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  factItem: {
    alignItems: 'center',
  },
  factValue: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    fontFamily: 'GabaritoBold',
  },
  factLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontFamily: 'GabaritoRegular',
  },
  timelineContainer: {
    paddingLeft: 24,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 34,
  },
  timelineLine: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#252129',
    borderWidth: 3,
    borderColor: 'rgba(175, 175, 175, 0.2)',
    zIndex: 2,
  },
  timelineConnector: {
    position: 'absolute',
    top: 15,
    bottom: -34,
    width: 2,
    backgroundColor: 'rgba(175, 175, 175, 0.2)',
    left: 11,
  },
  timelineCard: {
    flex: 1,
    marginLeft: 12,
    marginRight: 24,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  timelineImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  timelineContent: {
    padding: 18,
    position: 'relative',
    zIndex: 2,
  },
  timelineYear: {
    fontSize: 14,
    color: '#252129',
    fontFamily: 'GabaritoBold',
  },
  timelineTitle: {
    fontSize: 18,
    marginVertical: 6,
    fontFamily: 'GabaritoBold',
  },
  timelineDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    fontFamily: 'GabaritoRegular',
    textAlign: 'justify',
  },
  mapContainer: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: 260,
    resizeMode: 'cover',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  mapTitle: {
    fontSize: 18,
    fontFamily: 'GabaritoBold',
  },
  mapSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontFamily: 'GabaritoRegular',
  },
  mapMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  markerLabel: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  markerText: {
    fontSize: 12,
    fontFamily: 'GabaritoMedium',
    color: '#333',
  },
  mapLegend: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.9)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'GabaritoRegular',
  },
  map3DButton: {
    position: 'absolute',
    right: 14,
    bottom: 65,
    backgroundColor: '#252129',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  map3DButtonText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'GabaritoSemiBold',
  },
  mapInfoCard: {
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 18,
  },
  mapInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapInfoTitle: {
    fontSize: 16,
    fontFamily: 'GabaritoBold',
    color: '#252129',
    marginLeft: 8,
  },
  mapInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapInfoItem: {
    alignItems: 'center',
  },
  mapInfoValue: {
    fontSize: 18,
    fontFamily: 'GabaritoBold',
    color: '#252129',
  },
  mapInfoLabel: {
    fontSize: 12,
    fontFamily: 'GabaritoRegular',
    color: '#666',
    marginTop: 4,
  },
  landmarksContainer: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  landmarkCard: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#252129',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 2,
  },
  landmarkImage: {
    width: '100%',
    height: 190,
    resizeMode: 'cover',
  },
  landmarkContent: {
    padding: 20,
  },
  landmarkName: {
    fontSize: 20,
    fontFamily: 'GabaritoBold',
    marginBottom: 6,
  },
  landmarkDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 18,
    fontFamily: 'GabaritoRegular',
    lineHeight: 20,
    textAlign: 'justify',
  },
  landmarkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252129',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  landmarkButtonText: {
    color: '#fff',
    marginRight: 6,
    fontFamily: 'GabaritoSemiBold',
  },
  landmarkButtonIcon: {
    marginTop: 1,
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  foodCard: {
    width: (width - 56) / 2,
    height: 190,
    margin: 6,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  foodGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  foodContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
  },
  foodName: {
    fontSize: 17,
    fontFamily: 'GabaritoBold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  foodDescription: {
    fontSize: 12,
    color: '#eee',
    marginTop: 6,
    fontFamily: 'GabaritoRegular',
    lineHeight: 18,
    textAlign: 'justify',
  },
  artCard: {
    marginHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  artImage: {
    width: '100%',
    height: 190,
    resizeMode: 'cover',
  },
  artContent: {
    padding: 20,
  },
  artTitle: {
    fontSize: 20,
    fontFamily: 'GabaritoBold',
    marginBottom: 12,
  },
  artDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    marginBottom: 18,
    fontFamily: 'GabaritoRegular',
    textAlign: 'justify',
  },
  artButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: '#252129',
    borderRadius: 30,
  },
  artButtonText: {
    color: '#252129',
    fontFamily: 'GabaritoSemiBold',
    marginRight: 10,
  },
});