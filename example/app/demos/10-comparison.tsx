import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Platform, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView,
  TextInput,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  FieldForm, 
  FieldInput 
} from '../../../packages/react-native-fieldflow/src';
import { ShowcaseColors as C, ShowcaseSpacing, ShowcaseRadius } from '../../constants/showcase-theme';
import { IconButton } from '../../components/showcase';

const WITHOUT_CODE = `// ❌ Manual Boilerplate (42 lines)
const nameRef = useRef<TextInput>(null);
const emailRef = useRef<TextInput>(null);
const passRef = useRef<TextInput>(null);
const confRef = useRef<TextInput>(null);

return (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
  >
    <ScrollView 
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 20 }}
    >
      <TextInput
        ref={nameRef}
        placeholder="Name"
        blurOnSubmit={false}
        onSubmitEditing={() => emailRef.current?.focus()}
        returnKeyType="next"
      />
      <TextInput
        ref={emailRef}
        placeholder="Email"
        keyboardType="email-address"
        blurOnSubmit={false}
        onSubmitEditing={() => passRef.current?.focus()}
        returnKeyType="next"
      />
      <TextInput
        ref={passRef}
        placeholder="Password"
        secureTextEntry
        blurOnSubmit={false}
        onSubmitEditing={() => passRef.current?.focus()}
        returnKeyType="next"
      />
      <TextInput
        ref={confRef}
        placeholder="Confirm"
        secureTextEntry
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />
      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  </KeyboardAvoidingView>
);`;

const WITH_CODE = `// ✅ With FieldFlow (8 lines)
return (
  <FieldForm onSubmit={handleSubmit}>
    <FieldInput placeholder="Name" />
    <FieldInput placeholder="Email" keyboardType="email-address" />
    <FieldInput placeholder="Password" secureTextEntry />
    <FieldInput placeholder="Confirm" secureTextEntry />
    <Button title="Submit" onPress={handleSubmit} />
  </FieldForm>
);`;

export default function ComparisonDemo() {
  const router = useRouter();
  const [tab, setTab] = useState<'without' | 'with'>('with');

  // Boilerplate refs for the "Without" side
  const r1 = useRef<TextInput>(null);
  const r2 = useRef<TextInput>(null);
  const r3 = useRef<TextInput>(null);
  const r4 = useRef<TextInput>(null);

  const handleSubmit = () => Alert.alert('Submitted', 'Form works perfectly!');

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerLeft: () => (
            <IconButton 
              icon="chevron-back" 
              onPress={() => router.back()} 
            />
          ),
        }} 
      />

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, tab === 'without' && styles.tabActive]} 
          onPress={() => setTab('without')}
        >
          <Text style={[styles.tabText, tab === 'without' && styles.tabTextActive]}>❌ Without</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, tab === 'with' && styles.tabActive]} 
          onPress={() => setTab('with')}
        >
          <Text style={[styles.tabText, tab === 'with' && styles.tabTextActive]}>✅ FieldFlow</Text>
        </TouchableOpacity>
      </View>

      <FieldForm 
        onSubmit={handleSubmit}
        extraScrollPadding={100}
        keyboardVerticalOffset={0}
        scrollViewProps={{
          contentContainerStyle: styles.scrollContent,
          keyboardDismissMode: 'interactive',
        }}
      >
        <View style={styles.comparisonHeader}>
            <View style={[styles.locBadge, tab === 'without' ? styles.locRed : styles.locGreen]}>
                <Text style={styles.locText}>Lines of code: {tab === 'without' ? '42' : '8'}</Text>
            </View>
            <View style={styles.diffBar}>
                <Text style={styles.diffText}>You saved 34 lines (81% less code)</Text>
            </View>
        </View>

        <View style={styles.previewSection}>
            <Text style={styles.sectionLabel}>Live Working Form:</Text>
            <View style={styles.previewCard}>
                {tab === 'without' ? (
                    <KeyboardAvoidingView 
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={100}
                    >
                        <View style={styles.boilerplateForm}>
                            <TextInput 
                                ref={r1}
                                placeholder="Full Name" 
                                style={styles.mockInput} 
                                blurOnSubmit={false}
                                onSubmitEditing={() => r2.current?.focus()}
                                returnKeyType="next"
                            />
                            <TextInput 
                                ref={r2}
                                placeholder="Email Address" 
                                style={styles.mockInput} 
                                keyboardType="email-address"
                                blurOnSubmit={false}
                                onSubmitEditing={() => r3.current?.focus()}
                                returnKeyType="next"
                            />
                            <TextInput 
                                ref={r3}
                                placeholder="Password" 
                                style={styles.mockInput} 
                                secureTextEntry
                                blurOnSubmit={false}
                                onSubmitEditing={() => r4.current?.focus()}
                                returnKeyType="next"
                            />
                            <TextInput 
                                ref={r4}
                                placeholder="Confirm Password" 
                                style={styles.mockInput} 
                                secureTextEntry
                                onSubmitEditing={handleSubmit}
                                returnKeyType="done"
                            />
                            <TouchableOpacity style={styles.mockBtn} onPress={handleSubmit}>
                                <Text style={styles.mockBtnText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                ) : (
                    <FieldForm onSubmit={handleSubmit} avoidKeyboard={false}>
                         <FieldInput placeholder="Full Name" style={styles.mockInput} />
                         <FieldInput placeholder="Email Address" style={styles.mockInput} keyboardType="email-address" />
                         <FieldInput placeholder="Password" style={styles.mockInput} secureTextEntry />
                         <FieldInput placeholder="Confirm Password" style={styles.mockInput} secureTextEntry />
                         <TouchableOpacity style={styles.mockBtn} onPress={handleSubmit}>
                            <Text style={styles.mockBtnText}>Submit</Text>
                        </TouchableOpacity>
                    </FieldForm>
                )}
            </View>
        </View>

        <View style={styles.codeSection}>
            <Text style={styles.sectionLabel}>Implementation Implementation:</Text>
            <View style={styles.codeCard}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Text style={styles.codeText}>{tab === 'without' ? WITHOUT_CODE : WITH_CODE}</Text>
                </ScrollView>
            </View>
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
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: ShowcaseSpacing.xl,
    paddingVertical: ShowcaseSpacing.md,
    backgroundColor: C.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: C.borderSubtle,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: C.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.textSecondary,
  },
  tabTextActive: {
    color: C.accent,
  },
  scrollContent: {
    padding: ShowcaseSpacing.xl,
    paddingBottom: 40,
  },
  comparisonHeader: {
    alignItems: 'center',
    gap: ShowcaseSpacing.md,
    marginBottom: ShowcaseSpacing.xxl,
  },
  locBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  locRed: {
    backgroundColor: '#FFEEF0',
  },
  locGreen: {
    backgroundColor: '#E6F9ED',
  },
  locText: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textPrimary,
  },
  diffBar: {
    backgroundColor: C.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.accentBorder,
  },
  diffText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.accent,
  },
  previewSection: {
    gap: ShowcaseSpacing.md,
    marginBottom: ShowcaseSpacing.xxl,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  previewCard: {
    padding: ShowcaseSpacing.lg,
    backgroundColor: C.bgSecondary,
    borderRadius: ShowcaseRadius.lg,
    borderWidth: 1,
    borderColor: C.border,
  },
  boilerplateForm: {
    gap: 12,
  },
  mockInput: {
    height: 44,
    backgroundColor: C.bgPrimary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  mockBtn: {
    height: 44,
    backgroundColor: C.accent,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  mockBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  codeSection: {
    gap: ShowcaseSpacing.md,
  },
  codeCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: ShowcaseRadius.md,
    padding: 16,
  },
  codeText: {
    color: '#D4D4D4',
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    lineHeight: 18,
  },
});
