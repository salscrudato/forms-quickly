interface EnvironmentConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
  isDevelopment: boolean;
  isProduction: boolean;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
};

export const env: EnvironmentConfig = {
  firebase: {
    apiKey: getEnvVar('VITE_FIREBASE_API_KEY', 'AIzaSyCX9NDirW2pBSm9zEtdR5AbooXn6n9Dn3k'),
    authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', 'forms-quickly.firebaseapp.com'),
    projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', 'forms-quickly'),
    storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', 'forms-quickly.firebasestorage.app'),
    messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', '482274724067'),
    appId: getEnvVar('VITE_FIREBASE_APP_ID', '1:482274724067:web:83c98052078afe003b1dd6'),
    measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID', 'G-Q2JQYJHCGR'),
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
