import React, { useState, useEffect } from 'react';
import { View, Alert, Animated, TouchableOpacity } from 'react-native';
import { useAuthActions } from "@convex-dev/auth/react";
import { makeRedirectUri } from "expo-auth-session";
import { openAuthSessionAsync } from "expo-web-browser";
import { Platform } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { AntDesign } from '@expo/vector-icons';
import { 
  Container, 
  Button, 
  Input, 
  Spacer, 
  Text, 
  Box,
  Divider 
} from '../../components';

// Animated DermaTrack title component
function AnimatedTitle() {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const glowAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in and scale up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous glow animation
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    glowAnimation.start();

    return () => glowAnimation.stop();
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  // Animated gradient movement
  const gradientAnim = new Animated.Value(0);
  
  useEffect(() => {
    // Continuous gradient animation - smooth sweep with no breaks
    const gradientAnimation = Animated.loop(
      Animated.timing(gradientAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: false,
      })
    );
    gradientAnimation.start();

    return () => gradientAnimation.stop();
  }, []);





  return (
    <View style={{ alignItems: 'center' }}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <View style={{ alignItems: 'center', position: 'relative' }}>
          {/* Transparent white text with white light sweep */}
          <Text
            style={{
              fontSize: 48,
              fontWeight: '200',
              color: 'rgba(255, 255, 255, 0.4)', // Very transparent white
              textAlign: 'center',
              letterSpacing: 2,
              lineHeight: 56,
              height: 56,
              includeFontPadding: false,
              textAlignVertical: 'center',
              textShadowColor: 'rgba(0, 0, 0, 0.2)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
          >
            DermaTrack
          </Text>
          
          {/* White light sweep effect */}
          <MaskedView
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: 'center', 
              justifyContent: 'center',
            }}
            maskElement={
              <Text
                style={{
                  fontSize: 48,
                  fontWeight: '200',
                  color: 'white',
                  textAlign: 'center',
                  letterSpacing: 2,
                  lineHeight: 56,
                  height: 56,
                  includeFontPadding: false,
                  textAlignVertical: 'center',
                }}
              >
                DermaTrack
              </Text>
            }
          >
            <Animated.View style={{ 
              width: '400%', 
              height: '100%',
              position: 'absolute',
              left: gradientAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['-400%', '100%'],
              }),
            }}>
              <LinearGradient
                colors={[
                  'rgba(255, 255, 255, 0)', 
                  'rgba(255, 255, 255, 0.4)', 
                  'rgba(255, 255, 255, 0.9)', 
                  'rgba(255, 255, 255, 0.9)', 
                  'rgba(255, 255, 255, 0.4)', 
                  'rgba(255, 255, 255, 0)'
                ]} // Transparent, Transparent, White, White, Transparent, Transparent
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </Animated.View>
          </MaskedView>
        </View>
      </Animated.View>
    </View>
  );
}

const redirectTo = makeRedirectUri();

// Log the redirect URI for debugging
console.log('Redirect URI:', redirectTo);

export function AuthScreen() {
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn } = useAuthActions();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { redirect } = await signIn("google", { redirectTo });
      if (Platform.OS === "web") {
        return;
      }
      const result = await openAuthSessionAsync(redirect!.toString(), redirectTo);
      if (result.type === "success") {
        const { url } = result;
        const code = new URL(url).searchParams.get("code")!;
        await signIn("google", { code });
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 0 }}>
      <View style={{ alignItems: 'center', paddingTop: 80, paddingBottom: 40, minHeight: 120 }}>
        <AnimatedTitle />
      </View>

      <Spacer size="l" />

      {/* Google Sign-In Button */}
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: '#dadce0',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={{ color: '#5f6368', fontSize: 16, fontWeight: '500' }}>
              Signing in...
            </Text>
          ) : (
            <>
              <AntDesign name="google" size={20} color="#4285F4" style={{ marginRight: 12 }} />
              <Text style={{ color: '#5f6368', fontSize: 16, fontWeight: '500' }}>
                Sign in with Google
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>


    </View>
  );
}

export default AuthScreen;
