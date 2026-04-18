import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  FieldForm, 
  FieldInput 
} from '../../../packages/react-native-fieldflow/src';
import { ShowcaseColors as C, ShowcaseSpacing, ShowcaseRadius } from '../../constants/showcase-theme';
import { ActionButton, IconButton } from '../../components/showcase';

export default function DynamicFormsDemo() {
  const router = useRouter();
  const [members, setMembers] = useState([{ id: '1', name: '' }]);

  const addMember = () => {
    setMembers([...members, { id: Date.now().toString(), name: '' }]);
  };

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const updateMember = (id: string, name: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, name } : m));
  };

  const handleSubmit = () => {
    Alert.alert('Project Created', `Project with ${members.length} members submitted!`);
  };

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

      <FieldForm 
        onSubmit={handleSubmit}
        extraScrollPadding={120}
        keyboardVerticalOffset={0}
        scrollViewProps={{
          contentContainerStyle: styles.scrollContent,
          keyboardDismissMode: 'interactive',
        }}
      >
        <View style={styles.header}>
            <Text style={styles.title}>Dynamic Teams</Text>
            <Text style={styles.subtitle}>Adding and removing fields on the fly.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Info</Text>
          <View style={styles.card}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Project Name</Text>
              <FieldInput 
                placeholder="My Awesome App"
                style={styles.input}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Team Members</Text>
            <TouchableOpacity onPress={addMember} style={styles.addButton}>
                <Ionicons name="add-circle" size={20} color={C.accent} />
                <Text style={styles.addButtonText}>Add Member</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.membersList}>
            {members.map((member, index) => (
              <View key={member.id} style={styles.memberCard}>
                <View style={styles.memberInputWrapper}>
                  <Text style={styles.memberLabel}>Member #{index + 1}</Text>
                  <View style={styles.inputRow}>
                    <FieldInput 
                      placeholder="Enter name"
                      value={member.name}
                      onChangeText={(text) => updateMember(member.id, text)}
                      style={[styles.input, { flex: 1 }]}
                    />
                    {members.length > 1 && (
                      <TouchableOpacity 
                        onPress={() => removeMember(member.id)}
                        style={styles.deleteButton}
                      >
                        <Ionicons name="trash-outline" size={20} color={C.error || '#FF3B30'} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
            <Ionicons name="flash" size={18} color={C.accent} />
            <Text style={styles.infoText}>
                FieldFlow automatically re-indexes the focus chain whenever the component tree changes. 
                Try adding 5 members and tapping "Next" on each!
            </Text>
        </View>

        <ActionButton 
          title="Create Project" 
          onPress={handleSubmit} 
          style={styles.submitButton}
        />
      </FieldForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgPrimary,
  },
  scrollContent: {
    padding: ShowcaseSpacing.xl,
    paddingBottom: 60,
  },
  header: {
    marginBottom: ShowcaseSpacing.xxl,
    paddingTop: ShowcaseSpacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: C.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: C.textSecondary,
    marginTop: ShowcaseSpacing.xs,
  },
  section: {
    marginBottom: ShowcaseSpacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ShowcaseSpacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  card: {
    backgroundColor: C.bgCard,
    borderRadius: ShowcaseRadius.lg,
    padding: ShowcaseSpacing.lg,
    borderWidth: 1,
    borderColor: C.border,
  },
  membersList: {
    gap: ShowcaseSpacing.md,
  },
  memberCard: {
    backgroundColor: C.bgCard,
    borderRadius: ShowcaseRadius.md,
    padding: ShowcaseSpacing.md,
    borderWidth: 1,
    borderColor: C.borderSubtle,
  },
  inputWrapper: {
    gap: ShowcaseSpacing.xs,
  },
  memberInputWrapper: {
    gap: ShowcaseSpacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textSecondary,
    marginLeft: 4,
  },
  memberLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: C.textTertiary,
    marginLeft: 4,
  },
  input: {
    height: 48,
    backgroundColor: C.bgPrimary,
    borderRadius: ShowcaseRadius.md,
    paddingHorizontal: ShowcaseSpacing.md,
    fontSize: 15,
    color: C.textPrimary,
    borderWidth: 1,
    borderColor: C.borderSubtle,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShowcaseSpacing.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShowcaseSpacing.xs,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: C.accentLight,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.accent,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: (C.error + '1A') || '#FF3B301A', // 10% opacity
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ShowcaseSpacing.md,
    backgroundColor: C.bgSecondary,
    padding: ShowcaseSpacing.lg,
    borderRadius: ShowcaseRadius.lg,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: ShowcaseSpacing.xl,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: C.textSecondary,
    fontStyle: 'italic',
  },
  submitButton: {
    height: 56,
  },
});
