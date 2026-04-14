import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SpecHeader } from '@/components/showcase/SpecHeader';
import {
  ShowcaseColors as C,
  ShowcaseRadius,
  ShowcaseSpacing as S,
} from '@/constants/showcase-theme';

const SHOWCASE_ITEMS = [
  {
    id: 'vela-signup',
    title: 'Sign Up',
    subtitle: 'Vela Fintech',
    description: 'Smart inference, phone picker, and password meter.',
    icon: 'person-add-outline',
    color: C.velaNavy,
    badge: 'Popular',
  },
  {
    id: 'vela-otp',
    title: 'OTP Verification',
    subtitle: 'Vela Fintech',
    description: '6-digit code with auto-submit and error shake.',
    icon: 'shield-checkmark-outline',
    color: C.velaNavy,
  },
  {
    id: 'marlo-payment',
    title: 'Payment Details',
    subtitle: 'Marlo Luxury',
    description: 'Card formatting and dynamic brand detection.',
    icon: 'card-outline',
    color: C.marloGold,
  },
  {
    id: 'profile-edit',
    title: 'Profile Edit',
    subtitle: 'Settings',
    description: 'Grouped sections and dirty state tracking.',
    icon: 'settings-outline',
    color: C.textPrimary,
  },
  {
    id: 'address-form',
    title: 'Address Entry',
    subtitle: 'Logistics',
    description: 'Searchable regions and optional field chains.',
    icon: 'map-outline',
    color: C.wayfarerSky,
  },
  {
    id: 'pulse-onboarding',
    title: 'Fitness Onboarding',
    subtitle: 'Pulse App',
    description: 'Multi-step wizard with date and goal pickers.',
    icon: 'fitness-outline',
    color: C.pulseRose,
    badge: 'New',
  },
  {
    id: 'thread-chat',
    title: 'Chat Compose',
    subtitle: 'Thread Social',
    description: 'Inverted avoidance with emoji panel support.',
    icon: 'chatbubble-ellipses-outline',
    color: C.threadTeal,
  },
  {
    id: 'wayfarer-search',
    title: 'Travel Search',
    subtitle: 'Wayfarer',
    description: 'Search suggestions and filter chips.',
    icon: 'airplane-outline',
    color: C.wayfarerSky,
  },
];

export default function ShowcaseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <SpecHeader
          title="Showcase"
          subtitle="Real-world production screens built with FieldFlow context and components."
        />

        <View style={styles.grid}>
          {SHOWCASE_ITEMS.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() => {
                router.push(`/showcase/${item.id}`);
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={22} color="#FFF" />
              </View>

              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                  {item.badge ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color={C.textTertiary} style={styles.chevron} />
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Every screen above is a standard FieldForm flow.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgPrimary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  grid: {
    paddingHorizontal: S.xl,
    gap: S.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bgCard,
    borderRadius: ShowcaseRadius.lg,
    padding: S.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardPressed: {
    backgroundColor: C.bgPrimary,
    borderColor: C.border,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: S.md,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 2,
  },
  itemDesc: {
    fontSize: 13,
    color: C.textSecondary,
    lineHeight: 18,
  },
  badge: {
    backgroundColor: C.accentLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: C.accent,
  },
  chevron: {
    marginLeft: S.sm,
  },
  footer: {
    marginTop: S.xxl,
    alignItems: 'center',
    paddingHorizontal: S.xl,
  },
  footerText: {
    fontSize: 13,
    color: C.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
