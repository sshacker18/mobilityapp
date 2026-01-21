Mobility Superapp Frontend

This is a Vite + React + TypeScript + Tailwind frontend for the mobility superapp.

Booking Wizard:
- Multi-step flow (phone → OTP → location → destination → review).
- Demo route: http://localhost:5173/booking
- OTP is mocked for local dev. Use code **1234**.
- Destination search and reverse geocoding use OpenStreetMap (Nominatim) with no API key (rate-limited).

Environment:
- Set VITE_API_URL to your backend base URL (e.g. http://localhost:4000)
- Set VITE_GOOGLE_MAPS_API_KEY for Google Maps Places + Maps rendering.
- Optional: If you later swap to Mapbox, add VITE_MAPBOX_TOKEN and update the map provider.

Run:
  cd frontend && npm install && npm run dev
