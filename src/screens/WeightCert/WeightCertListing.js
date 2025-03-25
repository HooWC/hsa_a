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
import { API_BASE_URL } from '../../constants/config';

const WeightCertListing = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [weightCerts, setWeightCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeightCerts = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Token:', token);

      const response = await fetch('http://10.10.10.14:5000/weightCerts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('WeightCerts data:', data);
      setWeightCerts(data);
    } catch (err) {
      console.error('Error:', err);
      setError('获取数据失败');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeightCerts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeightCerts();
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredCerts = weightCerts.filter(cert => {
    if (!cert) return false;
    const searchLower = searchQuery.toLowerCase();
    
    // 检查所有字段
    return (
      (cert.mgroup_id && cert.mgroup_id.toString().toLowerCase().includes(searchLower)) || // Model Group
      (cert.make && cert.make.toString().toLowerCase().includes(searchLower)) || // Make
      (cert.model_id && cert.model_id.toString().toLowerCase().includes(searchLower)) || // Id
      (cert.wheelbase && cert.wheelbase.toString().toLowerCase().includes(searchLower)) || // Wheelbase
      (cert.bdm_w && cert.bdm_w.toString().toLowerCase().includes(searchLower)) || // BDM/BGK(W)
      (cert.bdm_e && cert.bdm_e.toString().toLowerCase().includes(searchLower)) || // BDM/BGK(G)
      (cert.axle && cert.axle.toString().toLowerCase().includes(searchLower)) // Axle
    );
  });

  const renderWeightCert = ({ item }) => {
    if (!item) return null;
    
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('WeightCertDetails', { cert: item })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardId}>Model Group</Text>
          <Text style={styles.cardDate}>
            {item.mgroup_id || 'N/A'}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Make</Text>
            <Text style={styles.cardValue}>{item.make || 'N/A'}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Id</Text>
            <Text style={styles.cardValue}>{item.model_id || 'N/A'}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Whenlbase</Text>
            <Text style={styles.cardValue}>{item.wheelbase || 'N/A'}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>BDM/BGK(W)</Text>
            <Text style={styles.cardValue}>{item.bdm_w || 'N/A'}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>BDM/BGK(E)</Text>
            <Text style={styles.cardValue}>{item.bdm_e || 'N/A'}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Axle</Text>
            <Text style={styles.cardValue}>{item.axle || 'N/A'}</Text>
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
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

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
        <Text style={styles.headerTitle}>Weight Certificates</Text>
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
        data={filteredCerts}
        renderItem={renderWeightCert}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !error && (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color={COLORS.gray} />
              <Text style={styles.emptyText}>No weight certificates found</Text>
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
  cardId: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cardDate: {
    fontSize: SIZES.small,
    color: COLORS.gray,
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
});

export default WeightCertListing; 