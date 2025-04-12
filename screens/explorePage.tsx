import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo vector icons

// Define interface for cultural items
interface CulturalItem {
  id: string;
  name: string;
  type: string;
  image: { uri: string };
  description: string;
}

// Mock data for cultures with online placeholder images
const culturalItems: CulturalItem[] = [
  {
    id: '1',
    name: 'Kolintang',
    type: 'Benda',
    image: { uri: 'https://placehold.co/400x300/png?text=Kolintang' },
    description: 'Alat musik tradisional Minahasa yang terdiri dari rangkaian bilah-bilah kayu yang diletakkan di atas kotak resonator.',
  },
  {
    id: '2',
    name: 'Waruga',
    type: 'Benda',
    image: { uri: 'https://placehold.co/400x300/png?text=Waruga' },
    description: 'Kuburan batu khas Minahasa berbentuk kubah dengan bagian atas menyerupai atap rumah tradisional.',
  },
  {
    id: '3',
    name: 'Kabasaran',
    type: 'Tak Benda',
    image: { uri: 'https://placehold.co/400x300/png?text=Kabasaran' },
    description: 'Tarian perang tradisional Minahasa yang ditampilkan dalam upacara-upacara adat penting.',
  },
  {
    id: '4',
    name: 'Maengket',
    type: 'Tak Benda',
    image: { uri: 'https://placehold.co/400x300/png?text=Maengket' },
    description: 'Tarian tradisional Minahasa yang menggambarkan kerjasama dalam kegiatan pertanian dan kehidupan sosial.',
  },
  {
    id: '5',
    name: 'Cakalele',
    type: 'Tak Benda',
    image: { uri: 'https://placehold.co/400x300/png?text=Cakalele' },
    description: 'Tarian perang tradisional yang melambangkan semangat kepahlawanan dan keberanian masyarakat Minahasa.',
  },
  {
    id: '6',
    name: 'Tinutuan',
    type: 'Tak Benda',
    image: { uri: 'https://placehold.co/400x300/png?text=Tinutuan' },
    description: 'Kuliner khas Minahasa berupa bubur yang terbuat dari berbagai macam sayuran dan rempah-rempah.',
  },
  {
    id: '7',
    name: 'Rumah Adat Pewaris',
    type: 'Benda',
    image: { uri: 'https://placehold.co/400x300/png?text=Rumah+Adat' },
    description: 'Bangunan tradisional Minahasa dengan arsitektur khas yang mencerminkan nilai-nilai budaya setempat.',
  },
  {
    id: '8',
    name: 'Kain Bentenan',
    type: 'Benda',
    image: { uri: 'https://placehold.co/400x300/png?text=Kain+Bentenan' },
    description: 'Kain tradisional Minahasa dengan motif-motif khas yang digunakan dalam berbagai upacara adat.',
  },
];

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filteredItems = culturalItems.filter(item => {
    // Filter by search query
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = activeTab === 'All' || item.type === activeTab;
    
    return matchesSearch && matchesCategory;
  });

  const renderCultureItem = ({ item }: { item: CulturalItem }) => (
    <TouchableOpacity style={styles.itemCard}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.itemType}>{item.type}</Text>
        </View>
        <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Eksplorasi</Text>
        <Text style={styles.subtitle}>Temukan budaya menarik di Minahasa Utara</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari budaya..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'All' && styles.activeTab]} 
            onPress={() => setActiveTab('All')}>
            <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>Semua</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Benda' && styles.activeTab]} 
            onPress={() => setActiveTab('Benda')}>
            <Text style={[styles.tabText, activeTab === 'Benda' && styles.activeTabText]}>Benda</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Tak Benda' && styles.activeTab]} 
            onPress={() => setActiveTab('Tak Benda')}>
            <Text style={[styles.tabText, activeTab === 'Tak Benda' && styles.activeTabText]}>Tak Benda</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderCultureItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Tidak ada budaya ditemukan</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Gabarito-Bold',
    marginBottom: 4,
    color: '#252129',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Gabarito-Regular',
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Gabarito-Regular',
    fontSize: 16,
  },
  tabContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#252129',
  },
  tabText: {
    fontFamily: 'Gabarito-Medium',
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
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
    justifyContent: 'center',
  },
  itemTitle: {
    fontFamily: 'Gabarito-Bold',
    fontSize: 18,
    marginBottom: 6,
    color: '#252129',
  },
  badge: {
    backgroundColor: '#f1f1ff',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemType: {
    fontFamily: 'Gabarito-Medium',
    fontSize: 13,
    color: '#252129',
  },
  itemDescription: {
    fontFamily: 'Gabarito-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Gabarito-Regular',
    fontSize: 16,
    color: '#999',
  },
});

export default ExploreScreen;