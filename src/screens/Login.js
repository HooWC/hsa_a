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
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

// 固定的用户凭据
const VALID_USERNAME = 'cmengjin';
const VALID_PASSWORD = 'hsonline';

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
  
  // 使用useRef保存动画值
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
  }, []);

  // 处理用户名变更
  const handleUsernameChange = (text) => {
    setUsername(text);
    // 只有在有错误时才清除错误
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: null }));
    }
  };

  // 处理密码变更
  const handlePasswordChange = (text) => {
    setPassword(text);
    // 只有在有错误时才清除错误
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: null }));
    }
  };

  // 表单验证
  const validate = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 登录处理
  const handleLogin = () => {
    if (!validate()) {
      return;
    }
    
    setIsLoading(true);
    
    // 延迟模拟API调用
    setTimeout(() => {
      setIsLoading(false);
      
      // 检查用户名和密码是否匹配
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        navigation.navigate('Home', { username });
      } else {
        Alert.alert(
          'Login Failed', 
          'Invalid username or password. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }, 1000);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        
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
            
            <View style={styles.optionsRow}>
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            
            <Button
              label="LOGIN"
              onPress={handleLogin}
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotPassword: {
    color: COLORS.primary,
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: SPACING.sm,
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
  },
});

export default Login; 