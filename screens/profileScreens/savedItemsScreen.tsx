import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSavedItems } from "../../services/SavedItemsContext";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  SavedItems: undefined;
  Profile: undefined;
};

type SavedItemsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "SavedItems">;
};

const SavedItemsScreen = ({ navigation }: SavedItemsScreenProps) => {
  const { savedItems, removeItem, isLoading, error } = useSavedItems();

  const handleRemoveItem = async (id: string) => {
    await removeItem(id);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemCard}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <View style={styles.badgeContainer}>
          <View
            style={[
              styles.badge,
              item.type === "Wisata" ? styles.wisataBadge : styles.budayaBadge,
            ]}
          >
            <Text style={styles.itemType}>{item.type}</Text>
          </View>
          <View style={[styles.badge, styles.categoryBadge]}>
            <Text style={styles.categoryType}>{item.category}</Text>
          </View>
        </View>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#252129" />
        </TouchableOpacity>
        <Text style={styles.title}>Tersimpan</Text>
        <View style={styles.placeholder} />
      </View>

      {isLoading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#252129" />
          <Text style={[styles.emptyStateText, { marginTop: 16 }]}>
            Memuat item tersimpan...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color="#ff4d4d"
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyStateTitle}>Gagal Memuat Data</Text>
          <Text style={styles.emptyStateText}>{error}</Text>
        </View>
      ) : savedItems.length > 0 ? (
        <FlatList
          data={savedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons
            name="bookmark-outline"
            size={64}
            color="#ccc"
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyStateTitle}>Belum Ada Yang Tersimpan</Text>
          <Text style={styles.emptyStateText}>
            Anda belum menyimpan destinasi wisata atau budaya apapun.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  placeholder: {
    width: 34,
  },
  title: {
    fontSize: 22,
    fontFamily: "Gabarito-Bold",
    color: "#252129",
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 15,
    padding: 5,
    zIndex: 10,
  },
  itemImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
    margin: 10,
  },
  itemContent: {
    flex: 1,
    padding: 14,
    justifyContent: "center",
  },
  itemTitle: {
    fontFamily: "Gabarito-Bold",
    fontSize: 18,
    marginBottom: 6,
    color: "#252129",
  },
  badgeContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  wisataBadge: {
    backgroundColor: "#f1f1ff",
  },
  budayaBadge: {
    backgroundColor: "#f1f1ff",
  },
  categoryBadge: {
    backgroundColor: "#f5f5f5",
  },
  itemType: {
    fontFamily: "Gabarito-Regular",
    fontSize: 13,
    color: "#252129",
  },
  categoryType: {
    fontFamily: "Gabarito-Regular",
    fontSize: 13,
    color: "#666",
  },
  itemDescription: {
    fontFamily: "Gabarito-Regular",
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontFamily: "Gabarito-Bold",
    fontSize: 20,
    color: "#252129",
    marginBottom: 10,
  },
  emptyStateText: {
    fontFamily: "Gabarito-Regular",
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default SavedItemsScreen;
