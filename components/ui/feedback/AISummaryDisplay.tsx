import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useThemeContext } from '../../../theme/ThemeContext';
import { Text } from '../Glass';

interface AISummaryDisplayProps {
  summary: string;
  style?: any;
}

export function AISummaryDisplay({ summary, style }: AISummaryDisplayProps) {
  const { theme } = useThemeContext();

  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string) => {
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
    <View style={[styles.container, style]}>
      <BlurView intensity={50} tint="dark" style={styles.blurContainer}>
        <LinearGradient
          colors={['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <ScrollView 
              style={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <Ionicons 
                    name="sparkles" 
                    size={20} 
                    color={theme.colors.primary}
                    style={{ marginRight: 12 }}
                  />
                  <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                    AI Insights
                  </Text>
                </View>
              </View>
              
              <View style={styles.summaryContent}>
                {parseMarkdown(summary)}
              </View>
            </ScrollView>
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 16,
    width: '100%',
    maxWidth: '95%',
    // Artistic multi-color glow with reduced intensity and closer proximity
    boxShadow: `
      0 0px 12px 4px rgba(76, 179, 255, 0.15),
      0 0px 24px 8px rgba(76, 179, 255, 0.1),
      0 0px 8px 2px rgba(147, 51, 234, 0.12),
      0 0px 16px 4px rgba(147, 51, 234, 0.08),
      0 0px 6px 2px rgba(34, 197, 94, 0.1),
      0 0px 12px 4px rgba(34, 197, 94, 0.06)
    `,
    // iOS shadow properties with artistic color blend
    shadowColor: '#4CB3FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  blurContainer: {
    width: '100%',
  },
  gradient: {
    width: '100%',
  },
  scrollContainer: {
    maxHeight: 600, // Much taller scroll area
  },
  scrollContent: {
    paddingBottom: 8,
  },
  content: {
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  summaryContent: {
    gap: 8,
  },
  header1: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  header2: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: 'rgba(255,255,255,0.9)',
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
    height: 8,
  },
});
