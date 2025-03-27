import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SIZES, SHADOWS, RADIUS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const SODetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { soData } = route.params;

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
          {soData.so_id || 'SO Detail'}
        </Text>
      </LinearGradient>

      {/* Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sales Order Detail</Text>
      
          {Object.entries(soData)
            .filter(([key]) => key !== "timemark" && key !== "identitymark") // 过滤掉timemark和identitymark
            .map(([key, value]) => (
              <View key={key} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{formatLabel(key)}</Text>
                <Text style={styles.infoValue}>{formatValue(key, value)}</Text>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

// 格式化标签名称，使其更易读
const formatLabel = (key) => {
  return key
    .replace(/_/g, ' ') // 替换下划线
    .replace(/\b\w/g, (char) => char.toUpperCase()); // 首字母大写
};

// 格式化值，特别处理日期和可能的特殊值
const formatValue = (key, value) => {
  if (value === null || value === undefined) return '-';

  // 处理布尔值
  if (typeof value === 'boolean') {
    return value ? '是' : '否';
  }
  
  // 处理Buffer数据
  if (value && typeof value === 'object' && value.type === 'Buffer') {
    return '[Buffer数据]';
  }

  // 检查是否为 ISO 8601 日期格式 (YYYY-MM-DDTHH:mm:ss.sssZ)
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
    const date = new Date(value);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  // 处理字段名包含 "date" 或 "dt" 的情况
  if ((key.toLowerCase().includes("date") || key.toLowerCase().includes("dt")) && value) {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      }
    } catch (e) {}
  }

  return value.toString();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
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
});

export default SODetail; 