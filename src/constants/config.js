import { Platform } from 'react-native';

// ==========================================
// API连接配置
// ==========================================

// 设置API基础URL - 使用Wi-Fi局域网IP地址
let API_BASE_URL = 'http://10.10.10.14:5000/';

// API 配置 
const CONFIG = {
  // API基础URL
  API_URL: API_BASE_URL,
  
  // API端点
  ENDPOINTS: {
    LOGIN: 'users/authenticate',  // 移除多余的斜杠，确保URL格式正确
    USERS: 'users',
  },
  
  // 测试凭据
  TEST_CREDENTIALS: {
    cmengjin: { username: 'cmengjin', password: 'hsonline' }, // 更新默认密码
    khwong: { username: 'khwong', password: 'password' },
    eunice: { username: 'eunice', password: 'password' },
    emx: { username: 'emx', password: 'password' },
    umax: { username: 'umax', password: 'password' },
    damon: { username: 'damon', password: 'password' },
    frances: { username: 'frances', password: 'password' },
    aryeoh: { username: 'aryeoh', password: 'password' }
  }
};

export default CONFIG;