import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SIZES, SHADOWS, RADIUS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const TabButton = ({ icon, label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, active && styles.tabButtonActive]}
    onPress={onPress}
  >
    <Ionicons
      name={icon}
      size={24}
      color={active ? COLORS.primary : COLORS.gray}
    />
    <Text
      style={[
        styles.tabLabel,
        { color: active ? COLORS.primary : COLORS.gray },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const CMHDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cmh } = route.params;
  const [activeTab, setActiveTab] = useState('main');
  const [chassismhData, setChassismhData] = useState([]);
  const [dsoiData, setDsoiData] = useState([]);
  const [quoteData, setQuoteData] = useState([]);
  const [chassisfileData, setChassisfileData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        
        // 获取 chassismh 数据 - 对应第一个界面Chassis
        const chassismhResponse = await fetch(`http://10.10.10.14:5000/chassismh/${cmh.stock_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const chassismhData = await chassismhResponse.json();
        setChassismhData(chassismhData);
        
        // 获取 dsoi 和 quote 数据 - 对应第二个界面History
        const dsoiResponse = await fetch(`http://10.10.10.14:5000/dsoi/${cmh.stock_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const dsoiData = await dsoiResponse.json();
        setDsoiData(dsoiData);
        
        const quoteResponse = await fetch(`http://10.10.10.14:5000/quote/${cmh.stock_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const quoteData = await quoteResponse.json();
        setQuoteData(quoteData);
        
        // 获取 chassisfile 数据 - 对应第三个界面Picture
        const chassisfileResponse = await fetch(`http://10.10.10.14:5000/chassisfile/${cmh.stock_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const chassisfileData = await chassisfileResponse.json();
        setChassisfileData(chassisfileData);
        
      } catch (err) {
        console.error('Error:', err);
        setError('获取关联数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchAdditionalData();
  }, [cmh.stock_id]);

  const renderMainInfo = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chassis Details</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Chassis #</Text>
          <Text style={styles.infoValue}>{cmh.stock_id || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Internal #</Text>
          <Text style={styles.infoValue}>{cmh.internal_id || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={styles.infoValue}>{cmh.status || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Item ID</Text>
          <Text style={styles.infoValue}>{cmh.item_id || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Sales Code</Text>
          <Text style={styles.infoValue}>{cmh.allc_id || '-'}</Text>
        </View>      
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>{cmh.location || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ESN #</Text>
          <Text style={styles.infoValue}>{cmh.eserial_no || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Customer</Text>
          <Text style={styles.infoValue}>{cmh.bc_if || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Make</Text>
          <Text style={styles.infoValue}>{cmh.make || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Model Group</Text>
          <Text style={styles.infoValue}>{cmh.mgroup_id || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Eng. Model</Text>
          <Text style={styles.infoValue}>{cmh.engine_id || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>AP Status</Text>
          <Text style={styles.infoValue}>{cmh.ap_status || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>AP #</Text>
          <Text style={styles.infoValue}>{(cmh.ap_id || '-').trim()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pending</Text>
          <Text style={styles.infoValue}>{cmh.p_status || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Reg No</Text>
          <Text style={styles.infoValue}>{cmh.reg_no || '-'}</Text>
        </View>
      </View>

    
      {/* Chassis Movement Entries */}
      {loading ? (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
) : (
  chassismhData && chassismhData.length > 0 ? (
    chassismhData.filter(item => item.chassismh_id).length > 0 ? ( // 确保至少有一个 item.chassismh_id
      chassismhData
        .filter(item => item.chassismh_id) // 过滤掉没有 chassismh_id 的数据
        .map((chassisItem, index) => (
          <TouchableOpacity
            key={`chassis-${index}`}
            style={styles.section}
            onPress={() => navigation.navigate('ChassisItemDetail', { chassisItem })}
          >
            <View style={styles.chassisEntryHeader}>
              <View>
                <Text style={styles.chassisEntryTitle}>
                  {chassisItem.chassismh_id}
                </Text>
                <Text style={styles.chassisEntryDate}>
                  {chassisItem.ddate ? new Date(chassisItem.ddate).toLocaleDateString() : '-'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
        ))
    ) : (
      <View style={styles.section}>
        <Text style={styles.noDataText}>No Movement Records</Text>
      </View>
    )
  ) : (
    <View style={styles.section}>
      <Text style={styles.noDataText}>No Movement Records</Text>
    </View>
  )
)}
    </View>
  );

  const renderHistoryInfo = () => (
    <View style={styles.tabContent}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      ) : (
        <>
          {/* Quot Section */}
          <View style={styles.section}>
  <Text style={styles.sectionTitle}>Quot</Text>

  {quoteData && quoteData.length > 0 ? (
    quoteData.filter(item => item.quot_id).length > 0 ? ( // 确保至少有一个 item.quot_id
      quoteData
        .filter(item => item.quot_id) // 过滤掉没有 quot_id 的数据
        .map((item, index) => (
          <TouchableOpacity
            key={`quot-${index}`}
            style={styles.historyItem}
            onPress={() => navigation.navigate('QuotDetail', { quotData: item })}
          >
            <View style={styles.chassisEntryHeader}>
              <View>
                <Text style={styles.chassisEntryTitle}>
                  {item.quot_id}
                </Text>
                <Text style={styles.chassisEntryDate}>
                  {item.ddate ? new Date(item.ddate).toLocaleDateString() : '-'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
        ))
    ) : (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No data</Text>
      </View>
    )
  ) : (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataText}>No data</Text>
    </View>
  )}
</View>


          {/* SO Section */}
          <View style={styles.section}>
  <Text style={styles.sectionTitle}>SO</Text>

  {dsoiData && dsoiData.length > 0 ? (
    dsoiData.filter(item => item.so_id).length > 0 ? ( // 确保至少有一个 item.so_id
      dsoiData
        .filter(item => item.so_id) // 过滤掉没有 so_id 的数据
        .map((item, index) => (
          <TouchableOpacity
            key={`dsoi-${index}`}
            style={styles.historyItem}
            onPress={() => navigation.navigate('SODetail', { soData: item })}
          >
            <View style={styles.chassisEntryHeader}>
              <View>
                <Text style={styles.chassisEntryTitle}>
                  {item.so_id}
                </Text>
                <Text style={styles.chassisEntryDate}>
                  {item.ddate ? new Date(item.ddate).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
        ))
    ) : (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No data</Text>
      </View>
    )
  ) : (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataText}>No data</Text>
    </View>
  )}
</View>

        </>
      )}
    </View>
  );

  const renderPictureInfo = () => (
    <View style={styles.tabContent}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Document Files</Text>
            {chassisfileData && chassisfileData.length > 0 ? (
              chassisfileData.map((item, index) => (
                <View key={`${item.id}-${index}`} style={styles.historyItem}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>File Name</Text>
                    <Text style={styles.infoValue}>{item.file_name || 'N/A'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>File Type</Text>
                    <Text style={styles.infoValue}>{item.file_type || 'N/A'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Upload Date</Text>
                    <Text style={styles.infoValue}>{item.upload_date ? new Date(item.upload_date).toLocaleDateString() : 'N/A'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Path</Text>
                    <Text style={styles.infoValue}>{item.file_path || 'N/A'}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No document files available</Text>
            )}
          </View>
        </>
      )}
    </View>
  );

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
        <Text style={styles.headerTitle}>
          {cmh.stock_id || 'Chassis Detail'}
        </Text>
      </LinearGradient>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TabButton
          icon="car-outline"
          label="Chassis"
          active={activeTab === 'main'}
          onPress={() => setActiveTab('main')}
        />
        <TabButton
          icon="reader-outline"
          label="History"
          active={activeTab === 'history'}
          onPress={() => setActiveTab('history')}
        />
        <TabButton
          icon="image-outline"
          label="Picture"
          active={activeTab === 'picture'}
          onPress={() => setActiveTab('picture')}
        />
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'main' && renderMainInfo()}
        {activeTab === 'history' && renderHistoryInfo()}
        {activeTab === 'picture' && renderPictureInfo()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: COLORS.primary,
  },
  tabLabel: {
    marginTop: SPACING.xs,
    fontSize: SIZES.small,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  tabContent: {
    paddingBottom: SPACING.md,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.light,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    width: width * 0.4,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  infoValue: {
    flex: 1,
    fontSize: SIZES.small,
    color: COLORS.text,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorLight,
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  errorText: {
    marginLeft: SPACING.sm,
    fontSize: SIZES.medium,
    color: COLORS.error,
    flex: 1,
  },
  historyItem: {
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray + '30',
  },
  historyDate: {
    fontSize: SIZES.small,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  noDataText: {
    fontSize: SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
  },
  chassisEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chassisEntryTitle: {
    fontSize: SIZES.small,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  chassisEntryDate: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 4,
  },
  noDataContainer: {
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CMHDetails; 