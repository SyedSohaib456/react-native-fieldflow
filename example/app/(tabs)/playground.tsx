import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FieldForm,
  FieldInput,
  useKeyboardHeight,
} from '../../../packages/react-native-fieldflow/src';
import { SpecHeader } from '@/components/showcase/SpecHeader';
import { SectionLabel } from '@/components/showcase';
import {
  ShowcaseColors as C,
  ShowcaseRadius,
  ShowcaseSpacing as S,
} from '@/constants/showcase-theme';

export default function PlaygroundScreen() {
  const insets = useSafeAreaInsets();
  const kbHeight = useKeyboardHeight();
  
  // Builder state
  const [label, setLabel] = useState('Example Field');
  const [placeholder, setPlaceholder] = useState('Type here...');
  const [disabled, setDisabled] = useState(false);
  const [secure, setSecure] = useState(false);

  return (
    <View style={styles.container}>
      <FieldForm
        style={styles.formContainer}
        scrollViewProps={{
          contentContainerStyle: [styles.scrollContent, { paddingBottom: insets.bottom + 40 }],
          showsVerticalScrollIndicator: false,
        }}>
        
        <SpecHeader
          title="Playground"
          subtitle="Interactive sandbox to experiment with component properties and visualizers."
        />

        {/* --- FIELD BUILDER --- */}
        <View style={styles.section}>
          <SectionLabel title="Field Builder" description="Toggle props to live-preview the result" />
          
          <View style={styles.previewCard}>
            <FieldInput 
              name="preview" 
              label={label} 
              placeholder={placeholder} 
              disabled={disabled}
              secureTextEntry={secure}
            />
          </View>

          <View style={styles.controlsCard}>
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Label</Text>
              <FieldInput 
                name="set_label" 
                value={label} 
                onChangeText={setLabel} 
                placeholder="Change label..."
                style={styles.compactInput}
              />
            </View>
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Placeholder</Text>
              <FieldInput 
                name="set_placeholder" 
                value={placeholder} 
                onChangeText={setPlaceholder}
                placeholder="Change placeholder..."
                style={styles.compactInput}
              />
            </View>
            <View style={styles.switchRow}>
              <TouchableOpacity 
                style={[styles.chip, disabled && styles.chipActive]} 
                onPress={() => setDisabled(!disabled)}
              >
                <Text style={[styles.chipText, disabled && styles.chipTextActive]}>Disabled</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.chip, secure && styles.chipActive]} 
                onPress={() => setSecure(!secure)}
              >
                <Text style={[styles.chipText, secure && styles.chipTextActive]}>Secure</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* --- KEYBOARD VISUALIZER --- */}
        <View style={styles.section}>
          <SectionLabel title="Keyboard Visualizer" description="Live pixel offset and frame data" />
          <View style={styles.visualizerCard}>
            <View style={styles.kbBar}>
              <View style={[styles.kbFill, { height: Math.max(10, kbHeight / 2) }]} />
              <Text style={styles.kbValue}>{Math.round(kbHeight)}px</Text>
            </View>
            <View style={styles.kbInfo}>
              <Text style={styles.infoLabel}>Active Offset</Text>
              <Text style={styles.infoValue}>{Math.round(kbHeight)}pt</Text>
            </View>
          </View>
        </View>

        {/* --- THEME BUILDER --- */}
        <View style={styles.section}>
          <SectionLabel title="Theme Preview" description="How the Indigo system looks across components" />
          <View style={styles.themeCard}>
            <View style={[styles.colorChip, { backgroundColor: C.accent }]} />
            <View style={[styles.colorChip, { backgroundColor: C.velaNavy }]} />
            <View style={[styles.colorChip, { backgroundColor: C.pulseRose }]} />
            <View style={[styles.colorChip, { backgroundColor: C.marloGold }]} />
          </View>
          <TouchableOpacity style={styles.exportButton}>
            <Text style={styles.exportButtonText}>Copy Theme JSON</Text>
          </TouchableOpacity>
        </View>

      </FieldForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgPrimary,
  },
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    paddingHorizontal: S.xl,
    gap: S.md,
    marginBottom: S.xxl,
  },
  previewCard: {
    backgroundColor: '#FFF',
    borderRadius: ShowcaseRadius.lg,
    padding: S.lg,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: S.sm,
  },
  controlsCard: {
    backgroundColor: C.bgCard,
    borderRadius: ShowcaseRadius.lg,
    padding: S.lg,
    gap: S.md,
  },
  controlRow: {
    gap: 4,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
  },
  compactInput: {
    backgroundColor: '#FFF',
  },
  switchRow: {
    flexDirection: 'row',
    gap: S.sm,
    marginTop: S.sm,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: C.border,
  },
  chipActive: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textSecondary,
  },
  chipTextActive: {
    color: '#FFF',
  },
  visualizerCard: {
    backgroundColor: C.velaNavy,
    borderRadius: ShowcaseRadius.lg,
    padding: S.lg,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: S.xl,
  },
  kbBar: {
    width: 60,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
    overflow: 'hidden',
  },
  kbFill: {
    width: '100%',
    backgroundColor: C.accent,
    position: 'absolute',
    bottom: 0,
  },
  kbValue: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
    zIndex: 1,
  },
  kbInfo: {
    flex: 1,
    paddingBottom: 8,
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '600',
  },
  infoValue: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '800',
  },
  themeCard: {
    flexDirection: 'row',
    gap: S.sm,
    marginBottom: S.sm,
  },
  colorChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  exportButton: {
    backgroundColor: C.bgCard,
    padding: S.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  exportButtonText: {
    color: C.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
});
