import React, { useRef, useEffect, useState } from 'react';
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
  Linking,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Gabarito_400Regular, Gabarito_500Medium, Gabarito_600SemiBold, Gabarito_700Bold } from '@expo-google-fonts/gabarito';
import MapView, { Marker, PROVIDER_DEFAULT, Polygon } from 'react-native-maps';

const NORTH_MINAHASA_COORDINATES = [
  { latitude: 1.4074, longitude: 124.9121 },
  { latitude: 1.3836, longitude: 124.9748 },
  { latitude: 1.3571, longitude: 125.0560 },
  { latitude: 1.4630, longitude: 125.1128 },
  { latitude: 1.5736, longitude: 125.1417 },
  { latitude: 1.6728, longitude: 125.0694 },
  { latitude: 1.7236, longitude: 125.0145 },
  { latitude: 1.7010, longitude: 124.9398 },
  { latitude: 1.6425, longitude: 124.8893 },
  { latitude: 1.5369, longitude: 124.8812 },
  { latitude: 1.4074, longitude: 124.9121 },
];

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
    name: 'Kaki Dian',
    description: 'Kaki Dian adalah sebuah menara dengan bentuk kaki dian dengan ketinggian 19 meter yang terletak sekitar 3 km dari kota Airmadidi.',
    image: 'https://tablet-mag-images.b-cdn.net/production/a4b6d4a4c9ba8949ca7bff7be7f3b7efa5935e78-380x255.jpg?w=1300&q=70&auto=format&dpr=1'
  },
  {
    id: '2',
    name: 'Pantai Paal',
    description: 'Pantai dengan pasir putih nya yang indah menjadi daya tarik para wisatawan untuk bersantai dan menikmati keindahan laut',
    image: 'https://asset.kompas.com/crops/JV80V1xLTrAy8H6RAynNKT89fxA=/0x0:1200x800/750x500/data/photo/2021/09/09/613a0c89504c6.jpg'
  },
  {
    id: '3',
    name: 'Gunung Klabat',
    description: 'Merupakan gunung tertinggi di Sulawesi Utara dengan pemandangan yang menakjubkan dan jalur pendakian yang menantang',
    image: 'https://statik.tempo.co/data/2021/01/05/id_992102/992102_720.jpg'
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
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timelineAnimations = useRef(HISTORY_DATA.map(() => new Animated.Value(0))).current;
  const landmarkAnimations = useRef(CULTURAL_LANDMARKS.map(() => new Animated.Value(0))).current;
  const foodAnimations = useRef(LOCAL_FOODS.map(() => new Animated.Value(0))).current;
  const [fullMapVisible, setFullMapVisible] = useState(false);

  useEffect(() => {
    // Fade in main content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Staggered animations for timeline items
    Animated.stagger(
      200,
      timelineAnimations.map(anim =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      )
    ).start();

    // Staggered animations for landmarks
    Animated.stagger(
      150,
      landmarkAnimations.map(anim =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      )
    ).start();

    // Staggered animations for food items
    Animated.stagger(
      150,
      foodAnimations.map(anim =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  // Hero image parallax effect
  const heroImageTranslate = scrollY.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [50, 0, -30],
    extrapolate: 'clamp',
  });

  // Hero content scale effect
  const heroContentScale = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [1.1, 1, 0.9],
    extrapolate: 'clamp',
  });

   ({
    GabaritoRegular: Gabarito_400Regular,
    GabaritoMedium: Gabarito_500Medium,
    GabaritoSemiBold: Gabarito_600SemiBold,
    GabaritoBold: Gabarito_700Bold,
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.heroContainer}>
        <Animated.View
          style={{
            transform: [{ translateY: heroImageTranslate }],
            height: '100%',
            width: '100%',
          }}
        >
          <ImageBackground 
            source={{uri: 'https://getlost.id/wp-content/uploads/2020/09/waruga_1420887923.jpg'}}
            style={styles.heroImage}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
              style={styles.heroOverlay}
            >
              <Animated.View 
                style={[
                  styles.heroContent,
                  { transform: [{ scale: heroContentScale }] }
                ]}
              >
                <View style={styles.locationBadge}>
                  <Icon name="location" size={14} color="#fff" />
                  <Text style={styles.locationText}>SULAWESI UTARA, INDONESIA</Text>
                </View>
                <Text style={styles.heroTitle}>Minahasa Utara</Text>
              </Animated.View>
            </LinearGradient>
          </ImageBackground>
        </Animated.View>
      </View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        style={{ opacity: fadeAnim }}
      >
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
        
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Icon name="time" size={24} color="#252129" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Timeline Sejarah</Text>
            </View>
          </View>
          
          <View style={styles.timelineContainer}>
            {HISTORY_DATA.map((item, index) => (
              <Animated.View 
                key={item.id} 
                style={[
                  styles.timelineItem,
                  {
                    opacity: timelineAnimations[index],
                    transform: [
                      { 
                        translateX: timelineAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [-50, 0]
                        }) 
                      }
                    ]
                  }
                ]}
              >
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
              </Animated.View>
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
            {CULTURAL_LANDMARKS.map((landmark, index) => (
              <Animated.View 
                key={landmark.id} 
                style={{
                  opacity: landmarkAnimations[index],
                  transform: [
                    { 
                      translateY: landmarkAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0]
                      }) 
                    }
                  ]
                }}
              >
                <TouchableOpacity style={styles.landmarkCard}>
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
              </Animated.View>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Icon name="map" size={24} color="#252129" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Geografi</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewMoreButton}
              onPress={() => setFullMapVisible(true)}
            >
              <Text style={styles.viewMoreText}>Lihat Peta Lengkap</Text>
              <Icon name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_DEFAULT}
              style={styles.mapImage}
              initialRegion={{
                latitude: 1.5321,
                longitude: 124.9999,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
              }}
              mapType="terrain"
            >
              {/* Main polygon with fill */}
              <Polygon
                coordinates={NORTH_MINAHASA_COORDINATES}
                strokeColor="#3498db"
                fillColor="rgba(52, 152, 219, 0.2)"
                strokeWidth={2.5}
              />
              
              {/* Outer glow effect */}
              <Polygon
                coordinates={NORTH_MINAHASA_COORDINATES}
                strokeColor="rgba(52, 152, 219, 0.6)"
                fillColor="transparent"
                strokeWidth={5}
                zIndex={1}
              />
              
              {/* Inner highlight effect */}
              <Polygon
                coordinates={NORTH_MINAHASA_COORDINATES}
                strokeColor="#ffffff"
                fillColor="transparent"
                strokeWidth={1}
                zIndex={2}
              />
              
              {/* Keep your existing markers */}
              <Marker
                coordinate={{ latitude: 1.4396, longitude: 124.9824 }}
                title="Airmadidi"
                description="Ibukota Kabupaten Minahasa Utara"
              >
                <View>
                  <View style={[styles.markerDot, {backgroundColor: '#27ae60'}]} />
                </View>
              </Marker>
              
              <Marker
                coordinate={{ latitude: 1.6728, longitude: 125.0694 }}
                title="Likupang"
                description="Wilayah Pesisir"
              >
                <View>
                  <View style={[styles.markerDot, {backgroundColor: '#3498db'}]} />
                </View>
              </Marker>
              
              <Marker
                coordinate={{ latitude: 1.3667, longitude: 125.0667 }}
                title="Kema"
                description="Pusat Kota"
              >
                <View>
                  <View style={[styles.markerDot, {backgroundColor: '#f39c12'}]} />
                </View>
              </Marker>
            </MapView>
            
            <View style={styles.mapOverlay}>
              <View style={styles.mapBadge}>
                <Icon name="locate" size={12} color="#fff" style={{marginRight: 5}} />
                <Text style={styles.mapBadgeText}>Kabupaten Minahasa Utara</Text>
              </View>
              <Text style={styles.mapSubtitle}>10 kecamatan • 125 desa</Text>
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
        
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Icon name="restaurant" size={24} color="#252129" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Kuliner Lokal</Text>
            </View>
          </View>
          
          <View style={styles.foodGrid}>
            {LOCAL_FOODS.map((food, index) => (
              <Animated.View
                key={food.id} 
                style={{
                  opacity: foodAnimations[index],
                  transform: [
                    { 
                      scale: foodAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1]
                      }) 
                    }
                  ]
                }}
              >
                <TouchableOpacity style={styles.foodCard}>
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
              </Animated.View>
            ))}
          </View>
        </View>
        
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Icon name="brush" size={24} color="#252129" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Seni Tradisional</Text>
            </View>
          </View>
          
          <Animated.View 
            style={[
              styles.artCard,
              {
                opacity: fadeAnim,
                transform: [
                  { 
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0]
                    }) 
                  }
                ]
              }
            ]}
          >
            <Image source={{uri: 'https://th.bing.com/th/id/R.2b174167240b813124d88cc13015282c?rik=on23Xfi47Auz%2bg&riu=http%3a%2f%2f1.bp.blogspot.com%2f-WPcJLJklBcI%2fVNFXF_wlVKI%2fAAAAAAAACYE%2fkbg8yH1Fno4%2fs1600%2f17.jpg&ehk=ipDdJKc2lhFy9H0lIy9r01MFDZILY7qqFFu5UsepbMQ%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1'}} style={styles.artImage} />
            <View style={styles.artContent}>
              <Text style={styles.artTitle}>Kabasaran</Text>
              <Text style={styles.artDescription}>
                Tarian perang tradisional Minahasa yang ditampilkan dalam upacara-upacara adat penting. Penari menggunakan perisai dan tombak sambil melakukan gerakan yang dinamis dan penuh semangat.
              </Text>
              <TouchableOpacity 
                style={styles.artButton}
                onPress={() => Linking.openURL('https://youtu.be/CMcQdnKEAbI?si=pumlXiVff1vsoGLU')}
              >
                <Text style={styles.artButtonText}>Tonton Pertunjukan</Text>
                <Icon name="play-circle-outline" size={20} color="#252129" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Animated.ScrollView>
      
      {/* Full Map Modal */}
      <Modal
        visible={fullMapVisible}
        animationType="slide"
        onRequestClose={() => setFullMapVisible(false)}
      >
        <View style={styles.fullMapContainer}>
          <MapView
            provider={PROVIDER_DEFAULT}
            style={styles.fullMapView}
            initialRegion={{
              latitude: 1.5321,
              longitude: 124.9999,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }}
            mapType="terrain"
          >
            {/* Main polygon with fill */}
            <Polygon
              coordinates={NORTH_MINAHASA_COORDINATES}
              strokeColor="#3498db"
              fillColor="rgba(52, 152, 219, 0.2)"
              strokeWidth={2.5}
            />
            
            {/* Outer glow effect */}
            <Polygon
              coordinates={NORTH_MINAHASA_COORDINATES}
              strokeColor="rgba(52, 152, 219, 0.6)"
              fillColor="transparent"
              strokeWidth={5}
              zIndex={1}
            />
            
            {/* Inner highlight effect */}
            <Polygon
              coordinates={NORTH_MINAHASA_COORDINATES}
              strokeColor="#ffffff"
              fillColor="transparent"
              strokeWidth={1}
              zIndex={2}
            />
            
            {/* Map markers */}
            <Marker
              coordinate={{ latitude: 1.4396, longitude: 124.9824 }}
              title="Airmadidi"
              description="Ibukota Kabupaten Minahasa Utara"
            >
              <View>
                <View style={[styles.markerDot, {backgroundColor: '#27ae60'}]} />
              </View>
            </Marker>
            
            <Marker
              coordinate={{ latitude: 1.6728, longitude: 125.0694 }}
              title="Likupang"
              description="Wilayah Pesisir"
            >
              <View>
                <View style={[styles.markerDot, {backgroundColor: '#3498db'}]} />
              </View>
            </Marker>
            
            <Marker
              coordinate={{ latitude: 1.3667, longitude: 125.0667 }}
              title="Kema"
              description="Pusat Kota"
            >
              <View>
                <View style={[styles.markerDot, {backgroundColor: '#f39c12'}]} />
              </View>
            </Marker>
          </MapView>
          
          <View style={styles.fullMapHeader}>
            <Text style={styles.fullMapTitle}>Peta Minahasa Utara</Text>
            <TouchableOpacity 
              style={styles.closeMapButton}
              onPress={() => setFullMapVisible(false)}
            >
              <Icon name="close-circle" size={28} color="#252129" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.fullMapLegend}>
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
        </View>
      </Modal>
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
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'GabaritoMedium',
    marginRight: 2,
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
    height: 260,
  },
  mapImage: {
    width: '100%',
    height: 260,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  mapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  mapBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'GabaritoMedium',
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
  fullMapContainer: {
    flex: 1,
    position: 'relative',
  },
  fullMapView: {
    width: '100%',
    height: '100%',
  },
  fullMapHeader: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fullMapTitle: {
    fontSize: 18,
    fontFamily: 'GabaritoBold',
    color: '#252129',
  },
  closeMapButton: {
    padding: 5,
  },
  fullMapLegend: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});