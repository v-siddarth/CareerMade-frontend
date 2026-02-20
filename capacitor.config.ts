import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.careermade.app',
  appName: 'CareerMade',
  webDir: 'dist',
  server: {
    url: 'https://career-made-frontend-tawny.vercel.app',
    cleartext: true
  }
};

export default config;
