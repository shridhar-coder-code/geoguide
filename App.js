import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const { width, height } = Dimensions.get('window');
const SPLASH_DURATION = 2500;
const Tab = createBottomTabNavigator();

// ==========================================
// MOCK DATA (DECLARED BEFORE COMPONENTS)
// ==========================================
const MOCK_BRIEFING = {
  city: 'Mysuru',
  date: 'Thu, 24 Sep 2026',
  temp: '28°C',
  condition: 'Partly Cloudy',
  rainChance: '10%',
  overview: 'Mysuru, the cultural capital of Karnataka, is known for its royal heritage, magnificent palaces, and vibrant arts scene.',
  sources: [
    { title: 'Place Information', source: 'source: place_kb (s. 1)' },
    { title: 'Top Attractions', source: 'source: poi_facts_kb (p. 3)' },
  ],
};

const MOCK_HOTELS = [
  { id: '1', name: 'Radisson Blu Plaza Hotel', rating: '4.6', distance: '1.5 km', price: '₹8,500/night' },
];

const CITIES_DATA = [
  {
    id: '1',
    name: 'Mysuru',
    state: 'Karnataka',
    image: require('./assets/mysuru.jpg'), 
  },
  {
    id: '2',
    name: 'Hampi',
    state: 'Karnataka',
    image: require('./assets/hampi.jpg'),
  },
  {
    id: '3',
    name: 'Bengaluru',
    state: 'Karnataka',
    image: require('./assets/bengaluru.jpg'),
  },
];

const NEARBY_PLACES_DATA = [
  {
    id: '1',
    name: 'Mysore Palace',
    rating: '4.8',
    reviews: '2.1K reviews',
    distance: '2 km',
    time: '10 min',
    category: 'Palace',
    categoryColor: '#FFEBEE',
    textColor: '#D32F2F',
    image: require('./assets/mysore_palace.jpg'),
  },
  {
    id: '2',
    name: 'Chamundi Hills',
    rating: '4.6',
    reviews: '560 reviews',
    distance: '13 km',
    time: '25 min',
    category: 'Temple',
    categoryColor: '#FFF8E1',
    textColor: '#F57F17',
    image: { uri: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80' },
  },
  {
    id: '3',
    name: 'Brindavan Gardens',
    rating: '4.5',
    reviews: '860 reviews',
    distance: '21 km',
    time: '30 min',
    category: 'Garden',
    categoryColor: '#E8F5E9',
    textColor: '#2E7D32',
    image: { uri: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&auto=format&fit=crop&q=80' },
  },
  {
    id: '4',
    name: "St. Philomena's Church",
    rating: '4.4',
    reviews: '720 reviews',
    distance: '3 km',
    time: '12 min',
    category: 'Church',
    categoryColor: '#F3E5F5',
    textColor: '#7B1FA2',
    image: { uri: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=600&auto=format&fit=crop&q=80' },
  },
];

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  let [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        setIsShowSplash(false);
      });
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E88E5' }}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#1E88E5" />

      {/* MAIN APP NAVIGATION */}
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle: { backgroundColor: '#FFF' },
            headerTitleStyle: { fontWeight: 'bold', color: '#1E88E5' },
            tabBarActiveTintColor: '#1E88E5',
            tabBarInactiveTintColor: '#757575',
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Location') iconName = focused ? 'location' : 'location-outline';
              else if (route.name === 'Briefing') iconName = focused ? 'document-text' : 'document-text-outline';
              else if (route.name === 'Nearby') iconName = focused ? 'map' : 'map-outline';
              else if (route.name === 'Hotels') iconName = focused ? 'bed' : 'bed-outline';
              else if (route.name === 'Ask AI') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Location" component={HomeScreen} />
          <Tab.Screen name="Briefing" component={BriefingScreen} />
          <Tab.Screen name="Nearby" component={PlacesScreen} />
          <Tab.Screen name="Hotels" component={HotelsScreen} />
          <Tab.Screen name="Ask AI" component={ChatScreen} />
        </Tab.Navigator>
      </NavigationContainer>

      {/* FULLSCREEN ANIMATED OVERLAY */}
      {isShowSplash && (
        <Animated.View style={[styles.splashOverlay, { opacity: fadeAnim }]}>
          <Image
            source={require('./assets/splash.gif')}
            style={styles.splashGif}
            resizeMode="contain"
          />
          <Text style={styles.splashTitle}>GeoGuide</Text>
          <Text style={styles.splashSubtitle}>Location-Aware AI Place Companion</Text>
        </Animated.View>
      )}
    </View>
  );
}

// ==========================================
// SCREENS
// ==========================================
function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.screenPadding} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Where are you traveling?</Text>
      <Text style={styles.subtitle}>Select a location to get real-time grounded briefing.</Text>

      {/* GPS BUTTON */}
      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Briefing')}>
        <Ionicons name="navigate-circle" size={22} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.primaryButtonText}>Use Current Location</Text>
      </TouchableOpacity>

      <Text style={styles.sectionHeader}>Demo Hackathon Cities</Text>

      {/* CITY CARDS WITH IMAGES */}
      {CITIES_DATA.map((city) => (
        <TouchableOpacity
          key={city.id}
          style={styles.cityCardWithImage}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Briefing')}
        >
          <Image source={city.image} style={styles.cityImage} resizeMode="stretch" />
          <View style={styles.cityCardInfo}>
            <View>
              <Text style={styles.cityCardName}>{city.name}</Text>
              <Text style={styles.cityCardState}>{city.state}, India</Text>
            </View>
            <Ionicons name="chevron-forward-circle" size={26} color="#1E88E5" />
          </View>
        </TouchableOpacity>
      ))}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

function BriefingScreen() {
  return (
    <ScrollView style={styles.screenPadding}>
      <View style={styles.card}>
        <Text style={styles.cityTitle}>Mysuru</Text>
        <Text style={styles.dateText}>{MOCK_BRIEFING.date}</Text>

        <View style={styles.weatherRow}>
          <Ionicons name="partly-sunny" size={36} color="#F57C00" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tempText}>{MOCK_BRIEFING.temp}</Text>
            <Text style={styles.weatherSub}>{MOCK_BRIEFING.condition} • Rain: {MOCK_BRIEFING.rainChance}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Grounded Briefing</Text>
        <Text style={styles.bodyText}>{MOCK_BRIEFING.overview}</Text>
      </View>
    </ScrollView>
  );
}

function PlacesScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  return (
    <View style={styles.placesContainer}>
      {/* SEARCH BAR & FILTER ICON */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#757575" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search places (e.g., palace, temple...)"
            placeholderTextColor="#9E9E9E"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#1A237E" />
        </TouchableOpacity>
      </View>

      {/* HORIZONTAL CATEGORY PILLS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {['All', 'Attractions', 'Temples', 'Gardens'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryPill,
              selectedFilter === cat && styles.activeCategoryPill,
            ]}
            onPress={() => setSelectedFilter(cat)}
          >
            <Text style={[styles.categoryText, selectedFilter === cat && styles.activeCategoryText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* PLACES LIST */}
      <FlatList
        data={NEARBY_PLACES_DATA}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.placeCard}>
            {/* Direct Source Object Handling */}
            <Image source={item.image} style={styles.placeImage} resizeMode="cover" />

            <View style={styles.placeDetails}>
              <Text style={styles.placeName}>{item.name}</Text>
              
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FFB300" />
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Text style={styles.reviewsText}>({item.reviews})</Text>
              </View>

              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={13} color="#757575" />
                <Text style={styles.locationText}>{item.distance} • {item.time}</Text>
              </View>

              <View style={[styles.tagBadge, { backgroundColor: item.categoryColor }]}>
                <Text style={[styles.tagText, { color: item.textColor }]}>{item.category}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={20} color="#1A237E" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

function HotelsScreen() {
  return (
    <View style={styles.screenPadding}>
      <Text style={styles.title}>Nearby Stays</Text>
      <FlatList
        data={MOCK_HOTELS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.priceText}>{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}

function ChatScreen() {
  const [messages, setMessages] = useState([{ id: '1', text: 'Hello! Ask me anything about Mysuru.' }]);
  const [text, setText] = useState('');

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.chatBubble}>
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.chatInputRow}>
        <TextInput style={styles.textInput} value={text} onChangeText={setText} placeholder="Ask AI..." />
      </View>
    </View>
  );
}

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  splashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
    elevation: 99999,
  },
  splashGif: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  splashTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 36,
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  splashSubtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: '#E3F2FD',
    marginTop: 6,
    textAlign: 'center',
  },

  // CITY IMAGE CARD STYLES
  cityCardWithImage: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cityImage: {
    width: '100%',
    height: 150,
  },
  cityCardInfo: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  cityCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  cityCardState: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },

  // PLACES SCREEN STYLES
  placesContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#212121',
  },
  filterButton: {
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesScroll: {
    maxHeight: 40,
    marginBottom: 16,
  },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    marginRight: 8,
  },
  activeCategoryPill: {
    backgroundColor: '#0D1B2A',
  },
  categoryText: {
    fontSize: 13,
    color: '#5C6BC0',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  placeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
  },
  placeImage: {
    width: 90,
    height: 90,
    borderRadius: 16,
  },
  placeDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  placeName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0D1B2A',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0D1B2A',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 6,
  },
  screenPadding: { flex: 1, padding: 16, backgroundColor: '#F4F6F8' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 24, marginBottom: 12 },
  primaryButton: { backgroundColor: '#1E88E5', flexDirection: 'row', padding: 14, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  primaryButtonText: { color: '#FFF', fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 10, marginBottom: 14 },
  cityTitle: { fontSize: 22, fontWeight: 'bold' },
  dateText: { color: '#666', fontSize: 12, marginBottom: 12 },
  weatherRow: { flexDirection: 'row', alignItems: 'center' },
  tempText: { fontSize: 22, fontWeight: 'bold' },
  weatherSub: { fontSize: 12, color: '#666' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#1E88E5' },
  bodyText: { fontSize: 14, color: '#424242' },
  listItem: { backgroundColor: '#FFF', padding: 14, borderRadius: 10, marginBottom: 10 },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  priceText: { fontSize: 13, fontWeight: 'bold', color: '#2E7D32' },
  chatBubble: { backgroundColor: '#E0E0E0', padding: 12, borderRadius: 10, marginBottom: 10 },
  chatInputRow: { flexDirection: 'row', alignItems: 'center' },
  textInput: { flex: 1, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 10 },
});