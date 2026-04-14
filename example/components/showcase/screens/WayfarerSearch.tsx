import React from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import { 
  FieldForm, 
  FieldSearch 
} from 'react-native-fieldflow';
import { Ionicons } from '@expo/vector-icons';

import { SpecHeader } from '../SpecHeader';
import { ShowcaseColors as C, ShowcaseSpacing as S, ShowcaseRadius as R } from '../../../constants/showcase-theme';

const MOCK_DESTINATIONS = [
  { id: '1', name: 'Santorini, Greece', type: 'Island', rating: '4.9', price: '$250/night' },
  { id: '2', name: 'Kyoto, Japan', type: 'City', rating: '4.8', price: '$180/night' },
  { id: '3', name: 'Swiss Alps, Switzerland', type: 'Mountain', rating: '5.0', price: '$320/night' },
];

export default function WayfarerSearch() {
  const handleSearch = (query: string) => {
    const normalized = query.toLowerCase();
    return MOCK_DESTINATIONS
      .filter((d) => d.name.toLowerCase().includes(normalized))
      .map((d) => ({
        id: d.id,
        label: d.name,
        value: d.name,
        description: `${d.type} • ${d.price}`,
        icon: <Ionicons name="location-outline" size={16} color={C.textSecondary} />,
      }));
  };

  const renderDestination = ({ item }: { item: typeof MOCK_DESTINATIONS[0] }) => (
    <View style={styles.card}>
      <View style={[styles.imagePlaceholder, { backgroundColor: C.bgCard }]}>
         <Ionicons name="image-outline" size={32} color={C.textTertiary} />
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#FF9500" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.cardSubtitle}>{item.type} • {item.price}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: C.bgPrimary }]}>
      <SpecHeader 
        title="Explore Places" 
        subtitle="Travel search with real-time suggestions."
      />

      <View style={styles.searchWrapper}>
        <FieldForm 
          onFinish={() => {}} 
          scrollable={false}
          style={styles.form}
        >
          <FieldSearch
            name="search"
            placeholder="Where would you like to go?"
            onSearch={handleSearch}
            inputContainerStyle={styles.searchInputContainer}
            leftIcon={<Ionicons name="location" size={20} color={C.wayfarerSky} />}
          />
        </FieldForm>
      </View>

      <FlatList
        data={MOCK_DESTINATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderDestination}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.listTitle}>Popular Destinations</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    paddingHorizontal: S.xl,
    paddingBottom: S.lg,
    backgroundColor: C.bgPrimary,
  },
  form: {
    flex: 0,
  },
  searchInputContainer: {
    borderRadius: R.full,
    backgroundColor: '#F2F2F7',
    borderWidth: 0,
    paddingHorizontal: 16,
  },
  list: {
    padding: S.xl,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: S.lg,
  },
  card: {
    marginBottom: S.xl,
    borderRadius: R.lg,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  imagePlaceholder: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    padding: S.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.textPrimary,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.textSecondary,
  },
  cardSubtitle: {
    fontSize: 14,
    color: C.textSecondary,
  },
});
