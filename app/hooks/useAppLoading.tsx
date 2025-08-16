import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export function useAppLoading() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');

  useEffect(() => {
    async function prepare() {
      const startTime = Date.now();
      console.log('🔄 Starting loading screen...');
      
      try {
        // Ensure minimum loading time for better UX
        setLoadingMessage('Loading theme...');
        console.log('📱 Loading theme...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setLoadingMessage('Connecting to server...');
        console.log('🌐 Connecting to server...');
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        setLoadingMessage('Setting up components...');
        console.log('🧩 Setting up components...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setLoadingMessage('Almost ready...');
        console.log('✨ Almost ready...');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Ensure minimum total loading time (4+ seconds)
        const elapsed = Date.now() - startTime;
        const minLoadTime = 4000;
        if (elapsed < minLoadTime) {
          console.log(`⏱️ Ensuring minimum load time (${minLoadTime - elapsed}ms remaining)...`);
          await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsed));
        }
        
      } catch (e) {
        console.warn('❌ Loading error:', e);
      } finally {
        console.log('✅ Loading complete, hiding screen...');
        // Hide loading screen
        setIsLoading(false);
        // Hide splash screen
        await SplashScreen.hideAsync();
        console.log('🏁 Loading screen hidden');
      }
    }

    prepare();
  }, []);

  return {
    isLoading,
    loadingMessage,
    setLoadingMessage,
    // For testing - you can call this to show loading screen again
    showLoadingScreen: () => setIsLoading(true),
  };
}
