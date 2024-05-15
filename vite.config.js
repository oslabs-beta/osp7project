import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, './.env') });

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  const config = {
    plugins: [
      react({
        jsxRuntime: 'classic',
      }),
    ],
    define: {
      captchaKey: `"${process.env.VITE_CAPTCHA_KEY}"`,
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
  };

  config.server = {
    host: true,
    // port: 3000, 
    proxy: {
      '/getTraces': 'http://localhost:3000/',
      '/clearTraces': 'http://localhost:3000/',
      '/api': 'http://localhost:3000/',
      '/createUser': 'http://localhost:3000/',
      '/verifyUser': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/logout': 'http://localhost:3000/',
      '/setUserARN': 'http://localhost:3000/',
      '/getCurrentArn': 'http://localhost:3000/',
    },
  };
  return config;
});
