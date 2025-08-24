import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { darkThemeExport, lightThemeExport, Theme } from './theme';

type ThemeContextType = {
  theme: Theme;
  colorScheme: ColorSchemeName;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  console.log('🎨 ThemeProvider: Component initialized');
  
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  console.log('🎨 ThemeProvider: Initial colorScheme', { colorScheme });

  useEffect(() => {
    console.log('🔄 ThemeProvider: useEffect triggered');
    // Handle the new API structure
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      console.log('🎨 ThemeProvider: Color scheme changed', { newColorScheme });
      setColorScheme(newColorScheme);
    });

    return () => {
      console.log('🧹 ThemeProvider: Cleanup function called');
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  const theme = colorScheme === 'dark' ? darkThemeExport : lightThemeExport;
  const isDark = colorScheme === 'dark';

  console.log('🎨 ThemeProvider: Theme computed', {
    colorScheme,
    isDark,
    hasTheme: !!theme,
    themeKeys: theme ? Object.keys(theme).slice(0, 5) : []
  });

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    console.error('❌ useThemeContext: Context is undefined - must be used within a ThemeProvider');
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
