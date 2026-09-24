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
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('window');
const SPLASH_DURATION = 2500;
const Tab = createBottomTabNavigator();
const LocationStack = createNativeStackNavigator();

// ==========================================
// MOCK DATA
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
    { title: 'Events & Festivals', source: 'source: events_festivals (row 12)' },
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
// LOCATION STACK NAVIGATOR (FIXES DATE PICKER FLOW)
// ==========================================
function LocationStackNavigator() {
  return (
    <LocationStack.Navigator screenOptions={{ headerShown: false }}>
      <LocationStack.Screen name="HomeScreen" component={HomeScreen} />
      <LocationStack.Screen name="DateSelectScreen" component={DateSelectScreen} />
    </LocationStack.Navigator>
  );
}

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
          <Tab.Screen name="Location" component={LocationStackNavigator} />
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

// 1. LOCATION / HOME SCREEN
function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.screenPadding} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Where are you traveling?</Text>
      <Text style={styles.subtitle}>Select a location to get real-time grounded briefing.</Text>

      {/* GPS BUTTON */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('DateSelectScreen', { city: 'Mysuru (GPS)' })}
      >
        <Ionicons name="navigate-circle" size={22} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.primaryButtonText}>Use Current Location</Text>
      </TouchableOpacity>

      <Text style={styles.sectionHeader}>Demo Hackathon Cities</Text>

      {/* CITY CARDS -> NAVIGATE TO DATE SELECT SCREEN */}
      {CITIES_DATA.map((city) => (
        <TouchableOpacity
          key={city.id}
          style={styles.cityCardWithImage}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('DateSelectScreen', { city: city.name })}
        >
          <Image source={city.image} style={styles.cityImage} resizeMode="cover" />
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

// 2. MANUAL DATE SELECTOR SCREEN
function DateSelectScreen({ route, navigation }) {
  const selectedCity = route.params?.city || 'Mysuru';
  const [selectedDay, setSelectedDay] = useState(24);

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <View style={styles.dateScreenContainer}>
      <Text style={styles.dateScreenTitle}>Select a Date</Text>
      <Text style={styles.dateScreenSubtitle}>
        Get date-wise travel insights including events, weather, and seasonal tips for {selectedCity}.
      </Text>

      {/* CALENDAR CARD */}
      <View style={styles.calendarCard}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity><Ionicons name="chevron-back" size={20} color="#0D1B2A" /></TouchableOpacity>
          <Text style={styles.monthText}>September 2026</Text>
          <TouchableOpacity><Ionicons name="chevron-forward" size={20} color="#0D1B2A" /></TouchableOpacity>
        </View>

        <View style={styles.weekDaysRow}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text key={day} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {daysInMonth.map((day) => {
            const isSelected = day === selectedDay;
            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayCell, isSelected && styles.selectedDayCell]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* SELECTED DATE BADGE */}
      <View style={styles.selectedDateBadge}>
        <Ionicons name="calendar" size={24} color="#1E88E5" style={{ marginRight: 12 }} />
        <View>
          <Text style={styles.selectedDateLabel}>Selected Date</Text>
          <Text style={styles.selectedDateValue}>Thu, {selectedDay} Sep 2026</Text>
        </View>
      </View>

      {/* CONTINUE BUTTON -> NAVIGATES TO BRIEFING TAB WITH DATA */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() =>
          navigation.navigate('Briefing', {
            city: selectedCity,
            date: `Thu, ${selectedDay} Sep 2026`,
          })
        }
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

// 3. AI TRAVEL BRIEFING SCREEN
function BriefingScreen({ route, navigation }) {
  const city = route?.params?.city || 'Mysuru';
  const date = route?.params?.date || 'Thu, 24 Sep 2026';

  return (
    <ScrollView style={styles.screenPadding}>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={styles.cityTitle}>{city}</Text>
            <Text style={styles.dateText}>{date}</Text>
          </View>

          <TouchableOpacity
            style={styles.editDateBtn}
            onPress={() => navigation.navigate('Location', { screen: 'DateSelectScreen', params: { city: city } })}
          >
            <Ionicons name="calendar-outline" size={14} color="#1E88E5" />
            <Text style={styles.editDateText}>Edit Date</Text>
          </TouchableOpacity>
        </View>

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
        <Text style={styles.bodyText}>
          Welcome to {city}! Based on our grounded knowledge base for {date}, {MOCK_BRIEFING.overview}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Verified Sources & Citations</Text>
        {MOCK_BRIEFING.sources.map((src, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#212121' }}>{src.title}</Text>
              <Text style={{ fontSize: 11, color: '#1E88E5', fontStyle: 'italic' }}>{src.source}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// 4. NEARBY PLACES SCREEN
function PlacesScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  return (
    <View style={styles.placesContainer}>
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

      <FlatList
        data={NEARBY_PLACES_DATA}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.placeCard}>
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

// 5. NEARBY HOTELS SCREEN
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

// 6. ASK AI CHAT SCREEN
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
  editDateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editDateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginLeft: 4,
  },
  dateScreenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  dateScreenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D1B2A',
    textAlign: 'center',
    marginTop: 10,
  },
  dateScreenSubtitle: {
    fontSize: 13,
    color: '#757575',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  calendarCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D1B2A',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDayText: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: '14.28%',
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 19,
  },
  selectedDayCell: {
    backgroundColor: '#0D1B2A',
  },
  dayText: {
    fontSize: 14,
    color: '#212121',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectedDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E8ECEF',
  },
  selectedDateLabel: {
    fontSize: 11,
    color: '#757575',
  },
  selectedDateValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0D1B2A',
  },
  continueButton: {
    backgroundColor: '#0D1B2A',
    paddingVertical: 14,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
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