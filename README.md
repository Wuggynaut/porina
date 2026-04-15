# Porina
Specialty Coffee Brewing Companion

Users browse curated brewing recipes for different methods (Pourover, AeroPress, French Press, etc.), adjust ratios based on their coffee dose, and follow along with an interactive step-by-step brew timer. Segmented timers guide pour-over brewing (bloom, pulses, drawdown) while simple countdown timers handle immersion methods. Users log completed brews with personal notes and ratings to track their coffee journey over time.

## Key features
- Recipe browser organized by brew method
- Ratio calculator (input dose → auto-calculate water and per-pour amounts)
- Segmented pour-over timer with step-by-step guidance, countdown timer for immersion methods
- Brew history log with notes and ratings
- User authentication so data persists across devices.

## Tech
- Firebase Auth for user accounts
- Firebase Firestore for brew history (serves as both external data source and persistent storage)
- Expo-haptics for vibration feedback at pour step transitions
- Expo-av for audio chime on step completion
- Expo-keep-awake to prevent screen sleep during brewing
- React-native-reanimated for timer animations and progress indicators
- Expo Router with tab + stack navigators
- Context API for active brew session state
- Custom useBrewTimer hook for timer logic (segments, transitions, pause/resume)
- Recipes bundled locally as JSON.