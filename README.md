# RecoveryHelper

RecoveryHelper is a simple daily recovery streak tracker built with Expo and React Native. A user can mark the current day as completed, see the length of their active streak, and keep that progress between sessions with local device storage.

## Current features

- Mark today's recovery goal as complete.
- Calculate a streak from consecutive completed days.
- Persist completed dates locally with AsyncStorage.
- Follow the device's light or dark color scheme.
- Run on Android, iOS, and the web from one codebase.

## Requirements

- Node.js and npm
- Expo Go on a physical device, or an Android/iOS simulator

## Setup

Install the dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm start
```

From the Expo terminal, scan the QR code with Expo Go or choose a simulator. Platform-specific commands are also available:

```bash
npm run android
npm run ios
npm run web
```

## Development checks

```bash
npm run lint
npx tsc --noEmit
npx expo install --check
npx expo-doctor
```

## Project structure

- `app/` contains the Expo Router screens and layouts.
- `components/` contains reusable interface components.
- `hooks/` and `constants/` contain theme helpers.
- `assets/images/` contains the application icons and splash assets.

## Data storage

Recovery progress is stored only on the current device under the AsyncStorage key `completedDates`. Clearing the app's local data or uninstalling it removes the saved history. Cloud sync and user accounts are not implemented yet.
