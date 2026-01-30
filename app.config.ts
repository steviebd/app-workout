export default {
  expo: {
    name: 'Workout Tracker',
    slug: 'workout-tracker',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'workout-tracker',
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.molt.workouttracker',
    },
    plugins: [
      'nativewind/react-native',
      [
        'expo-camera',
        {
          cameraPermission: 'Allow Workout Tracker to access your camera for form recording.',
        },
      ],
    ],
  },
};
