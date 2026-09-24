# GeoGuide

GeoGuide is an Expo and React Native mobile frontend for a location-aware AI travel companion. It helps travelers choose a destination, select a travel date, review a destination briefing, discover nearby places, browse stays, and ask travel questions.

## Frontend Experience

### Splash Screen

- Blue branded splash overlay shown when the app starts.
- Animated `assets/splash.gif` artwork.
- GeoGuide title and `Location-Aware AI Place Companion` subtitle.
- Fades out after the fonts and initial app shell are ready.

### Bottom Navigation

The app uses five bottom tabs with Ionicons:

- **Location**: Choose a destination or use the current-location entry point.
- **Briefing**: View the selected destination's weather and grounded travel summary.
- **Nearby**: Search and browse attractions, temples, gardens, and other places.
- **Hotels**: View nearby accommodation options.
- **Ask AI**: Chat interface for destination questions.

### Location

The Location tab opens with a destination selector:

- `Use Current Location` button.
- Demo destination cards for Mysuru, Hampi, and Bengaluru.
- Destination imagery from the local `assets/` directory.
- Each destination opens the date-selection flow.

### Date Selection

The date screen provides a September 2026 calendar for the selected destination:

- Selectable days from 1 through 30.
- Selected-date highlight and summary badge.
- Continue button that opens the briefing tab.
- Date context describing weather, events, and seasonal travel insights.

### Travel Briefing

The Briefing tab contains:

- Selected city and travel date.
- Edit Date action.
- Weather summary with temperature, condition, and rain chance.
- Grounded destination overview.
- Verified source and citation rows for place information, attractions, and events.

### Nearby Places

The Nearby tab includes:

- Search field for place keywords.
- Filter icon button.
- Category pills for All, Attractions, Temples, and Gardens.
- Place cards with images, ratings, reviews, distance, travel time, category badges, and favorite icons.

The current frontend includes Mysore Palace, Chamundi Hills, Brindavan Gardens, and St. Philomena's Church.

### Hotels

The Hotels tab displays nearby stays in a simple list. The current mock experience includes Radisson Blu Plaza Hotel with its nightly price.

### Ask AI

The Ask AI tab provides:

- Conversation list.
- Initial Mysuru travel greeting.
- Text input for travel questions.

## Current Frontend Scope

The UI is currently a functional prototype using mock data. Navigation, date selection, tab switching, cards, and category selection are implemented. GPS detection, live weather, backend-grounded briefings, real search and filtering, favorites, hotel booking actions, and AI responses are not connected yet.

## Tech Stack

- Expo SDK 57
- React Native 0.86
- React 19
- React Navigation bottom tabs and native stack
- Expo Vector Icons
- Expo Google Fonts with DM Sans
- React Native Web support

## Run Locally

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm start
```

Available platform commands:

```bash
npm run android
npm run ios
npm run web
```

## Project Structure

```text
.
├── App.js                 # Frontend screens, navigation, mock data, and styles
├── index.js               # Expo entry point
├── app.json               # Expo application configuration
├── assets/                # Destination images, icons, and splash artwork
├── package.json           # Scripts and dependencies
└── package-lock.json      # Locked dependency versions
```
