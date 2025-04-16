import React, { useState } from 'react';
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
  Keyboard
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFonts, Gabarito_400Regular, Gabarito_500Medium, Gabarito_600SemiBold, Gabarito_700Bold } from '@expo-google-fonts/gabarito';
import { auth } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomNotification from '../../components/CustomNotification';

type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  MainApp: undefined;
};

type SignInScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SignIn'>;
};

type NotificationData = {
  visible: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
};

const SignIn: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
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
    
    return isValid;
  };
  
  const handleSignIn = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await auth.login(email, password);
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      
      setEmail('');
      setPassword('');
      showNotification('success', 'Login berhasil!');
      
      // Give time for notification to show before navigating
      setTimeout(() => {
        navigation.replace('MainApp');
      }, 1000);
    } catch (error: any) {
      showNotification('error', error.response?.data?.message || 'Gagal masuk. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
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
        
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Selamat Datang Kembali</Text>
          <Text style={styles.subtitle}>Silakan masuk untuk melanjutkan</Text>

          <View style={styles.inputContainer}>
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
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]}
              placeholder="Kata Sandi"
              placeholderTextColor="#8a8a8a"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) validateForm();
              }}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => showNotification('info', 'Fitur reset kata sandi akan segera tersedia.')}
          >
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
              <Text style={styles.buttonText}>Masuk</Text>
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
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'GabaritoBold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
    fontFamily: 'GabaritoRegular',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    color: '#000',
    fontSize: 16,
    fontFamily: 'GabaritoRegular',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontFamily: 'GabaritoRegular',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#212529',
    fontSize: 14,
    fontFamily: 'GabaritoMedium',
  },
  button: {
    backgroundColor: '#212529',
    height: 52,
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signupText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'GabaritoRegular',
  },
  signupLink: {
    color: '#212529',
    fontSize: 14,
    fontFamily: 'GabaritoSemiBold',
  },
});
