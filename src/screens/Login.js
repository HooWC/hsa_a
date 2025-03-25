import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Animated,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SPACING, SIZES, SHADOWS, RADIUS } from '../constants/theme';
import CONFIG from '../constants/config';

const { width, height } = Dimensions.get('window');

const LoginBackground = () => (
  <LinearGradient
    colors={['#1565C0', '#1976D2', '#42A5F5']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={StyleSheet.absoluteFill}
  />
);

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const route = useRoute();
  
  // 动画值
  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // 启动进入动画
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // 如果是从登出操作过来的，清除输入框内容
    if (route.params?.clearData) {
      setUsername('');
      setPassword('');
      setErrors({});
    }
  }, [route.params?.clearData]);

  // 处理用户名变更
  const handleUsernameChange = (text) => {
    setUsername(text);
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: null }));
    }
  };

  // 处理密码变更
  const handlePasswordChange = (text) => {
    setPassword(text);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: null }));
    }
  };

  // 表单验证
  const validate = (loginUsername, loginPassword) => {
    const newErrors = {};
    
    if (!loginUsername?.trim()) {
      newErrors.username = '请输入用户名';
    }
    
    if (!loginPassword?.trim()) {
      newErrors.password = '请输入密码';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 登录处理
  const handleLogin = async (loginUsername = username, loginPassword = password) => {
    if (!validate(loginUsername, loginPassword)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          username: loginUsername, 
          password: loginPassword 
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        // 保存 token 到 AsyncStorage
        await AsyncStorage.setItem('userToken', data.token);
        // 登录成功，直接进入主页
        navigation.navigate('Home', { 
          username: data.user.username,
          userId: data.user.id,
          token: data.token
        });
      } else {
        // 登录失败，显示错误信息
        Alert.alert('登录失败', data.message || '用户名或密码错误');
      }
    } catch (error) {
      Alert.alert(
        '连接错误', 
        '无法连接到服务器，请检查网络连接'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />
        
        <LoginBackground />
        
        {/* Logo区域 */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: logoAnim,
              transform: [
                { 
                  translateY: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0]
                  })
                },
                {
                  scale: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1]
                  })
                }
              ]
            }
          ]}
        >
          <View style={styles.logoWrapper}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.welcomeText}>WELCOME TO HONG SENG</Text>
          <Text style={styles.subtitleText}>Sign in to continue</Text>
        </Animated.View>

        {/* 表单区域 */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.formContainer}
        >
          <Animated.View 
            style={[
              styles.formCard,
              {
                opacity: formAnim,
                transform: [
                  { 
                    translateY: formAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0]
                    })
                  }
                ]
              }
            ]}
          >
            <Input
              label="Username"
              value={username}
              onChangeText={handleUsernameChange}
              placeholder="Enter your username"
              error={errors.username}
              autoCapitalize="none"
              iconLeft={<Ionicons name="person-outline" size={20} color={COLORS.primary} />}
            />
            
            <Input
              label="Password"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
              placeholder="Enter your password"
              error={errors.password}
              iconLeft={<Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} />}
            />
            
            <Button
              label="LOGIN"
              onPress={() => handleLogin()}
              isLoading={isLoading}
              style={styles.loginButton}
              rightIcon={<Ionicons name="arrow-forward" size={20} color={COLORS.white} />}
            />
            
            <View style={styles.footerTextContainer}>
              <Text style={styles.footerText}>© {new Date().getFullYear()} Hong Seng Group</Text>
              <Text style={styles.footerVersion}>v1.0.0</Text>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.08,
  },
  logoWrapper: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: width * 0.35 / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.dark,
    marginBottom: SPACING.md,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
  },
  welcomeText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginVertical: SPACING.xs,
    letterSpacing: 1,
  },
  subtitleText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: SIZES.medium,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.container,
    marginTop: SPACING.xxl,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.xl,
    ...SHADOWS.dark,
  },
  loginButton: {
    marginTop: SPACING.lg,
  },
  footerTextContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.darkGray,
    fontSize: SIZES.small,
    textAlign: 'center',
  },
  footerVersion: {
    color: COLORS.gray,
    fontSize: SIZES.small * 0.8,
    marginTop: 5,
  }
});

export default Login; 