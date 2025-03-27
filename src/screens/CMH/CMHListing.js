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
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SIZES, SHADOWS, RADIUS } from '../../constants/theme';

const CMHListing = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [cmhData, setCmhData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const pageSize = 30;

  const fetchCMHData = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setPage(1);
        setCmhData([]);
        pageNum = 1;
      }
      
      const token = await AsyncStorage.getItem('userToken');
      //console.log('Token:', token);
      setLoadingMore(pageNum > 1);

      const response = await fetch(`http://10.10.10.14:5000/cmh?page=${pageNum}&size=${pageSize}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      //console.log('CMH data:', data);
      
      if (data.length < pageSize) {
        setHasMoreData(false);
      } else {
        setHasMoreData(true);
      }

      if (pageNum === 1) {
        setCmhData(data);
      } else {
        setCmhData(prevData => [...prevData, ...data]);
      }
      
      setPage(pageNum);
    } catch (err) {
      console.error('Error:', err);
      setError('获取数据失败');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCMHData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCMHData(1, true);
  };

  const loadMoreData = () => {
    if (!loadingMore && hasMoreData) {
      fetchCMHData(page + 1);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredCMH = cmhData.filter(item => {
    if (!item) return false;
    const searchLower = searchQuery.toLowerCase();
    
    // 检查所有字段
    return (
      (item.stock_id && item.stock_id.toString().toLowerCase().includes(searchLower)) ||
      (item.item_id && item.item_id.toString().toLowerCase().includes(searchLower)) ||
      (item.mgroup_id && item.mgroup_id.toString().toLowerCase().includes(searchLower)) ||
      (item.customer && item.customer.toString().toLowerCase().includes(searchLower)) ||
      (item.status && item.status.toString().toLowerCase().includes(searchLower)) ||
      (item.location && item.location.toString().toLowerCase().includes(searchLower)) ||
      (item.createdt && new Date(item.createdt).toLocaleDateString().toLowerCase().includes(searchLower))
    );
  });

  const renderCMHItem = ({ item }) => {
    if (!item) return null;
    
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CMHDetails', { cmh: item })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardId}>Stock ID #</Text>
          <Text style={styles.cardDate}>
            {(item.stock_id || '-').trim()}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Item ID</Text>
            <Text style={styles.cardValue}>{(item.item_id || '-').trim()}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Mgroup ID</Text>
            <Text style={styles.cardValue}>{(item.mgroup_id || '-').trim()}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Customer</Text>
            <Text style={styles.cardValue}>{(item.customer || '-').trim()}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Status</Text>
            <Text style={styles.cardValue}>{(item.status || '-').trim()}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Location</Text>
            <Text style={styles.cardValue}>{(item.location || '-').trim()}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Create Date</Text>
            <Text style={styles.cardValue}>
                  {item.createdt
                    ? new Intl.DateTimeFormat('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      }).format(new Date(item.createdt))
                    : '-'}
            </Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.footerText}>Loading More...</Text>
      </View>
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
        <Text style={styles.headerTitle}>Chassis Movement History</Text>
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
        data={filteredCMH}
        renderItem={renderCMHItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={renderFooter}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !error && (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color={COLORS.gray} />
              <Text style={styles.emptyText}>No Chassis Movement History found</Text>
            </View>
          )
        }
      />

      {/* Load More Button - 当用户想手动加载更多时 */}
     {/*  {!loadingMore && hasMoreData && cmhData.length > 0 && (
        <TouchableOpacity 
          style={styles.loadMoreButton}
          onPress={loadMoreData}
        >
          <Text style={styles.loadMoreButtonText}>Load More</Text>
          <Ionicons name="arrow-down" size={20} color={COLORS.white} />
        </TouchableOpacity>
      )} */}
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
    padding: SPACING.xs,
    paddingRight: SPACING.md,
    paddingBottom: SPACING.md,
    alignItems: 'flex-end',
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  footerText: {
    marginLeft: SPACING.sm,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  loadMoreButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    margin: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  loadMoreButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginRight: SPACING.sm,
  }
});

export default CMHListing; 