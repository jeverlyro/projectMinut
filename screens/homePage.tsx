import React, { useRef, useEffect } from 'react';
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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function HomePage() {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1556513989-9f53e6ed8fe1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
          style={styles.gradientOverlay}
        />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Floating Header */}
          <Animated.View 
            style={[
              styles.floatingHeader, 
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <BlurView intensity={90} tint="dark" style={styles.headerBlur}>
              <View style={styles.headerContent}>
                <View style={styles.headerIconContainer}>
                  <MaterialIcons name="location-on" size={24} color="#fff" />
                </View>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.headerTitle}>North Minahasa</Text>
                  <Text style={styles.headerSubtitle}>The Land of Beauty and Culture</Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>
          
          {/* Content Cards */}
          <View style={styles.contentContainer}>
            {/* History Card */}
            <Animated.View 
              style={[
                styles.sectionContainer,
                { opacity: fadeAnim, transform: [{ translateY: Animated.multiply(slideAnim, 1.2) }] }
              ]}
            >
              <View style={styles.sectionTitleRow}>
                <Ionicons name="time-outline" size={22} color="#fff" />
                <Text style={styles.sectionTitle}>History</Text>
              </View>
              
              <BlurView intensity={55} tint="light" style={styles.glassCard}>
                <View style={styles.cardContent}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1591864370989-3df36c4ce33e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }} 
                    style={styles.cardImage}
                  />
                  <Text style={styles.paragraph}>
                    North Minahasa (Minahasa Utara) is a regency located in North Sulawesi province of Indonesia.
                    Established in 2004 after separating from Minahasa Regency, it has a rich history dating back centuries.
                  </Text>
                  <Text style={styles.paragraph}>
                    The Minahasan people have a unique cultural heritage that has been preserved through generations.
                    Initially inhabited by indigenous tribes, the region later experienced influences from Dutch colonial rule.
                  </Text>
                </View>
              </BlurView>
            </Animated.View>
            
            {/* Geography Card */}
            <Animated.View 
              style={[
                styles.sectionContainer,
                { opacity: fadeAnim, transform: [{ translateY: Animated.multiply(slideAnim, 1.4) }] }
              ]}
            >
              <View style={styles.sectionTitleRow}>
                <Ionicons name="map-outline" size={22} color="#fff" />
                <Text style={styles.sectionTitle}>Geography</Text>
              </View>
              
              <BlurView intensity={55} tint="light" style={styles.glassCard}>
                <View style={styles.cardContent}>
                  <View style={styles.mapContainer}>
                    <BlurView intensity={35} tint="light" style={styles.mapPlaceholder}>
                      <Ionicons name="map" size={40} color="rgba(0,0,0,0.5)" />
                      <Text style={styles.mapPlaceholderText}>Map of North Minahasa</Text>
                    </BlurView>
                  </View>
                  
                  <Text style={styles.caption}>
                    Located at the northeastern tip of Sulawesi Island, Indonesia.
                    It covers an area of approximately 1,059.24 km² and is bordered by the Celebes Sea.
                  </Text>
                  
                  <View style={styles.divider} />
                  
                  <Text style={styles.subheading}>
                    <Ionicons name="location" size={18} color="#2c3e50" /> Key Locations
                  </Text>
                  
                  <View style={styles.locationList}>
                    <View style={styles.locationItem}>
                      <View style={styles.locationBullet} />
                      <Text style={styles.locationText}>Airmadidi - The capital city</Text>
                    </View>
                    <View style={styles.locationItem}>
                      <View style={styles.locationBullet} />
                      <Text style={styles.locationText}>Bunaken National Marine Park</Text>
                    </View>
                    <View style={styles.locationItem}>
                      <View style={styles.locationBullet} />
                      <Text style={styles.locationText}>Lembeh Strait - Famous diving destination</Text>
                    </View>
                    <View style={styles.locationItem}>
                      <View style={styles.locationBullet} />
                      <Text style={styles.locationText}>Mount Klabat - The highest peak in North Sulawesi</Text>
                    </View>
                  </View>
                </View>
              </BlurView>
            </Animated.View>
            
            {/* Culture Transition */}
            <Animated.View 
              style={[
                { opacity: fadeAnim, transform: [{ translateY: Animated.multiply(slideAnim, 1.6) }] }
              ]}
            >
              <BlurView intensity={90} tint="dark" style={styles.transitionCard}>
                <LinearGradient
                  colors={['rgba(52, 152, 219, 0.8)', 'rgba(155, 89, 182, 0.8)']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.gradientBg}
                />
                <View style={styles.transitionContent}>
                  <Ionicons name="heart" size={32} color="#fff" style={styles.transitionIcon} />
                  <Text style={styles.transitionTitle}>Discover the Rich Cultural Heritage</Text>
                  <Text style={styles.transitionText}>
                    The unique geography and history of North Minahasa have shaped its distinct cultural identity.
                    Let's explore the traditions that make this region special...
                  </Text>
                </View>
              </BlurView>
            </Animated.View>
            
            {/* Culture Card */}
            <Animated.View 
              style={[
                styles.sectionContainer,
                { opacity: fadeAnim, transform: [{ translateY: Animated.multiply(slideAnim, 1.8) }] }
              ]}
            >
              <View style={styles.sectionTitleRow}>
                <Ionicons name="people-outline" size={22} color="#fff" />
                <Text style={styles.sectionTitle}>Culture</Text>
              </View>
              
              <BlurView intensity={55} tint="light" style={styles.glassCard}>
                <View style={styles.cardContent}>
                  <View style={styles.cultureSectionRow}>
                    <View style={styles.cultureSectionIcon}>
                      <Ionicons name="musical-notes" size={24} color="#e74c3c" />
                    </View>
                    <View style={styles.cultureSectionContent}>
                      <Text style={styles.subheading}>Traditional Dances</Text>
                      <Text style={styles.paragraph}>
                        The Minahasan people are known for their vibrant traditional dances such as the Kabasaran war dance,
                        Maengket harvest dance, and Cakalele performed during celebrations.
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.animatedDivider} />
                  
                  <View style={styles.cultureSectionRow}>
                    <View style={styles.cultureSectionIcon}>
                      <Ionicons name="restaurant" size={24} color="#e74c3c" />
                    </View>
                    <View style={styles.cultureSectionContent}>
                      <Text style={styles.subheading}>Cuisine</Text>
                      <Text style={styles.paragraph}>
                        North Minahasa is famous for its unique and flavorful cuisine. Popular dishes include Tinutuan (Manado porridge),
                        Woku (spicy seafood or chicken dish), and traditional delicacies.
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.animatedDivider} />
                  
                  <View style={styles.cultureSectionRow}>
                    <View style={styles.cultureSectionIcon}>
                      <Ionicons name="musical-note" size={24} color="#e74c3c" />
                    </View>
                    <View style={styles.cultureSectionContent}>
                      <Text style={styles.subheading}>Traditional Music</Text>
                      <Text style={styles.paragraph}>
                        Kolintang, a wooden percussion instrument, is an important part of Minahasan cultural identity.
                        Music plays a significant role in ceremonies, celebrations, and daily life.
                      </Text>
                    </View>
                  </View>
                </View>
              </BlurView>
            </Animated.View>
          </View>
          
          {/* Footer */}
          <Animated.View 
            style={[
              { opacity: fadeAnim, transform: [{ translateY: Animated.multiply(slideAnim, 2) }] }
            ]}
          >
            <BlurView intensity={90} tint="dark" style={styles.footer}>
              <LinearGradient
                colors={['rgba(44, 62, 80, 0.9)', 'rgba(52, 73, 94, 0.9)']}
                style={styles.footerGradient}
              />
              <Text style={styles.footerText}>Explore more about North Minahasa</Text>
              <TouchableOpacity style={styles.button}>
                <LinearGradient
                  colors={['#e74c3c', '#c0392b']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Learn More</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" style={styles.buttonIcon} />
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>
          </Animated.View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height * 0.15,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  floatingHeader: {
    marginTop: 45,
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  headerBlur: {
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  glassCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  cardContent: {
    padding: 20,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
  },
  mapContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  mapPlaceholder: {
    width: '100%',
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  mapPlaceholderText: {
    fontSize: 15,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '500',
    marginTop: 8,
  },
  caption: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginVertical: 10,
  },
  locationList: {
    marginTop: 5,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e74c3c',
    marginRight: 10,
  },
  locationText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 12,
    width: '100%',
  },
  animatedDivider: {
    height: 1,
    marginVertical: 18,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  transitionCard: {
    borderRadius: 22,
    overflow: 'hidden',
    marginVertical: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  gradientBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  transitionContent: {
    padding: 22,
    alignItems: 'center',
  },
  transitionIcon: {
    marginBottom: 10,
  },
  transitionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  transitionText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  cultureSectionRow: {
    flexDirection: 'row',
  },
  cultureSectionIcon: {
    marginRight: 15,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cultureSectionContent: {
    flex: 1,
  },
  footer: {
    marginTop: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  footerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  footerText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 22,
    fontWeight: '500',
  },
  button: {
    marginBottom: 25,
    width: 160,
    alignSelf: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 6,
  },
  buttonIcon: {
    marginTop: 1,
  },
});