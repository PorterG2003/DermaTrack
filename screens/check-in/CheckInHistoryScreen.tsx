import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import React, { useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Box, Text } from '../../components';
import { api } from '../../convex/_generated/api';
import { useProfile, useUserPhotos } from '../../hooks/useProfile';
import { useThemeContext } from '../../theme/ThemeContext';

interface CheckInHistoryScreenProps {
  onBack?: () => void;
}

type FilterType = 'all' | 'thisWeek' | 'thisMonth' | 'thisYear';

export default function CheckInHistoryScreen({ onBack }: CheckInHistoryScreenProps) {
  const { theme } = useThemeContext();
  const { profile } = useProfile();
  const { userId } = useUserPhotos();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  // Fetch check-ins with test answers
  const checkInsWithAnswers = useQuery(api.checkIns.getCheckInsWithTestAnswers, 
    userId ? { userId, limit: 100 } : "skip"
  );



  // Filter check-ins based on selected filter
  const filteredCheckIns = useMemo(() => {
    if (!checkInsWithAnswers) return [];
    
    const now = new Date();
    const nowTime = now.getTime();
    
    return checkInsWithAnswers.filter(checkIn => {
      const checkInDate = new Date(checkIn.createdAt);
      const checkInTime = checkInDate.getTime();
      
      switch (activeFilter) {
        case 'thisWeek':
          const weekAgo = nowTime - (7 * 24 * 60 * 60 * 1000);
          return checkInTime >= weekAgo;
        case 'thisMonth':
          const monthAgo = nowTime - (30 * 24 * 60 * 60 * 1000);
          return checkInTime >= monthAgo;
        case 'thisYear':
          const yearAgo = nowTime - (365 * 24 * 60 * 60 * 1000);
          return checkInTime >= yearAgo;
        default:
          return true;
      }
    });
  }, [checkInsWithAnswers, activeFilter]);

  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case 'all': return 'All Time';
      case 'thisWeek': return 'This Week';
      case 'thisMonth': return 'This Month';
      case 'thisYear': return 'This Year';
    }
  };

  const getFilterIcon = (filter: FilterType) => {
    switch (filter) {
      case 'all': return 'time';
      case 'thisWeek': return 'calendar';
      case 'thisMonth': return 'calendar-outline';
      case 'thisYear': return 'calendar-sharp';
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTimeAgo = (timestamp: number) => {
    const now = new Date();
    const checkInDate = new Date(timestamp);
    const daysDiff = Math.floor((now.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return 'Today';
    if (daysDiff === 1) return 'Yesterday';
    if (daysDiff < 7) return `${daysDiff} days ago`;
    if (daysDiff < 30) {
      const weeks = Math.floor(daysDiff / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    const months = Math.floor(daysDiff / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
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
            Check-in History
          </Text>
        </Box>
        <Text variant="subtitle" color="textSecondary">
          View all your previous check-ins and progress
        </Text>
      </Box>

      {/* Filter Tabs */}
      <Box marginBottom="xl">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {(['all', 'thisWeek', 'thisMonth', 'thisYear'] as FilterType[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={{ marginRight: 12 }}
            >
              <Box
                backgroundColor={activeFilter === filter ? "primary" : "backgroundMuted"}
                paddingHorizontal="m"
                paddingVertical="s"
                borderRadius="m"
                borderWidth={1}
                borderColor={activeFilter === filter ? "primary" : "glassBorder"}
                flexDirection="row"
                alignItems="center"
              >
                <Ionicons 
                  name={getFilterIcon(filter) as any} 
                  size={14} 
                  color={activeFilter === filter ? theme.colors.white : theme.colors.textSecondary}
                  style={{ marginRight: 6 }}
                />
                <Text 
                  variant="caption" 
                  fontWeight="600" 
                  color={activeFilter === filter ? "white" : "textSecondary"}
                >
                  {getFilterLabel(filter)}
                </Text>
              </Box>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Box>

      {/* Loading state */}
      {checkInsWithAnswers === undefined && (
        <Box 
          backgroundColor="backgroundMuted"
          padding="xl"
          borderRadius="m"
          borderWidth={1}
          borderColor="glassBorder"
          alignItems="center"
        >
          <Text variant="subtitle" color="textSecondary">
            Loading check-in history...
          </Text>
        </Box>
      )}

      {/* No check-ins state */}
      {checkInsWithAnswers && filteredCheckIns.length === 0 && (
        <Box 
          backgroundColor="backgroundMuted"
          padding="xl"
          borderRadius="m"
          borderWidth={1}
          borderColor="glassBorder"
          alignItems="center"
        >
          <Text variant="subtitle" color="textSecondary" textAlign="center">
            No check-ins found for {getFilterLabel(activeFilter).toLowerCase()}
          </Text>
        </Box>
      )}

      {/* Check-ins List */}
      {filteredCheckIns.map((checkIn) => (
        <Box key={checkIn._id} marginBottom="l">
          <Box
            backgroundColor="backgroundMuted"
            padding="xl"
            borderRadius="m"
            borderWidth={1}
            borderColor="glassBorder"
          >
            {/* Date and time header */}
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="m">
              <Text variant="subtitle" color="textPrimary">
                {formatDate(checkIn.createdAt)}
              </Text>
              <Box 
                backgroundColor="backgroundMuted"
                borderWidth={1}
                borderColor="glassBorder"
                paddingHorizontal="s"
                paddingVertical="xs"
                borderRadius="s"
              >
                <Text variant="caption" color="textSecondary" style={{ fontSize: 10 }}>
                  {getTimeAgo(checkIn.createdAt)}
                </Text>
              </Box>
            </Box>
            
            {/* Time */}
            <Text variant="caption" color="textSecondary" marginBottom="m">
              {formatTime(checkIn.createdAt)}
            </Text>
                
            {/* AI Summary */}
            {checkIn.testAnswers?.summary && (
              <Box 
                marginTop="m"
                padding="m"
                backgroundColor="background"
                borderRadius="s"
                borderWidth={1}
                borderColor="glassBorder"
              >
                <Box flexDirection="row" alignItems="center" marginBottom="s">
                  <Ionicons 
                    name="sparkles" 
                    size={16} 
                    color={theme.colors.categoryIngredient}
                    style={{ marginRight: 6 }}
                  />
                  <Text variant="caption" fontWeight="600" color="categoryIngredient">
                    AI Summary
                  </Text>
                </Box>
                <Text variant="subtitle" color="textPrimary" lineHeight={20}>
                  {checkIn.testAnswers.summary}
                </Text>
              </Box>
            )}
            
            {/* Test information with name */}
            {checkIn.testId && checkIn.test && (
              <Box marginBottom="m">
                <Text variant="subtitle" color="textPrimary" marginBottom="s">
                  Test
                </Text>
                <Box 
                  backgroundColor="backgroundMuted"
                  borderWidth={1}
                  paddingHorizontal="m"
                  paddingVertical="xs"
                  borderRadius="m"
                  alignSelf="flex-start"
                  flexDirection="row"
                  alignItems="center"
                  style={{
                    borderColor: theme.colors.primary
                  }}
                >
                  <Ionicons 
                    name="flask" 
                    size={14} 
                    style={{ 
                      marginRight: 6,
                      color: theme.colors.primary
                    }}
                  />
                  <Text variant="subtitle" style={{ 
                    color: theme.colors.primary
                  }}>
                    {checkIn.test.name}
                  </Text>
                </Box>
              </Box>
            )}
            
            {/* Photos info */}
            {(checkIn.leftPhotoId || checkIn.centerPhotoId || checkIn.rightPhotoId) && (
              <Box marginBottom="m">
                <Text variant="subtitle" color="textPrimary" marginBottom="s">
                  Photos Taken
                </Text>
                <Box flexDirection="row" alignItems="center">
                  <Ionicons 
                    name="camera" 
                    size={16} 
                    color={theme.colors.textSecondary}
                    style={{ marginRight: 6 }}
                  />
                  <Text variant="caption" color="textSecondary">
                    Progress photos captured
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      ))}

      {/* Summary */}
      {filteredCheckIns.length > 0 && (
        <Box 
          backgroundColor="backgroundMuted"
          padding="l"
          borderRadius="m"
          borderWidth={1}
          borderColor="glassBorder"
        >
          <Text variant="title" color="textPrimary" marginBottom="m">
            Summary
          </Text>
          
          <Box flexDirection="row" justifyContent="space-between" marginBottom="s">
            <Text variant="subtitle" color="textSecondary">Total Check-ins:</Text>
            <Text variant="subtitle" color="textPrimary">
              {filteredCheckIns.length}
            </Text>
          </Box>
          
          <Box flexDirection="row" justifyContent="space-between" marginBottom="s">
            <Text variant="subtitle" color="textSecondary">Completed:</Text>
            <Text variant="subtitle" color="textPrimary">
              {filteredCheckIns.filter(c => c.completed).length}
            </Text>
          </Box>
          
          <Box flexDirection="row" justifyContent="space-between" marginBottom="s">
            <Text variant="subtitle" color="textSecondary">With Photos:</Text>
            <Text variant="subtitle" color="textPrimary">
              {filteredCheckIns.filter(c => c.leftPhotoId || c.centerPhotoId || c.rightPhotoId).length}
            </Text>
          </Box>
          
          <Box flexDirection="row" justifyContent="space-between">
            <Text variant="subtitle" color="textSecondary">Check-in Rate:</Text>
            <Text variant="subtitle" color="textPrimary">
              {(() => {
                const periodDays = activeFilter === 'thisWeek' ? 7 : 
                                 activeFilter === 'thisMonth' ? 30 : 
                                 activeFilter === 'thisYear' ? 365 : 
                                 Math.max(1, Math.floor((Date.now() - Math.min(...filteredCheckIns.map(c => c.createdAt))) / (1000 * 60 * 60 * 24)));
                const rate = filteredCheckIns.length / periodDays;
                return rate >= 1 ? `${rate.toFixed(1)}/day` : `${(rate * 7).toFixed(1)}/week`;
              })()}
            </Text>
          </Box>
        </Box>
      )}
    </ScrollView>
  );
}
