import { useProfile } from '@/hooks/useProfile';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import React, { useState } from 'react';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Box, Text } from '../../components';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { useThemeContext } from '../../theme/ThemeContext';

interface TestSelectionScreenProps {
  onTestCreated?: (testId: Id<"tests">) => void;
  onBack?: () => void;
  isForCheckIn?: boolean; // Indicates if this is being shown for check-in purposes
}

export default function TestSelectionScreen({ onTestCreated, onBack, isForCheckIn = false }: TestSelectionScreenProps) {
  const { theme } = useThemeContext();
  const { profile } = useProfile();
  const userId = profile?._id;
  const [selectedTemplate, setSelectedTemplate] = useState<Id<"testTemplates"> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch available test templates
  const testTemplates = useQuery(api.tests.getTestTemplates, {});
  
  // Mutation to create test from template
  const createTestFromTemplate = useMutation(api.tests.createTestFromTemplate);

  const handleSelectTemplate = async (templateId: Id<"testTemplates">) => {
    if (!userId) {
      Alert.alert('Error', 'Please sign in to create a test');
      return;
    }

    setIsCreating(true);
    try {
      const testId = await createTestFromTemplate({
        userId,
        templateId,
      });
      
      Alert.alert(
        'Test Created!', 
        'Your new test has been started successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              onTestCreated?.(testId);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating test:', error);
      Alert.alert('Error', 'Failed to create test. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'product': return 'medical';
      case 'routine': return 'time';
      case 'lifestyle': return 'leaf';
      case 'ingredient': return 'flask';
      default: return 'analytics';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'product': return theme.colors.categoryProduct;
      case 'routine': return theme.colors.categoryRoutine;
      case 'lifestyle': return theme.colors.categoryLifestyle;
      case 'ingredient': return theme.colors.categoryIngredient;
      default: return theme.colors.textSecondary;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'product': return 'Product Test';
      case 'routine': return 'Routine Test';
      case 'lifestyle': return 'Lifestyle Test';
      case 'ingredient': return 'Ingredient Test';
      default: return 'Test';
    }
  };

  return (
    <ScrollView 
      style={{ flex: 1 }} 
      contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Box marginBottom="xl">
        <Box flexDirection="row" alignItems="center" marginBottom="s">
          {onBack && (
            <TouchableOpacity 
              onPress={onBack}
              style={{ marginRight: 12 }}
            >
              <Ionicons 
                name="chevron-back" 
                size={20} 
                color={theme.colors.primary} 
              />
            </TouchableOpacity>
          )}
          <Text variant="title" color="textPrimary">
            {isForCheckIn ? 'Select a Test for Check-in' : 'Select a Test'}
          </Text>
        </Box>
        <Text variant="subtitle" color="textSecondary">
          {isForCheckIn 
            ? 'Choose a test to start your daily check-in' 
            : 'Choose a test to track your skin health journey'
          }
        </Text>
      </Box>

      {/* Loading state */}
      {testTemplates === undefined && (
        <Box 
          backgroundColor="backgroundMuted"
          padding="xl"
          borderRadius="m"
          borderWidth={1}
          borderColor="glassBorder"
          alignItems="center"
        >
          <Text variant="subtitle" color="textSecondary">
            Loading available tests...
          </Text>
        </Box>
      )}

      {/* Test templates list */}
      {testTemplates && testTemplates.length === 0 && (
        <Box 
          backgroundColor="backgroundMuted"
          padding="xl"
          borderRadius="m"
          borderWidth={1}
          borderColor="glassBorder"
          alignItems="center"
        >
          <Text variant="subtitle" color="textSecondary">
            No tests available at the moment
          </Text>
        </Box>
      )}

      {testTemplates && testTemplates.map((template) => (
        <Box key={template._id} marginBottom="l">
          <TouchableOpacity
            onPress={() => handleSelectTemplate(template._id)}
            disabled={isCreating}
            style={{ opacity: isCreating ? 0.6 : 1 }}
          >
            <Box
              backgroundColor="backgroundMuted"
              padding="xl"
              borderRadius="m"
              borderWidth={1}
              borderColor="glassBorder"
              style={{
                borderColor: selectedTemplate === template._id ? theme.colors.primary : theme.colors.glassBorder,
                borderWidth: selectedTemplate === template._id ? 2 : 1,
              }}
            >
              {/* Category badge */}
              <Box 
                backgroundColor="backgroundMuted"
                borderWidth={1}
                paddingHorizontal="m"
                paddingVertical="xs"
                borderRadius="m"
                alignSelf="flex-start"
                marginBottom="m"
                flexDirection="row"
                alignItems="center"
                style={{
                  borderColor: getCategoryColor(template.category)
                }}
              >
                <Ionicons 
                  name={getCategoryIcon(template.category) as any} 
                  size={14} 
                  style={{ 
                    marginRight: 6,
                    color: getCategoryColor(template.category)
                  }}
                />
                <Text variant="caption" fontWeight="600" style={{ color: getCategoryColor(template.category) }}>
                  {getCategoryLabel(template.category)}
                </Text>
              </Box>

              {/* Test name */}
              <Text variant="title" color="textPrimary" marginBottom="s">
                {template.name}
              </Text>

              {/* Test description */}
              <Text variant="subtitle" color="textSecondary" marginBottom="m">
                {template.description}
              </Text>

              {/* Duration */}
              <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                <Box flexDirection="row" alignItems="center">
                  <Ionicons 
                    name="calendar" 
                    size={12} 
                    color={theme.colors.textMuted} 
                    style={{ marginRight: 6 }}
                  />
                  <Text variant="caption" color="textMuted">
                    {template.duration} days
                  </Text>
                </Box>

                {/* Select button */}
                <Box
                  backgroundColor="background"
                  paddingHorizontal="m"
                  paddingVertical="s"
                  borderRadius="m"
                  style={{
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: getCategoryColor(template.category)
                  }}
                >
                  <Text variant="caption" fontWeight="600" style={{ color: getCategoryColor(template.category) }}>
                    {isCreating ? 'Creating...' : 'Start Test'}
                  </Text>
                </Box>
              </Box>
            </Box>
          </TouchableOpacity>
        </Box>
      ))}
    </ScrollView>
  );
}
