import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { 
  FieldForm, 
  FieldInput, 
  FieldTags, 
  FieldSelect 
} from 'react-native-fieldflow';
import { Ionicons } from '@expo/vector-icons';

import { SpecHeader } from '../SpecHeader';
import { ShowcaseColors as C, ShowcaseSpacing as S, ShowcaseRadius as R } from '../../../constants/showcase-theme';

export default function ProfileEdit() {
  const handleFinish = (values: any) => {
    console.log('Profile Edit:', values);
  };

  const roleOptions = [
    { label: 'Developer', value: 'dev', description: 'Builds things with code' },
    { label: 'Designer', value: 'design', description: 'Makes things look good' },
    { label: 'Manager', value: 'pm', description: 'Keeps things on track' },
    { label: 'Entrepreneur', value: 'founder', description: 'Starts things' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: C.bgSecondary }]}>
      <SpecHeader 
        title="Settings & Profile" 
        subtitle="Manage your public presence and professional role."
      />

      <FieldForm 
        onFinish={handleFinish}
        style={styles.form}
        extraScrollPadding={100}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatar, { backgroundColor: C.bgCard }]}>
              <Ionicons name="person" size={42} color={C.textTertiary} />
              <TouchableOpacity style={[styles.avatarEdit, { backgroundColor: C.accent }]}>
                <Ionicons name="camera" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.headerTitle}>Public Profile</Text>
        </View>

        {/* Basic Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Basic Information</Text>
          <FieldInput
            name="username"
            label="Username"
            placeholder="@johndoe"
            leftIcon={<Ionicons name="at-outline" size={18} color={C.accent} />}
            containerStyle={{ marginBottom: S.md }}
          />
          <FieldInput
            name="bio"
            label="Short Bio"
            placeholder="Tell us about yourself..."
            multiline
            numberOfLines={2}
            inputStyle={{ height: 64, paddingTop: 10 }}
            leftIcon={<Ionicons name="reader-outline" size={18} color={C.accent} />}
          />
        </View>

        {/* Professional Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Professional Identity</Text>
          <FieldSelect
            name="role"
            label="Primary Role"
            options={roleOptions}
            placeholder="Select your role"
            sheetTitle="What do you do?"
            leftIcon={<Ionicons name="briefcase-outline" size={18} color={C.accent} />}
            containerStyle={{ marginBottom: S.md }}
          />

          <FieldTags
            name="skills"
            label="Professional Skills"
            placeholder="Add a skill..."
            leftIcon={<Ionicons name="ribbon-outline" size={18} color={C.accent} />}
          />
        </View>

        <View style={{ height: S.xxl }} />
      </FieldForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    paddingHorizontal: S.xl,
    paddingTop: S.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: S.xxl,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.textPrimary,
    marginTop: S.md,
  },
  avatarWrapper: {
    padding: 6,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.2)', // Soft Primary
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarEdit: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: R.xl,
    padding: S.xl,
    marginBottom: S.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.3)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: S.lg,
  },
});
