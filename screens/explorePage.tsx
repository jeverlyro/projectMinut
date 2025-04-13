import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  Image,
  Platform,
  UIManager
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CulturalItem {
  id: string;
  name: string;
  type: string;
  category: string;
  image: { uri: string };
  description: string;
}

const culturalItems: CulturalItem[] = [
  {
    id: '1',
    name: 'Pantai Likupang',
    type: 'Wisata',
    category: 'Pantai',
    image: { uri: 'https://placehold.co/400x300/png?text=Pantai+Likupang' },
    description: 'Pantai eksotis di Zona Ekonomi Khusus (KEK) yang mencakup Pantai Paal, Pulisan, dan Kinunang dengan pasir putih dan air laut jernih.',
  },
  {
    id: '2',
    name: 'Pulau Lihaga',
    type: 'Wisata',
    category: 'Pulau',
    image: { uri: 'https://placehold.co/400x300/png?text=Pulau+Lihaga' },
    description: 'Pulau kecil dengan pantai berpasir putih dan air laut biru jernih, ideal untuk snorkeling dan diving.',
  },
  {
    id: '3',
    name: 'Pulau Gangga',
    type: 'Wisata',
    category: 'Pulau',
    image: { uri: 'https://placehold.co/400x300/png?text=Pulau+Gangga' },
    description: 'Pulau dengan resort eksklusif, terkenal dengan terumbu karang dan kehidupan laut yang beragam.',
  },
  {
    id: '4',
    name: 'Pulau Bangka',
    type: 'Wisata',
    category: 'Pulau',
    image: { uri: 'https://placehold.co/400x300/png?text=Pulau+Bangka' },
    description: 'Pulau indah dengan pantai eksotis dan pemandangan bawah laut yang mempesona untuk kegiatan menyelam.',
  },
  {
    id: '5',
    name: 'Air Terjun Tunan',
    type: 'Wisata',
    category: 'Alam',
    image: { uri: 'https://placehold.co/400x300/png?text=Air+Terjun+Tunan' },
    description: 'Air terjun yang indah dengan ketinggian sekitar 20 meter, dikelilingi vegetasi hijau yang asri.',
  },
  {
    id: '6',
    name: 'Gunung Klabat',
    type: 'Wisata',
    category: 'Alam',
    image: { uri: 'https://placehold.co/400x300/png?text=Gunung+Klabat' },
    description: 'Gunung tertinggi di Sulawesi Utara (1995 mdpl) dengan jalur pendakian yang menantang dan pemandangan spektakuler.',
  },
  {
    id: '7',
    name: 'Kaki Dian',
    type: 'Wisata',
    category: 'Alam',
    image: { uri: 'https://placehold.co/400x300/png?text=Kaki+Dian' },
    description: 'Danau vulkanik berair biru yang terletak di kaki Gunung Klabat dengan keindahan alam yang mempesona.',
  },
  {
    id: '8',
    name: 'Hutan Kenangan',
    type: 'Wisata',
    category: 'Alam',
    image: { uri: 'https://placehold.co/400x300/png?text=Hutan+Kenangan' },
    description: 'Area konservasi alam dengan berbagai jenis vegetasi khas Sulawesi Utara yang asri dan sejuk.',
  },
  {
    id: '9',
    name: 'Waruga Sawangan',
    type: 'Wisata',
    category: 'Sejarah',
    image: { uri: 'https://placehold.co/400x300/png?text=Waruga+Sawangan' },
    description: 'Situs sejarah berupa kuburan batu tradisional Minahasa yang menunjukkan budaya pemakaman zaman dulu.',
  },
  {
    id: '10',
    name: 'Kuliner & Pasar Tradisional',
    type: 'Wisata',
    category: 'Kuliner',
    image: { uri: 'https://placehold.co/400x300/png?text=Kuliner+Tradisional' },
    description: 'Pusat jajanan dan kuliner khas Minahasa Utara dengan berbagai masakan tradisional yang menggugah selera.',
  },
  {
    id: '11',
    name: 'Bukit Larata',
    type: 'Wisata',
    category: 'Alam',
    image: { uri: 'https://placehold.co/400x300/png?text=Bukit+Larata' },
    description: 'Bukit dengan pemandangan panorama indah matahari terbit dan matahari terbenam yang memukau.',
  },
  {
    id: '12',
    name: 'Tanjung Tarabitan',
    type: 'Wisata',
    category: 'Pantai',
    image: { uri: 'https://placehold.co/400x300/png?text=Tanjung+Tarabitan' },
    description: 'Area tanjung dengan pantai indah dan pemandangan laut lepas yang memukau.',
  },
  {
    id: '13',
    name: 'Arung Jeram Sawangan',
    type: 'Wisata',
    category: 'Petualangan',
    image: { uri: 'https://placehold.co/400x300/png?text=Arung+Jeram' },
    description: 'Lokasi arung jeram menantang dengan pemandangan alam yang indah di sepanjang jalur sungai.',
  },
  {
    id: '14',
    name: 'Taman Makam Pahlawan Maria Walanda Maramis',
    type: 'Wisata',
    category: 'Sejarah',
    image: { uri: 'https://placehold.co/400x300/png?text=Makam+MWM' },
    description: 'Situs sejarah yang mengenang jasa pahlawan nasional Maria Walanda Maramis, pejuang hak perempuan.',
  },

  // Budaya category
  {
    id: '15',
    name: 'Merawale',
    type: 'Budaya',
    category: 'Tradisi',
    image: { uri: 'https://placehold.co/400x300/png?text=Merawale' },
    description: 'Tradisi musyawarah masyarakat Minahasa untuk menyelesaikan permasalahan bersama secara kekeluargaan.',
  },
  {
    id: '16',
    name: 'Mapalus',
    type: 'Budaya',
    category: 'Tradisi',
    image: { uri: 'https://placehold.co/400x300/png?text=Mapalus' },
    description: 'Sistem gotong royong dan kerja sama tradisional masyarakat Minahasa dalam berbagai kegiatan sosial dan pertanian.',
  },
  {
    id: '17',
    name: 'Adat Tulude Desa Budo',
    type: 'Budaya',
    category: 'Upacara',
    image: { uri: 'https://placehold.co/400x300/png?text=Adat+Tulude' },
    description: 'Upacara tradisional yang dilaksanakan sebagai ucapan syukur dan harapan untuk tahun baru yang lebih baik.',
  },
  {
    id: '18',
    name: 'Tari Tumatenden',
    type: 'Budaya',
    category: 'Tarian',
    image: { uri: 'https://placehold.co/400x300/png?text=Tari+Tumatenden' },
    description: 'Tarian tradisional Minahasa yang menggambarkan kesopanan dan keramahan gadis-gadis Minahasa.',
  },
  {
    id: '19',
    name: 'Tari Ampe Wayer',
    type: 'Budaya',
    category: 'Tarian',
    image: { uri: 'https://placehold.co/400x300/png?text=Tari+Ampe+Wayer' },
    description: 'Tarian lincah dan energik yang dilakukan secara berkelompok, menunjukkan kegembiraan dan persaudaraan.',
  },
  {
    id: '20',
    name: 'Tradisi Pemakaman Waruga',
    type: 'Budaya',
    category: 'Tradisi',
    image: { uri: 'https://placehold.co/400x300/png?text=Tradisi+Waruga' },
    description: 'Tradisi pemakaman kuno masyarakat Minahasa menggunakan peti batu berbentuk kubus yang unik.',
  },
  {
    id: '21',
    name: 'Pengucapan Syukur',
    type: 'Budaya',
    category: 'Upacara',
    image: { uri: 'https://placehold.co/400x300/png?text=Pengucapan+Syukur' },
    description: 'Festival tahunan yang menunjukkan rasa syukur atas hasil panen, ditandai dengan pesta dan berbagi makanan.',
  },
];

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [activeMainCategory, setActiveMainCategory] = useState('All');
  const [filteredItems, setFilteredItems] = useState(culturalItems);
  
  useEffect(() => {
    const items = culturalItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeTab === 'All' || 
                             item.type === activeTab || 
                             item.category === activeTab;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredItems(items);
  }, [searchQuery, activeTab]);

  const getSubcategories = (mainCategory: string) => {
    const items = culturalItems.filter(item => item.type === mainCategory);
    const categories = [...new Set(items.map(item => item.category))];
    return categories;
  };

  const handleMainTabChange = (tab: string) => {
    setActiveMainCategory(tab);
    setActiveTab(tab);
  };

  const handleSubTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderCultureItem = ({ item }: { item: CulturalItem }) => {
    return (
      <View>
        <TouchableOpacity 
          style={styles.itemCard}
          activeOpacity={0.7}
        >
          <Image source={item.image} style={styles.itemImage} />
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, 
                item.type === 'Wisata' ? styles.wisataBadge : styles.budayaBadge]}>
                <Text style={styles.itemType}>{item.type}</Text>
              </View>
              <View style={[styles.badge, styles.categoryBadge]}>
                <Text style={styles.categoryType}>{item.category}</Text>
              </View>
            </View>
            <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Temukan wisata & budaya menarik di Minahasa Utara</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari destinasi..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.tab, activeMainCategory === 'All' && styles.activeTab]} 
            onPress={() => handleMainTabChange('All')}>
            <Text style={[styles.tabText, activeMainCategory === 'All' && styles.activeTabText]}>Semua</Text>
          </TouchableOpacity>
          
          {/* Main categories */}
          <TouchableOpacity 
            style={[styles.tab, activeMainCategory === 'Wisata' && styles.activeTab, styles.wisataTab]} 
            onPress={() => handleMainTabChange('Wisata')}>
            <Text style={[styles.tabText, activeMainCategory === 'Wisata' && styles.activeTabText]}>Wisata</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeMainCategory === 'Budaya' && styles.activeTab, styles.budayaTab]} 
            onPress={() => handleMainTabChange('Budaya')}>
            <Text style={[styles.tabText, activeMainCategory === 'Budaya' && styles.activeTabText]}>Budaya</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {/* Subcategories based on selected main category */}
      {(activeMainCategory === 'Wisata' || activeMainCategory === 'Budaya') && (
        <View style={styles.subTabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getSubcategories(activeMainCategory).map((category) => (
              <TouchableOpacity 
                key={category}
                style={[
                  styles.subTab, 
                  activeTab === category && styles.activeSubTab
                ]} 
                onPress={() => handleSubTabChange(category)}>
                <Text style={[
                  styles.subTabText, 
                  activeTab === category && styles.activeSubTabText
                ]}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={filteredItems}
        renderItem={renderCultureItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={50} color="#ccc" style={styles.emptyIcon} />
            <Text style={styles.emptyStateText}>Tidak ada destinasi ditemukan</Text>
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
    marginBottom: 8,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  wisataTab: {
    backgroundColor: '#e3f2fd',
  },
  budayaTab: {
    backgroundColor: '#fce4ec',
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
    fontFamily: 'Gabarito-Bold',
  },
  subTabContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  subTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  activeSubTab: {
    backgroundColor: '#e0e0e0',
    borderColor: '#c0c0c0',
  },
  subTabText: {
    fontFamily: 'Gabarito-Regular',
    fontSize: 13,
    color: '#777',
  },
  activeSubTabText: {
    color: '#252129',
    fontFamily: 'Gabarito-Medium',
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
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#f1f1ff',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  wisataBadge: {
    backgroundColor: '#e3f2fd',
  },
  budayaBadge: {
    backgroundColor: '#fce4ec',
  },
  categoryBadge: {
    backgroundColor: '#f5f5f5',
  },
  itemType: {
    fontFamily: 'Gabarito-Medium',
    fontSize: 13,
    color: '#252129',
  },
  categoryType: {
    fontFamily: 'Gabarito-Regular',
    fontSize: 13,
    color: '#666',
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
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyStateText: {
    fontFamily: 'Gabarito-Regular',
    fontSize: 16,
    color: '#999',
  },
});

export default ExploreScreen;