import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, Gabarito_400Regular, Gabarito_500Medium, Gabarito_600SemiBold, Gabarito_700Bold } from '@expo-google-fonts/gabarito';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  SignIn: undefined;
  ProfileDetails: undefined;
  SavedItems: undefined;
  Settings: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type UserData = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
};

const ProfileScreen = () => {
  // Use the useNavigation hook for navigation
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const [user, setUser] = useState({
    username: "Guest User",
    email: "guest@example.com",
    avatar: "https://ui-avatars.com/api/?name=Guest+User&background=252129&color=fff&size=200",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  
  const [fontsLoaded] = useFonts({
    GabaritoRegular: Gabarito_400Regular,
    GabaritoMedium: Gabarito_500Medium,
    GabaritoSemiBold: Gabarito_600SemiBold,
    GabaritoBold: Gabarito_700Bold,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser: UserData = JSON.parse(userData);
          // Generate avatar from username if not available
          const avatarUrl = parsedUser.avatar || 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(parsedUser.username)}&background=252129&color=fff&size=200`;
            
          setUser(prev => ({
            ...prev,
            username: parsedUser.username,
            email: parsedUser.email,
            id: parsedUser.id,
            avatar: avatarUrl
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleLogoutPress = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      // Use the navigation object directly
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setShowLogoutConfirmation(false);
    }
  };

  const LogoutConfirmationModal = () => {
    return (
      <Modal
        visible={showLogoutConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutConfirmation(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowLogoutConfirmation(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Ionicons name="log-out-outline" size={50} color="#252129" style={styles.modalIcon} />
                
                <Text style={styles.modalTitle}>Konfirmasi Logout</Text>
                <Text style={styles.modalDescription}>
                  Apakah Anda yakin ingin keluar dari akun?
                </Text>
                
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setShowLogoutConfirmation(false)}
                  >
                    <Text style={styles.cancelButtonText}>Batal</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.confirmButton}
                    onPress={handleLogout}
                  >
                    <Text style={styles.confirmButtonText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#252129" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <LogoutConfirmationModal />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons name="settings" size={24} color="#252129" />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Summary Section */}
        <View style={styles.profileSummary}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Menu Section */}
        <View style={styles.menuContainer}>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("ProfileDetails")}
          >
            <Ionicons name="person" size={24} color="#252129" style={styles.menuIcon} />
            <Text style={styles.menuText}>Kelola Profil</Text>
            <Ionicons name="chevron-forward" size={20} color="#6c757d" style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("SavedItems")}
          >
            <Ionicons name="bookmark" size={24} color="#252129" style={styles.menuIcon} />
            <Text style={styles.menuText}>Konten Tersimpan</Text>
            <Ionicons name="chevron-forward" size={20} color="#6c757d" style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogoutPress}
          >
            <Ionicons name="log-out" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Keluar</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>Minut App v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FCFCFC",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 22,
    color: "#252129",
    fontFamily: 'GabaritoBold',
  },
  settingsButton: {
    padding: 5,
  },
  profileSummary: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#f0f0f0",
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    color: "#252129",
    fontFamily: 'GabaritoBold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#6c757d",
    fontFamily: 'GabaritoRegular',
    marginBottom: 16,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#252129",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  locationText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "GabaritoMedium",
    marginLeft: 6,
  },
  menuContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#252129",
    flex: 1,
    fontFamily: "GabaritoRegular",
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  logoutContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 40,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#252129",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
    width: "70%",
    marginBottom: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
    fontFamily: "GabaritoBold",
  },
  versionText: {
    fontSize: 12,
    color: "#8e8e93",
    fontFamily: "GabaritoRegular",
    marginTop: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    color: '#252129',
    textAlign: 'center',
    fontFamily: 'GabaritoBold',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    fontFamily: 'GabaritoRegular',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#252129',
    fontFamily: 'GabaritoMedium',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#252129',
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'GabaritoBold',
  }
});

export default ProfileScreen;