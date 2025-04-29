import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  useFonts,
  Gabarito_400Regular,
  Gabarito_500Medium,
  Gabarito_600SemiBold,
  Gabarito_700Bold,
} from "@expo-google-fonts/gabarito";
import { auth } from "../../services/api";
import CustomNotification from "../../components/CustomNotification";
import { Ionicons } from "@expo/vector-icons";

// Define the root stack param list to match App.tsx
type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  OtpVerification: { email: string; userId: string };
  MainApp: undefined;
  SavedItems: undefined;
  ProfileDetails: undefined;
  Settings: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string; email: string };
  ModelViewer: {
    modelInfo: { name: string; modelUrl: number | { uri: string } };
  };
};

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ForgotPassword"
>;

type ForgotPasswordScreenProps = {
  navigation: ForgotPasswordScreenNavigationProp;
};

type NotificationData = {
  visible: boolean;
  type: "success" | "error" | "info";
  message: string;
};

const ForgotPassword: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [resetSent, setResetSent] = useState(false);
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

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#212529" />;
  }

  const showNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
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

  const validateEmail = () => {
    if (!email) {
      setEmailError("Email wajib diisi");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Harap masukkan email yang valid");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const handleSendResetLink = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      const response = await auth.requestPasswordReset(email);
      setResetSent(true);
      showNotification(
        "success",
        "Kode OTP telah dikirim ke email Anda. Silakan periksa kotak masuk Anda."
      );

      // Navigate to reset password screen with token
      navigation.navigate("ResetPassword", {
        token: response.token,
        email: email,
      });
    } catch (error: any) {
      showNotification(
        "error",
        error.response?.data?.message ||
          "Gagal mengirim reset tautan. Email mungkin tidak terdaftar."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <CustomNotification
            visible={notification.visible}
            type={notification.type}
            message={notification.message}
            onDismiss={hideNotification}
          />

          <View style={styles.innerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#212529" />
            </TouchableOpacity>

            <Text style={styles.title}>Lupa Kata Sandi</Text>
            <Text style={styles.subtitle}>
              Masukkan email Anda untuk menerima kode OTP
            </Text>

            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  emailError ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#8a8a8a"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) validateEmail();
                  }}
                />
              </View>
              {emailError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#ff3b30" />
                  <Text style={styles.errorText}>{emailError}</Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading ? styles.buttonDisabled : null]}
              onPress={handleSendResetLink}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons
                    name="send-outline"
                    size={20}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.buttonText}>Kirim Kode OTP</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signInLink}
              onPress={() => navigation.navigate("SignIn")}
            >
              <View style={styles.buttonContent}>
                <Ionicons
                  name="arrow-back-outline"
                  size={16}
                  color="#212529"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.signInLinkText}>
                  Kembali ke Halaman Login
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 24,
    padding: 8,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
    fontFamily: "GabaritoBold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
    fontFamily: "GabaritoRegular",
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 12,
  },
  inputWrapperError: {
    borderColor: "#ff3b30",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#000",
    fontSize: 16,
    fontFamily: "GabaritoRegular",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginLeft: 4,
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginLeft: 4,
    fontFamily: "GabaritoRegular",
  },
  button: {
    backgroundColor: "#212529",
    height: 52,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#9e9e9e",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "GabaritoSemiBold",
  },
  signInLink: {
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  signInLinkText: {
    color: "#212529",
    fontSize: 14,
    fontFamily: "GabaritoMedium",
  },
});
