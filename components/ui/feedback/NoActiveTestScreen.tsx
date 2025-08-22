import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeContext } from '../../../theme/ThemeContext';
import { Button } from '../buttons/Button';
import { Container } from '../layout/Container';
import { Spacer } from '../layout/Spacer';

interface NoActiveTestScreenProps {
  onBack: () => void;
  onSelectTest?: () => void;
  onCreateBasicCheckIn?: () => void;
}

export function NoActiveTestScreen({ onBack, onSelectTest, onCreateBasicCheckIn }: NoActiveTestScreenProps) {
  const { theme } = useThemeContext();

  return (
    <Container>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.iconText, { color: theme.colors.background }]}>?</Text>
          </View>
        </View>
        
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          No Active Test
        </Text>
        
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          You need to select a test to continue with your check-in. 
          Tests help track specific skin concerns and progress over time.
        </Text>
        
        <Spacer size="xxl" />
        
        <View style={styles.buttonContainer}>
          {onSelectTest && (
            <>
              <Button
                variant="primary"
                onPress={onSelectTest}
                style={styles.button}
              >
                Select a Test
              </Button>
              <Spacer size="l" />
            </>
          )}
          
          {onCreateBasicCheckIn && (
            <>
              <Button
                variant="glass"
                onPress={onCreateBasicCheckIn}
                style={styles.button}
              >
                Continue with Photos Only
              </Button>
              <Spacer size="l" />
            </>
          )}
          
          <Button
            variant="secondary"
            onPress={onBack}
            style={styles.button}
          >
            Go Back
          </Button>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    width: '100%',
  },
});
