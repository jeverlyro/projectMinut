import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

const SignUpScreen = () => {
  // State untuk form input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleSignUp = () => {
    // Validasi password dan konfirmasi password
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password and Confirmation Password do not match');
      return;
    }

    // Simulasi berhasil SignUp
    Alert.alert('Success', 'Account created successfully!');
    // Di sini bisa dilanjutkan ke layar lain, misalnya Home atau Login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#212529"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#212529"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        placeholderTextColor="#212529"
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#212529"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#212529"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  button: {
    backgroundColor: '#212529',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  link: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 12,
  },
});
