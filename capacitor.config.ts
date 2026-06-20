import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.careermade.app',
  appName: 'CareerMade',
  webDir: 'dist',
  server: {
    url: 'https://www.careermed.in',
    cleartext: true
  }
};

export default config;
