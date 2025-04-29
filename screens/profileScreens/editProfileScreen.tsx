import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  Gabarito_400Regular,
  Gabarito_500Medium,
  Gabarito_600SemiBold,
  Gabarito_700Bold,
} from "@expo-google-fonts/gabarito";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import CustomNotification from "../../components/CustomNotification";

const API_URL = "https://minutappbackend-production.up.railway.app/api";

type EditProfileScreenProps = {
  navigation: any;
};

type NotificationType = "success" | "error" | "info";

type NotificationData = {
  visible: boolean;
  type: NotificationType;
  message: string;
};

const EditProfileScreen = ({ navigation }: EditProfileScreenProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [notification, setNotification] = useState<NotificationData>({
    visible: false,
    type: "info",
    message: "",
  });

  const [fontsLoaded] = useFonts({
    GabaritoRegular: Gabarito_400Regular,
    GabaritoMedium: Gabarito_500Medium,
    GabaritoSemiBold: Gabarito_600SemiBold,
    GabaritoBold: Gabarito_700Bold,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);

          setUsername(parsedUser.username || "");
          setEmail(parsedUser.email || "");
          setUserId(parsedUser.id || "");

          // Set the avatar URL
          const avatarUrl =
            parsedUser.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              parsedUser.username
            )}&background=252129&color=fff&size=200`;
          setAvatar(avatarUrl);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({
      visible: true,
      type,
      message,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  // Convert image to base64
  const imageToBase64 = async (uri: string) => {
    try {
      // Check if the uri is already a base64 string
      if (uri.startsWith("data:image")) {
        return uri.split(",")[1];
      }

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }
  };

  const pickImage = async () => {
    setShowPhotoModal(false);

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      showNotification(
        "error",
        "Aplikasi memerlukan izin untuk mengakses foto Anda"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setAvatar(selectedImageUri);

      // Convert to base64 if not already provided
      if (result.assets[0].base64) {
        setAvatarBase64(result.assets[0].base64);
      } else {
        const base64 = await imageToBase64(selectedImageUri);
        setAvatarBase64(base64);
      }
    }
  };

  const takePhoto = async () => {
    setShowPhotoModal(false);

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      showNotification(
        "error",
        "Aplikasi memerlukan izin untuk mengakses kamera Anda"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setAvatar(selectedImageUri);

      // Convert to base64 if not already provided
      if (result.assets[0].base64) {
        setAvatarBase64(result.assets[0].base64);
      } else {
        const base64 = await imageToBase64(selectedImageUri);
        setAvatarBase64(base64);
      }
    }
  };

  const handlePhotoOptions = () => {
    setShowPhotoModal(true);
  };

  const handleSaveProfile = async () => {
    if (!username.trim()) {
      showNotification("error", "Nama tidak boleh kosong");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the JWT token for authorization
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Prepare data for API call
      const updateData: any = {
        username: username,
      };

      // Only include avatar if it was changed (avatarBase64 is set)
      if (avatarBase64) {
        updateData.avatar = `data:image/jpeg;base64,${avatarBase64}`;
      }

      console.log(`User ID: ${userId}`);
      console.log(`Making API request to: ${API_URL}/users/${userId}`);

      // Make API call to update user profile
      const response = await axios.put(
        `${API_URL}/users/${userId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.status, response.data);

      // If successful, update the local storage data
      if (response.status === 200) {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          const updatedUser = {
            ...parsedUser,
            username: username,
            avatar: response.data.data.avatar || avatar,
          };

          await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

          // Show success notification but don't navigate back automatically
          showNotification("success", "Profil berhasil diperbarui");
        }
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);

      // More detailed error messages
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage =
          error.response.data?.error || "Gagal memperbarui profil";

        showNotification("error", `Error ${statusCode}: ${errorMessage}`);
      } else if (error.request) {
        showNotification(
          "error",
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
        );
      } else {
        showNotification(
          "error",
          error.message || "Terjadi kesalahan saat memperbarui profil."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom Photo Source Selection Modal
  const PhotoSourceModal = () => (
    <Modal
      visible={showPhotoModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowPhotoModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowPhotoModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Ubah Foto Profil</Text>
                <TouchableOpacity
                  onPress={() => setShowPhotoModal(false)}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                  <Ionicons name="close" size={24} color="#252129" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
                <View
                  style={[
                    styles.optionIconContainer,
                    { backgroundColor: "#e6f9ff" },
                  ]}
                >
                  <Ionicons name="camera" size={24} color="#0099cc" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Kamera</Text>
                  <Text style={styles.optionSubtitle}>
                    Ambil foto baru melalui kamera
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalOption} onPress={pickImage}>
                <View
                  style={[
                    styles.optionIconContainer,
                    { backgroundColor: "#fff0e6" },
                  ]}
                >
                  <Ionicons name="images" size={24} color="#ff9933" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Galeri</Text>
                  <Text style={styles.optionSubtitle}>
                    Pilih foto dari galeri Anda
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowPhotoModal(false)}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

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
      <CustomNotification
        visible={notification.visible}
        type={notification.type}
        message={notification.message}
        onDismiss={hideNotification}
      />
      <PhotoSourceModal />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#252129" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profil</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} />

            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handlePhotoOptions}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nama Lengkap</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Masukkan nama lengkap"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={email}
                editable={false}
                placeholder="Email tidak dapat diubah"
              />
              <Text style={styles.emailNote}>Email tidak dapat diubah</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Simpan</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCFCFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: "GabaritoBold",
    color: "#252129",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  avatarContainer: {
    alignItems: "center",
    padding: 30,
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 30,
    right: "35%",
    backgroundColor: "#252129",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  form: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "GabaritoMedium",
    color: "#252129",
    marginBottom: 8,
    paddingLeft: 4,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "GabaritoRegular",
    color: "#252129",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
  emailNote: {
    fontSize: 12,
    fontFamily: "GabaritoRegular",
    color: "#6c757d",
    marginTop: 4,
    paddingLeft: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: "#252129",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "GabaritoBold",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "GabaritoBold",
    color: "#252129",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: "GabaritoMedium",
    color: "#252129",
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    fontFamily: "GabaritoRegular",
    color: "#6c757d",
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: "GabaritoMedium",
    color: "#252129",
  },
});

export default EditProfileScreen;
