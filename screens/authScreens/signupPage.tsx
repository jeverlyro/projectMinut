import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFonts, Gabarito_400Regular, Gabarito_500Medium, Gabarito_600SemiBold, Gabarito_700Bold } from '@expo-google-fonts/gabarito';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth } from '../../services/api';
import CustomNotification from '../../components/CustomNotification';

type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  OtpVerification: { email: string; userId: string };
  MainApp: undefined;
};

type SignUpScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SignUp'>;
};

type NotificationData = {
  visible: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
};

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const [notification, setNotification] = useState<NotificationData>({
    visible: false,
    type: 'info',
    message: '',
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
  
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({
      visible: true,
      type,
      message,
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      visible: false,
    }));
  };
  
  const validateForm = () => {
    let isValid = true;
    
    if (!name) {
      setNameError('Nama wajib diisi');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!email) {
      setEmailError('Email wajib diisi');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Harap masukkan email yang valid');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!password) {
      setPasswordError('Kata sandi wajib diisi');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Kata sandi minimal 6 karakter');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError('Harap konfirmasi kata sandi Anda');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Kata sandi tidak cocok');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Send the user's name as the username parameter
      console.log('Attempting to register with:', { name, email, password: '****' });
      const response = await auth.register(name, email, password);
      
      // Store the registered email to use in OTP verification
      const registeredEmail = email;
      
      // Clear form fields
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      showNotification('success', 'Pendaftaran berhasil! Kode OTP telah dikirim ke email Anda.');
      
      // Navigate to OTP verification screen after a short delay instead of SignIn
      setTimeout(() => {
        navigation.replace('OtpVerification', { 
          email: registeredEmail, 
          userId: response.userId 
        });
      }, 1500);
    } catch (error: any) {
      if (error.response?.data?.message) {
        showNotification('error', error.response.data.message);
      } else if (error.message && error.message.includes('Network Error')) {
        showNotification('error', 'Koneksi ke server gagal. Pastikan backend berjalan dan dapat diakses.');
      } else {
        showNotification('error', 'Gagal membuat akun. Silakan coba lagi.');
      }
      console.log('Registration error:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInPress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <CustomNotification
          visible={notification.visible}
          type={notification.type}
          message={notification.message}
          onDismiss={hideNotification}
        />
        
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Buat Akun</Text>
            <Text style={styles.subtitle}>Silahkan membuat akun terlebih dahulu</Text>

            <View style={styles.formContainer}>
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <Icon name="person-outline" size={18} color="#888" />
                    <TextInput
                      style={[styles.input, nameError ? styles.inputError : null]}
                      placeholder="Nama Lengkap"
                      placeholderTextColor="#8a8a8a"
                      value={name}
                      onChangeText={(text) => {
                        setName(text);
                        if (nameError) validateForm();
                      }}
                    />
                  </View>
                  {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <Icon name="mail-outline" size={18} color="#888" />
                    <TextInput
                      style={[styles.input, emailError ? styles.inputError : null]}
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
                  {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <Icon name="lock-closed-outline" size={18} color="#888" />
                    <TextInput
                      style={[styles.input, passwordError ? styles.inputError : null]}
                      placeholder="Kata Sandi"
                      placeholderTextColor="#8a8a8a"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (passwordError) validateForm();
                      }}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                      <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <Icon name="shield-checkmark-outline" size={18} color="#888" />
                    <TextInput
                      style={[styles.input, confirmPasswordError ? styles.inputError : null]}
                      placeholder="Konfirmasi Kata Sandi"
                      placeholderTextColor="#8a8a8a"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (confirmPasswordError) validateForm();
                      }}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                      <Icon name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
                    </TouchableOpacity>
                  </View>
                  {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, isLoading ? styles.buttonDisabled : null]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Buat Akun</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signinContainer}>
              <Text style={styles.signinText}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={handleSignInPress}>
                <Text style={styles.signinLink}>Masuk</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    marginBottom: 6,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'GabaritoBold',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'GabaritoRegular',
  },
  formContainer: {
    marginBottom: 10,
  },
  inputRow: {
    marginBottom: 12,
  },
  inputContainer: {
    width: '100%',
  },
  inputIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    height: 46,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#000',
    fontSize: 15,
    fontFamily: 'GabaritoRegular',
    paddingLeft: 8,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 11,
    marginTop: 2,
    marginLeft: 4,
    fontFamily: 'GabaritoRegular',
  },
  eyeIcon: {
    padding: 5,
  },
  button: {
    backgroundColor: '#212529',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#9e9e9e',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'GabaritoSemiBold',
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  signinText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'GabaritoRegular',
  },
  signinLink: {
    color: '#212529',
    fontSize: 14,
    fontFamily: 'GabaritoSemiBold',
  },
});