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
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomNotification from "../../components/CustomNotification";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  MainApp: undefined;
  ForgotPassword: undefined;
};

type SignInScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "SignIn">;
};

type NotificationData = {
  visible: boolean;
  type: "success" | "error" | "info";
  message: string;
};

const SignIn: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    if (!email) {
      setEmailError("Email wajib diisi");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Harap masukkan email yang valid");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Kata sandi wajib diisi");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Kata sandi minimal 6 karakter");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await auth.login(email, password);
      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.user));

      setEmail("");
      setPassword("");
      showNotification("success", "Login berhasil!");

      // Give time for notification to show before navigating
      setTimeout(() => {
        navigation.replace("MainApp");
      }, 1000);
    } catch (error: any) {
      showNotification(
        "error",
        error.response?.data?.message || "Gagal masuk. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpPress = () => {
    navigation.navigate("SignUp");
  };

  return (
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
          <Text style={styles.title}>Selamat Datang Kembali</Text>
          <Text style={styles.subtitle}>Silakan masuk untuk melanjutkan</Text>

          {/* Email Input with Icon */}
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
                  if (emailError) validateForm();
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

          {/* Password Input with Icon and Show/Hide Toggle */}
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
                placeholder="Kata Sandi"
                placeholderTextColor="#8a8a8a"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) validateForm();
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

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Ionicons
              name="help-circle-outline"
              size={16}
              color="#212529"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.forgotPasswordText}>Lupa Kata Sandi?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isLoading ? styles.buttonDisabled : null]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons
                  name="log-in-outline"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.buttonText}>Masuk</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={handleSignUpPress}>
              <Text style={styles.signupLink}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignIn;

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
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 32,
    fontFamily: "GabaritoBold",
    color: "#212529",
    marginLeft: 8,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#212529",
    fontSize: 14,
    fontFamily: "GabaritoMedium",
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  signupText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "GabaritoRegular",
  },
  signupLink: {
    color: "#212529",
    fontSize: 14,
    fontFamily: "GabaritoSemiBold",
  },
});
