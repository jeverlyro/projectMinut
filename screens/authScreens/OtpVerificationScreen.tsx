import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useFonts, Gabarito_400Regular, Gabarito_500Medium, Gabarito_600SemiBold, Gabarito_700Bold } from '@expo-google-fonts/gabarito';
import CustomNotification from '../../components/CustomNotification';
import { auth } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  OtpVerification: { email: string; userId: string };
  MainApp: undefined;
};

type OtpVerificationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'OtpVerification'
>;

type OtpVerificationScreenRouteProp = RouteProp<
  RootStackParamList, 
  'OtpVerification'
>;

type Props = {
  navigation: OtpVerificationScreenNavigationProp;
  route: OtpVerificationScreenRouteProp;
};

type NotificationData = {
  visible: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
};

const OtpVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email, userId } = route.params;
  
  // State for OTP inputs
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [notification, setNotification] = useState({
    visible: false,
    type: 'info' as 'success' | 'error' | 'info',
    message: '',
  });
  
  // Refs for input fields
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null, null, null]);
  
  // Load fonts
  const [fontsLoaded] = useFonts({
    GabaritoRegular: Gabarito_400Regular,
    GabaritoMedium: Gabarito_500Medium,
    GabaritoSemiBold: Gabarito_600SemiBold,
    GabaritoBold: Gabarito_700Bold,
  });
  
  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

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
  
  const handleOtpChange = (value: string, index: number) => {
    if (value.match(/^[0-9]?$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input if value is entered
      if (value !== '' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };
  
  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to move to previous input
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (isLoading) return;
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      showNotification('error', 'Mohon masukkan kode OTP 6 digit');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call API to verify OTP
      await auth.verifyOtp(userId, otpString);
      
      // Show success notification
      showNotification('success', 'Email berhasil diverifikasi! Silakan masuk dengan akun Anda.');
      
      // Redirect to Sign In page after successful verification
      setTimeout(() => {
        navigation.replace('SignIn');
      }, 1500);
    } catch (error: any) {
      showNotification('error', error.response?.data?.message || 'Verifikasi gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    
    setIsLoading(true);
    
    try {
      await auth.resendOtp(userId);
      showNotification('success', 'Kode OTP baru telah dikirim ke email Anda');
      setResendCountdown(60);
    } catch (error: any) {
      showNotification('error', error.response?.data?.message || 'Gagal mengirim ulang kode OTP. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
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
          <Text style={styles.title}>Verifikasi Email</Text>
          <Text style={styles.subtitle}>
            Masukkan kode 6 digit yang telah dikirim ke
          </Text>
          <Text style={styles.email}>{email}</Text>
          
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => inputRefs.current[index] = ref}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                maxLength={1}
                keyboardType="number-pad"
                autoFocus={index === 0}
                selectTextOnFocus
              />
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.button, isLoading ? styles.buttonDisabled : null]}
            onPress={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Verifikasi</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Tidak menerima kode? </Text>
            {resendCountdown > 0 ? (
              <Text style={styles.countdown}>Kirim ulang dalam {resendCountdown}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResendOtp} disabled={isLoading}>
                <Text style={styles.resendLink}>Kirim Ulang</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
    fontFamily: 'GabaritoRegular',
  },
  email: {
    fontSize: 16,
    color: '#212529',
    fontFamily: 'GabaritoSemiBold',
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    color: '#212529',
    fontFamily: 'GabaritoMedium',
  },
  button: {
    backgroundColor: '#212529',
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  resendText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'GabaritoRegular',
  },
  resendLink: {
    color: '#212529',
    fontSize: 14,
    fontFamily: 'GabaritoSemiBold',
  },
  countdown: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'GabaritoMedium',
  },
});