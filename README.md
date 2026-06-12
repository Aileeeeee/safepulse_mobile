# SafePulse Mobile App

## Setup

```bash
npx create-expo-app safepulse --template blank-typescript
cd safepulse
npx expo install expo-router expo-linear-gradient expo-haptics expo-location @expo/vector-icons react-native-safe-area-context react-native-screens
npm install @react-navigation/native @react-navigation/stack
```

Then copy all files from this project into the Expo app root.

## Folder Structure

```
safepulse/
├── app/
│   ├── _layout.tsx          # Root layout with navigation
│   ├── index.tsx            # Splash screen 1
│   ├── splash2.tsx          # Splash screen 2 (Get Started)
│   ├── onboarding/
│   │   ├── _layout.tsx
│   │   ├── step0.tsx        # Stay Safe. Stay Hidden.
│   │   ├── step1.tsx        # Add trusted contact
│   │   ├── step2.tsx        # Choose app disguise
│   │   └── step3.tsx        # Enable permissions
│   ├── ready.tsx            # SafePulse is ready
│   ├── (main)/
│   │   ├── _layout.tsx      # Tab layout
│   │   ├── home.tsx         # Dashboard
│   │   ├── contacts.tsx     # Trusted contacts
│   │   └── settings.tsx     # Settings
│   ├── report.tsx           # Report something screen
│   ├── report-sent.tsx      # Report sent confirmation
│   ├── signal-sent.tsx      # Signal sent confirmation
│   ├── signal-received.tsx  # Signal received + resources
│   └── calculator.tsx       # Calculator disguise
├── components/
│   ├── SafeButton.tsx
│   ├── ContactCard.tsx
│   ├── IncidentCard.tsx
│   ├── LoaderModal.tsx
│   └── ProgressBar.tsx
├── constants/
│   └── theme.ts
└── types/
    └── index.ts
```
