import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import {
    Button,
    Container,
    Divider,
    Input,
    Spacer,
    Text
} from '../index';

export function Showcase() {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
      <Container variant="glass" size="spacious" centerContent>
        <Text variant="heading">Component Library</Text>
        <Text variant="subtitle">Glass Theme Showcase</Text>
      </Container>

      <Spacer size="l" />

      {/* Buttons Section */}
      <Container variant="card" size="normal">
        <Text variant="title">Buttons</Text>
        <Spacer size="m" />
        
        <Button variant="primary" size="large" style={{ marginBottom: 8 }}>
          Primary Large
        </Button>
        <Button variant="secondary" size="medium" style={{ marginBottom: 8 }}>
          Secondary Medium
        </Button>
        <Button variant="glass" size="medium" style={{ marginBottom: 8 }}>
          Glass Medium
        </Button>
        <Button variant="outline" size="small">
          Outline Small
        </Button>
      </Container>

      <Spacer size="m" />

      {/* Inputs Section */}
      <Container variant="card" size="normal">
        <Text variant="title">Inputs</Text>
        <Spacer size="m" />
        
        <Input
          variant="glass"
          size="large"
          label="Glass Input"
          placeholder="Type something..."
          value={inputValue}
          onChangeText={setInputValue}
        />
        
        <Input
          variant="outline"
          size="medium"
          label="Outline Input"
          placeholder="Another input..."
        />
        
        <Input
          variant="default"
          size="small"
          label="Default Input"
          placeholder="Small input..."
          error={inputError}
        />
      </Container>

      <Spacer size="m" />

      {/* Layout Components */}
      <Container variant="card" size="normal">
        <Text variant="title">Layout Components</Text>
        <Spacer size="m" />
        
        <Container variant="glass" size="compact" centerContent>
          <Text variant="subtitle">Glass Container</Text>
        </Container>
        
        <Spacer size="s" />
        
        <Divider variant="glass" size="normal" margin="normal" />
        
        <Spacer size="s" />
        
        <Container variant="default" size="compact" centerContent>
          <Text variant="subtitle">Default Container</Text>
        </Container>
      </Container>

      <Spacer size="m" />
    </ScrollView>
  );
}
