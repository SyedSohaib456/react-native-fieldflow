import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FieldForm,
  FieldInput,
  useKeyboardState,
} from '../../../packages/react-native-fieldflow/src';
import { SpecHeader } from '@/components/showcase/SpecHeader';
import {
  ShowcaseColors as C,
  ShowcaseRadius,
  ShowcaseSpacing as S,
} from '@/constants/showcase-theme';

export default function StressTestScreen() {
  const insets = useSafeAreaInsets();
  const { height: kbHeight } = useKeyboardState();
  
  const [testMode, setTestMode] = useState<'50-fields' | 'dynamic-chain'>('50-fields');

  const render50Fields = () => {
    return Array.from({ length: 50 }).map((_, i) => (
      <FieldInput
        key={`field-${i}`}
        name={`field_${i}`}
        label={`Field #${i + 1}`}
        placeholder={`Traversing field ${i + 1}...`}
      />
    ));
  };

  const [showDynamic, setShowDynamic] = useState(false);

  const renderDynamicChain = () => {
    return (
      <View style={styles.dynamicContainer}>
        <FieldInput name="fixed_1" label="Fixed Field 1" />
        
        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={() => setShowDynamic(!showDynamic)}
        >
          <Text style={styles.toggleButtonText}>
            {showDynamic ? 'Remove Intermediary Fields' : 'Inject 5 Middle Fields'}
          </Text>
        </TouchableOpacity>

        {showDynamic && (
          <View style={styles.injectedFields}>
            {Array.from({ length: 5 }).map((_, i) => (
              <FieldInput 
                key={`dynamic-${i}`} 
                name={`dynamic_${i}`} 
                label={`Injected #${i + 1}`} 
                placeholder="Next will follow new order"
              />
            ))}
          </View>
        )}

        <FieldInput name="fixed_2" label="Fixed Field 2" placeholder="Focus target after dynamic items" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.metricsOverlay, { top: insets.top + 10 }]}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>KB Height</Text>
          <Text style={styles.metricValue}>{Math.round(kbHeight)}px</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Stability</Text>
          <Text style={[styles.metricValue, { color: C.success }]}>Stable</Text>
        </View>
      </View>

      <FieldForm
        style={styles.formContainer}
        scrollViewProps={{
          contentContainerStyle: [styles.scrollContent, { paddingBottom: insets.bottom + 40 }],
          showsVerticalScrollIndicator: false,
        }}>
        
        <SpecHeader
          title="Stress Test"
          subtitle="Proving library stability at scale and under dynamic layout conditions."
        />

        <View style={styles.modeTabs}>
          <TouchableOpacity 
            style={[styles.modeTab, testMode === '50-fields' && styles.modeTabActive]}
            onPress={() => setTestMode('50-fields')}
          >
            <Text style={[styles.modeTabText, testMode === '50-fields' && styles.modeTabTextActive]}>
              50 Fields
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeTab, testMode === 'dynamic-chain' && styles.modeTabActive]}
            onPress={() => setTestMode('dynamic-chain')}
          >
            <Text style={[styles.modeTabText, testMode === 'dynamic-chain' && styles.modeTabTextActive]}>
              Dynamic Chain
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {testMode === '50-fields' ? render50Fields() : renderDynamicChain()}
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
  metricsOverlay: {
    position: 'absolute',
    right: S.xl,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    gap: 12,
    zIndex: 100,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  modeTabs: {
    flexDirection: 'row',
    marginHorizontal: S.xl,
    backgroundColor: C.bgCard,
    borderRadius: 12,
    padding: 4,
    marginBottom: S.xl,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeTabActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: C.textSecondary,
  },
  modeTabTextActive: {
    color: C.accent,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: S.xl,
    gap: S.lg,
  },
  dynamicContainer: {
    gap: S.lg,
  },
  toggleButton: {
    backgroundColor: C.accentLight,
    padding: S.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.accentBorder,
    borderStyle: 'dashed',
  },
  toggleButtonText: {
    color: C.accent,
    fontWeight: '600',
    fontSize: 14,
  },
  injectedFields: {
    gap: S.lg,
    paddingLeft: S.md,
    borderLeftWidth: 2,
    borderLeftColor: C.accentBorder,
  },
});
