import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useThemeContext } from '../../../theme/ThemeContext';
import { Text } from '../Glass';

interface CheckInHistoryAISummaryProps {
  summary: string;
}

export function CheckInHistoryAISummary({ summary }: CheckInHistoryAISummaryProps) {
  const { theme } = useThemeContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Enhanced markdown parser for better formatting
  const parseMarkdown = (text: string) => {
    if (!text) return null;
    
    // Split into lines and process each one
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Handle section headers (like "Key Observations:", "Patterns & Changes:", etc.)
      if (trimmedLine.endsWith(':') && trimmedLine.length > 3 && !trimmedLine.startsWith('-') && !trimmedLine.startsWith('•')) {
        return (
          <Text key={index} style={[styles.sectionHeader, { color: theme.colors.textPrimary }]}>
            {trimmedLine}
          </Text>
        );
      }
      
      // Handle headers
      if (trimmedLine.startsWith('## ')) {
        return (
          <Text key={index} style={[styles.header2, { color: theme.colors.textPrimary }]}>
            {trimmedLine.substring(3)}
          </Text>
        );
      }
      
      if (trimmedLine.startsWith('# ')) {
        return (
          <Text key={index} style={[styles.header1, { color: theme.colors.textPrimary }]}>
            {trimmedLine.substring(2)}
          </Text>
        );
      }
      
      // Handle bullet points
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        return (
          <View key={index} style={styles.bulletPoint}>
            <Text style={[styles.bullet, { color: theme.colors.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: theme.colors.textSecondary }]}>
              {trimmedLine.substring(2)}
            </Text>
          </View>
        );
      }
      
      // Handle numbered lists
      if (/^\d+\.\s/.test(trimmedLine)) {
        const match = trimmedLine.match(/^(\d+)\.\s(.+)/);
        if (match) {
          return (
            <View key={index} style={styles.numberedPoint}>
              <Text style={[styles.number, { color: theme.colors.primary }]}>{match[1]}.</Text>
              <Text style={[styles.numberedText, { color: theme.colors.textSecondary }]}>
                {match[2]}
              </Text>
            </View>
          );
        }
      }
      
      // Handle bold text (simple **text** parsing)
      if (trimmedLine.includes('**')) {
        const parts = trimmedLine.split('**');
        return (
          <Text key={index} style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            {parts.map((part, partIndex) => 
              partIndex % 2 === 1 ? (
                <Text key={partIndex} style={[styles.bold, { color: theme.colors.textPrimary }]}>
                  {part}
                </Text>
              ) : part
            )}
          </Text>
        );
      }
      
      // Handle italic text (simple *text* parsing)
      if (trimmedLine.includes('*') && !trimmedLine.includes('**')) {
        const parts = trimmedLine.split('*');
        return (
          <Text key={index} style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            {parts.map((part, partIndex) => 
              partIndex % 2 === 1 ? (
                <Text key={partIndex} style={[styles.italic, { color: theme.colors.textSecondary }]}>
                  {part}
                </Text>
              ) : part
            )}
          </Text>
        );
      }
      
      // Regular paragraph
      if (trimmedLine.length > 0) {
        return (
          <Text key={index} style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            {trimmedLine}
          </Text>
        );
      }
      
      // Empty line for spacing
      return <View key={index} style={styles.spacing} />;
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <Ionicons 
            name="sparkles" 
            size={16} 
            color={theme.colors.categoryIngredient}
            style={{ marginRight: 8 }}
          />
          <Text variant="caption" fontWeight="600" color="categoryIngredient">
            AI Summary
          </Text>
        </View>
        
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={16} 
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.content}>
          {parseMarkdown(summary)}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingVertical: 14,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    paddingTop: 0,
    gap: 8,
  },
  header1: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
  },
  header2: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '600',
  },
  italic: {
    fontStyle: 'italic',
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  numberedPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingLeft: 8,
  },
  number: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    marginTop: 2,
    minWidth: 20,
  },
  numberedText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  spacing: {
    height: 6,
  },
});
