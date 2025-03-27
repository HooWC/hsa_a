import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SIZES, SHADOWS, RADIUS } from '../../constants/theme';

const PlanListing = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlans = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Token:', token);

      const response = await fetch('http://10.10.10.14:5000/plans', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Plans data:', data);
      setPlans(data);
    } catch (err) {
      console.error('Error:', err);
      setError('获取数据失败');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPlans();
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredPlans = plans.filter(plan => {
    if (!plan) return false;
    const searchLower = searchQuery.toLowerCase();
    
    return (
      (plan.plan_id && plan.plan_id.toString().toLowerCase().includes(searchLower)) ||
      (plan.model_id && plan.model_id.toString().toLowerCase().includes(searchLower)) ||
      (plan.body_type && plan.body_type.toString().toLowerCase().includes(searchLower)) ||
      (plan.bdm && plan.bdm.toString().toLowerCase().includes(searchLower)) ||
      (plan.wheelbase && plan.wheelbase.toString().toLowerCase().includes(searchLower))
    );
  });

  const renderPlan = ({ item }) => {
    if (!item) return null;
    
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('PlanDetails', { plan: item })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardId}>Plan #</Text>
          <Text style={styles.cardDate}>
            {item.plan_id || '-'}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Model</Text>
            <Text style={styles.cardValue}>{item.model_id || '-'}</Text>
          </View>
          <View style={[styles.cardRow, styles.bodyTypeRow]}>
            <Text style={styles.cardLabel}>Body Type</Text>
            <View style={styles.bodyTypeContainer}>
              <Text style={[styles.cardValue, styles.bodyTypeValue]} numberOfLines={2}>
                {item.body_type?.length > 50 
                  ? item.body_type.substring(0, 50) + '...' 
                  : item.body_type || '-'}
              </Text>
            </View>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>BDM</Text>
            <Text style={styles.cardValue}>{item.bdm || '-'}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Wheelbase</Text>
            <Text style={styles.cardValue}>{item.wheelbase || '-'}</Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan Listing</Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={COLORS.gray}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* List */}
      <FlatList
        data={filteredPlans}
        renderItem={renderPlan}
        keyExtractor={item => item.id?.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !error && (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color={COLORS.gray} />
              <Text style={styles.emptyText}>No plans found</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    ...SHADOWS.medium,
  },
  backButton: {
    marginRight: SPACING.sm,
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    ...SHADOWS.light,
  },
  searchInput: {
    flex: 1,
    height: 44,
    marginLeft: SPACING.sm,
    fontSize: SIZES.medium,
    color: COLORS.darkGray,
  },
  clearButton: {
    padding: SPACING.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  errorText: {
    marginLeft: SPACING.sm,
    color: COLORS.error,
    fontSize: SIZES.medium,
  },
  listContainer: {
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    ...SHADOWS.light,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardDate: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  cardId: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cardContent: {
    padding: SPACING.md,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  cardLabel: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  cardValue: {
    fontSize: SIZES.small,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  cardFooter: {
    padding: SPACING.md,
    alignItems: 'flex-end',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    marginTop: SPACING.md,
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  bodyTypeRow: {
    alignItems: 'flex-start',
    marginVertical: SPACING.sm,
  },
  bodyTypeContainer: {
    flex: 1,
    paddingLeft: SPACING.lg,
  },
  bodyTypeValue: {
    flex: 0.3,
    textAlign: 'right',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.sm,
    lineHeight: 20,
  },
});

export default PlanListing; 