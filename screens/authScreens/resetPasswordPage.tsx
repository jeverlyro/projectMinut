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
import { RouteProp } from "@react-navigation/native";
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

type ResetPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ResetPassword"
>;

type ResetPasswordScreenRouteProp = RouteProp<
  RootStackParamList,
  "ResetPassword"
>;

type ResetPasswordScreenProps = {
  navigation: ResetPasswordScreenNavigationProp;
  route: ResetPasswordScreenRouteProp;
};

type NotificationData = {
  visible: boolean;
  type: "success" | "error" | "info";
  message: string;
};

const ResetPassword: React.FC<ResetPasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const { token, email } = route.params;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const validateForm = () => {
    let isValid = true;

    if (!otpInput) {
      setOtpError("Kode OTP wajib diisi");
      isValid = false;
    } else if (otpInput.length !== 6) {
      setOtpError("Kode OTP harus 6 digit");
      isValid = false;
    } else {
      setOtpError("");
    }

    if (!password) {
      setPasswordError("Kata sandi baru wajib diisi");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Kata sandi minimal 6 karakter");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Konfirmasi kata sandi wajib diisi");
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Kata sandi tidak cocok");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await auth.resetPassword(email, token, otpInput, password);

      showNotification(
        "success",
        "Kata sandi berhasil diubah. Silakan masuk dengan kata sandi baru Anda."
      );

      // Give time for notification to show before navigating
      setTimeout(() => {
        navigation.navigate("SignIn");
      }, 2000);
    } catch (error: any) {
      showNotification(
        "error",
        error.response?.data?.message ||
          "Gagal mengubah kata sandi. Silakan coba lagi."
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
              onPress={() => navigation.navigate("SignIn")}
            >
              <Ionicons name="arrow-back" size={24} color="#212529" />
            </TouchableOpacity>

            <Text style={styles.title}>Atur Ulang Kata Sandi</Text>
            <Text style={styles.subtitle}>
              Masukkan kode OTP yang dikirim ke email Anda dan kata sandi baru
            </Text>

            {/* OTP Input */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  otpError ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons
                  name="key-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Kode OTP"
                  placeholderTextColor="#8a8a8a"
                  keyboardType="number-pad"
                  value={otpInput}
                  onChangeText={(text) => {
                    setOtpInput(text);
                    if (otpError) setOtpError("");
                  }}
                  maxLength={6}
                />
              </View>
              {otpError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#ff3b30" />
                  <Text style={styles.errorText}>{otpError}</Text>
                </View>
              ) : null}
            </View>

            {/* New Password Input */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  passwordError ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Kata Sandi Baru"
                  placeholderTextColor="#8a8a8a"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError("");
                  }}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#ff3b30" />
                  <Text style={styles.errorText}>{passwordError}</Text>
                </View>
              ) : null}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  confirmPasswordError ? styles.inputWrapperError : null,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Konfirmasi Kata Sandi"
                  placeholderTextColor="#8a8a8a"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (confirmPasswordError) setConfirmPasswordError("");
                  }}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#ff3b30" />
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading ? styles.buttonDisabled : null]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons
                    name="save-outline"
                    size={20}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.buttonText}>Simpan Kata Sandi Baru</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ResetPassword;

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
    marginBottom: 16,
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
  passwordToggle: {
    padding: 4,
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
    marginTop: 16,
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
});
