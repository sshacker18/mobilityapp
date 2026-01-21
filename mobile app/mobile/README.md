# Mobility Mobile (Expo)

India-first ride booking Android app built with Expo + React Native. The flow mirrors the web experience: login → vehicle selection → booking wizard → driver confirmation → live ride tracker.

## What’s inside

- **Login** with India-only phone validation
- **Vehicle cards** for Auto, Car, Bike, Scooty, and EV
- **Booking wizard** (contact, pickup, destination, confirm)
- **Hyderabad hotspots** + distance-based fare estimates
- **Driver selection** with fastest/top-rated filters
- **Ride tracker** with progress simulation
- **In-ride games** (Tic Tac Toe + Block Drop) and rotating fun facts
- **Retro arcade sound effects** for Block Drop actions + mute/volume controls (persisted via Settings)

## Run locally

1. Install dependencies
2. Start Expo

```bash
npm install
npx expo start
```

## Notes

- Location distance uses Hyderabad coordinate presets. When you type custom locations, a fallback distance estimate keeps the UI responsive.
- The app uses a shared dark theme to match the web experience.

## Next ideas

- Plug in real-time location services + maps (expo-location + react-native-maps)
- Persist trips locally with AsyncStorage
- Add push notifications for driver arrival
