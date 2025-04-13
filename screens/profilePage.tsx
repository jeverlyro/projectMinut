import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }: any) => {
  // Simulasi data pengguna
  const [user, setUser] = useState({
    email: "user@example.com",
    name: "Raden Ambarul",
    avatar:
      "data:image/jpeg;base64,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",
  });

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            Alert.alert("Logged Out Successfully");
            navigation.navigate("Login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header Section */}
        <View style={styles.header}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("ManageUser")}
          >
            <Ionicons name="person-outline" size={24} color="#FF6F61" />
            <Text style={styles.menuText}>Manage Profile</Text>
            <Ionicons name="chevron-forward-outline" size={24} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <Ionicons name="key-outline" size={24} color="#6C63FF" />
            <Text style={styles.menuText}>Change Password</Text>
            <Ionicons name="chevron-forward-outline" size={24} color="#aaa" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#4CAF50" />
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward-outline" size={24} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    alignItems: "center",
    marginTop: 80,
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  logoutButton: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6F61",
  },
});

export default ProfileScreen;
