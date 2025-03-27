import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  SafeAreaView,
  Image,
  Alert,
  Dimensions,
  ScrollView,
  Animated,
  FlatList
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// 卡片项组件 - 带渐变背景的时尚卡片
const DashboardCard = ({ title, icon, description, onPress, colors, delay = 0 }) => {
  const animValue = new Animated.Value(0);
  
  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 500,
      delay: delay,
      useNativeDriver: true,
    }).start();
  }, []);
  
  return (
    <Animated.View 
      style={[
        styles.cardContainer,
        {
          opacity: animValue,
          transform: [
            { 
              translateY: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            }
          ]
        }
      ]}
    >
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.cardTouchable}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardIconContainer}>
            {icon}
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{title}</Text>
            {description && (
              <Text style={styles.cardDescription}>{description}</Text>
            )}
          </View>
          <View style={styles.cardArrow}>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 通知卡片组件
const NotificationCard = ({ message, time, isNew }) => (
  <View style={styles.notificationCard}>
    {isNew && <View style={styles.notificationDot} />}
    <View style={styles.notificationContent}>
      <Text style={styles.notificationText}>{message}</Text>
      <Text style={styles.notificationTime}>{time}</Text>
    </View>
  </View>
);

const Home = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { username, userId, token } = route.params || { username: 'User', userId: null, token: null };
  const [isLoading, setIsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // 示例通知
  const notifications = [
    { id: '1', message: 'New weight certificate available', time: '2 hours ago', isNew: true },
    { id: '2', message: 'System maintenance scheduled', time: 'Yesterday', isNew: false },
  ];
  
  const headerAnim = new Animated.Value(0);
  
  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Redirect to login if no token is available
    if (!token) {
      navigation.replace('Login');
    }
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      '确认登出',
      '确定要退出登录吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async () => {
            // 清除 token
            await AsyncStorage.removeItem('userToken');
            // 重置导航到登录页面
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login', params: { clearData: true } }],
            });
          },
        },
      ]
    );
  };

  const handleWeightCert = () => {
    navigation.navigate('WeightCertListing');
  };

  const handlePlan = () => {
    navigation.navigate('PlanListing');
  };
  
  const handleCMH = () => {
    navigation.navigate('CMHListing');
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />
      
      {/* 渐变标题栏 */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerAnim,
            transform: [
              { 
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0]
                })
              }
            ]
          }
        ]}
      >
        <LinearGradient
          colors={['#1565C0', '#1976D2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={toggleNotifications}
            >
              <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
              {notifications.some(n => n.isNew) && <View style={styles.notificationBadge} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
      
      {/* 欢迎栏 */}
      <View style={styles.welcomeBar}>
        <Text style={styles.welcomeText}>Welcome, {username}</Text>
        <Text style={styles.dateText}>{new Date().toDateString()}</Text>
      </View>
      
      {/* 通知面板 - 可折叠 */}
      {showNotifications && (
        <View style={styles.notificationsPanel}>
          <View style={styles.notificationsHeader}>
            <Text style={styles.notificationsTitle}>Notifications</Text>
            <TouchableOpacity onPress={toggleNotifications}>
              <Ionicons name="close" size={20} color={COLORS.darkGray} />
            </TouchableOpacity>
          </View>
          
          {notifications.length > 0 ? (
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <NotificationCard
                  message={item.message}
                  time={item.time}
                  isNew={item.isNew}
                />
              )}
            />
          ) : (
            <Text style={styles.noNotificationsText}>No new notifications</Text>
          )}
        </View>
      )}
      
      {/* 主内容区 */}
      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dashboard</Text>
        </View>
        
        <View style={styles.cardsContainer}>
          <DashboardCard
            title="Weight Certificates"
            description="Manage weight certificates"
            icon={<Ionicons name="document-text-outline" size={32} color="#fff" />}
            onPress={handleWeightCert}
            colors={['#FF6B6B', '#FF8E8E']}
            delay={300}
          />

          <DashboardCard
            title="Plans"
            description="View and manage plans"
            icon={<Ionicons name="clipboard-outline" size={32} color="#fff" />}
            onPress={handlePlan}
            colors={['#455A64', '#263238']}
            delay={450}
          />

          <DashboardCard
            title="Chassis Movement"
            description="Track chassis movement history"
            icon={<Ionicons name="car-outline" size={32} color="#fff" />}
            onPress={handleCMH}
            colors={['#4A6FDC', '#77A2F9']}
            delay={600}
          />  
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        
        <View style={styles.quickActions}>
          <Button
            label="View Recent"
            variant="outline"
            onPress={() => Alert.alert('Recent', 'Coming soon')}
            leftIcon={<Ionicons name="time-outline" size={20} color={COLORS.primary} />}
            style={styles.quickActionButton}
          />
          
          <Button
            label="Create New"
            variant="secondary"
            onPress={() => Alert.alert('Create', 'Coming soon')}
            leftIcon={<Ionicons name="add-circle-outline" size={20} color={COLORS.white} />}
            style={styles.quickActionButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerContainer: {
    width: '100%',
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    height: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 150,
    height: 100,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.md,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  welcomeBar: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    ...SHADOWS.light,
  },
  welcomeText: {
    color: COLORS.darkGray,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  dateText: {
    color: COLORS.gray,
    fontSize: SIZES.small,
    marginTop: 4,
  },
  notificationsPanel: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.medium,
    maxHeight: 250,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  notificationsTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    position: 'relative',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    left: 0,
    top: SPACING.sm + 6,
  },
  notificationContent: {
    flex: 1,
    paddingLeft: SPACING.md,
  },
  notificationText: {
    fontSize: SIZES.small,
    color: COLORS.darkGray,
  },
  notificationTime: {
    fontSize: SIZES.small * 0.9,
    color: COLORS.gray,
    marginTop: 2,
  },
  noNotificationsText: {
    textAlign: 'center',
    padding: SPACING.md,
    color: COLORS.gray,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
  },
  sectionHeader: {
    marginVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  cardsContainer: {
    marginBottom: SPACING.xl,
  },
  cardContainer: {
    marginBottom: SPACING.md,
    borderRadius: RADIUS.md,
    ...SHADOWS.medium,
  },
  cardTouchable: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  cardGradient: {
    flexDirection: 'row',
    padding: SPACING.lg,
    alignItems: 'center',
  },
  cardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: SIZES.small,
    marginTop: 2,
  },
  cardArrow: {
    padding: SPACING.xs,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
});

export default Home; 