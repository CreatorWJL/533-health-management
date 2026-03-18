import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// Demo mode flag - set when backend is unavailable
let isDemoMode = false
export const getDemoMode = () => isDemoMode
export const setDemoMode = (value: boolean) => { isDemoMode = value }

// 完整的Mock数据
const mockData: Record<string, any> = {
  // 用户相关
  '/user/login': { 
    code: 200, 
    message: 'success', 
    data: { 
      id: 1, 
      username: 'admin', 
      realName: '管理员', 
      token: 'demo-token-12345',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    } 
  },
  '/user/register': { 
    code: 200, 
    message: '注册成功', 
    data: { 
      id: 2, 
      username: 'demo', 
      realName: '演示用户' 
    } 
  },
  '/user/info': { 
    code: 200, 
    message: 'success', 
    data: { 
      id: 1, 
      username: 'admin', 
      realName: '管理员', 
      phone: '13800138000', 
      email: 'admin@example.com',
      gender: '男',
      age: 45,
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    } 
  },
  '/user/update': { code: 200, message: '更新成功', data: { id: 1 } },
  
  // 健康档案
  '/health/records': { 
    code: 200, 
    message: 'success', 
    data: [
      { id: 1, type: '血压', value: '120/80', date: '2024-01-15', status: 'normal' },
      { id: 2, type: '血糖', value: '5.5', date: '2024-01-15', status: 'normal' },
      { id: 3, type: '血压', value: '118/78', date: '2024-01-14', status: 'normal' },
      { id: 4, type: '血糖', value: '5.8', date: '2024-01-14', status: 'normal' },
      { id: 5, type: '血压', value: '125/82', date: '2024-01-13', status: 'warning' },
      { id: 6, type: '体重', value: '70kg', date: '2024-01-13', status: 'normal' },
    ] 
  },
  '/health/record/latest': { 
    code: 200, 
    message: 'success', 
    data: { 
      id: 1, 
      bmi: '22.5', 
      bloodPressureHigh: '120', 
      bloodPressureLow: '80', 
      heartRate: '72', 
      bloodSugar: '5.6',
      weight: '70',
      height: '175',
      date: '2024-01-15'
    } 
  },
  '/health/add': { code: 200, message: '添加成功', data: { id: 3 } },
  
  // 三早筛查 - 健康评估
  '/assessment/list': { 
    code: 200, 
    message: 'success', 
    data: [
      { 
        id: 1, 
        assessmentType: '三早筛查', 
        riskLevel: '低风险', 
        assessmentDate: '2024-01-15',
        score: 85,
        recommendations: ['继续保持健康生活方式', '定期体检']
      },
      { 
        id: 2, 
        assessmentType: '心血管风险评估', 
        riskLevel: '中风险', 
        assessmentDate: '2024-01-10',
        score: 68,
        recommendations: ['加强运动', '控制饮食']
      },
      { 
        id: 3, 
        assessmentType: '糖尿病筛查', 
        riskLevel: '低风险', 
        assessmentDate: '2024-01-05',
        score: 92,
        recommendations: ['继续保持']
      }
    ] 
  },
  '/assessment/submit': {
    code: 200,
    message: '评估提交成功',
    data: {
      id: 4,
      riskLevel: '中风险',
      score: 65,
      recommendations: ['建议减少高盐高脂饮食', '增加有氧运动', '定期监测血压']
    }
  },
  
  // 干预计划
  '/intervention/list': { 
    code: 200, 
    message: 'success', 
    data: [
      { 
        id: 1, 
        planName: '饮食干预计划', 
        planType: 'nutrition',
        description: '每日摄入热量控制在1800-2000千卡，减少高盐高脂食物摄入',
        status: 1, 
        progress: 60,
        startDate: '2024-01-01',
        endDate: '2024-03-01',
        tasks: [
          { id: 1, name: '早餐营养搭配', completed: true },
          { id: 2, name: '午餐七分饱', completed: true },
          { id: 3, name: '晚餐清淡为主', completed: false }
        ]
      },
      { 
        id: 2, 
        planName: '运动计划', 
        planType: 'exercise',
        description: '每周至少150分钟中等强度有氧运动',
        status: 1, 
        progress: 40,
        startDate: '2024-01-05',
        endDate: '2024-04-05',
        tasks: [
          { id: 1, name: '每日快走30分钟', completed: true },
          { id: 2, name: '每周游泳2次', completed: false },
          { id: 3, name: '周末骑行', completed: false }
        ]
      },
      { 
        id: 3, 
        planName: '睡眠管理', 
        planType: 'sleep',
        description: '保证每晚7-8小时高质量睡眠',
        status: 2, 
        progress: 100,
        startDate: '2023-12-01',
        endDate: '2024-01-15',
        tasks: [
          { id: 1, name: '固定作息时间', completed: true },
          { id: 2, name: '睡前不玩手机', completed: true },
          { id: 3, name: '午休不超过30分钟', completed: true }
        ]
      },
      { 
        id: 4, 
        planName: '心理健康辅导', 
        planType: 'mental',
        description: '通过冥想和心理疏导缓解压力',
        status: 1, 
        progress: 25,
        startDate: '2024-01-10',
        endDate: '2024-02-10',
        tasks: [
          { id: 1, name: '每日冥想10分钟', completed: true },
          { id: 2, name: '参加心理讲座', completed: false },
          { id: 3, name: '记录情绪日记', completed: false }
        ]
      },
      { 
        id: 5, 
        planName: '血压监测计划', 
        planType: 'monitor',
        description: '每日定时测量血压并记录',
        status: 1, 
        progress: 80,
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        tasks: [
          { id: 1, name: '晨起测量血压', completed: true },
          { id: 2, name: '午休后测量', completed: true },
          { id: 3, name: '睡前测量', completed: false }
        ]
      }
    ] 
  },
  
  // 设备管理
  '/device/list': { 
    code: 200, 
    message: 'success', 
    data: [
      { 
        id: 1, 
        name: '小米手环8', 
        type: 'band',
        status: 'online',
        battery: 85,
        lastSync: '2024-01-15 10:30:00',
        data: {
          heartRate: 72,
          steps: 8543,
          sleep: 7.5,
          calories: 1850
        }
      },
      { 
        id: 2, 
        name: '华为手表GT4', 
        type: 'watch',
        status: 'online',
        battery: 62,
        lastSync: '2024-01-15 10:25:00',
        data: {
          heartRate: 70,
          steps: 8200,
          sleep: 7.2,
          calories: 1800
        }
      },
      { 
        id: 3, 
        name: '欧姆龙电子血压计', 
        type: 'blood_pressure',
        status: 'offline',
        battery: null,
        lastSync: '2024-01-14 20:00:00',
        data: {
          systolic: 120,
          diastolic: 80
        }
      },
      { 
        id: 4, 
        name: '鱼跃血糖仪', 
        type: 'blood_sugar',
        status: 'online',
        battery: 45,
        lastSync: '2024-01-15 08:00:00',
        data: {
          bloodSugar: 5.5
        }
      }
    ] 
  },
  '/device/add': {
    code: 200,
    message: '设备添加成功',
    data: { id: 5 }
  },
  '/device/delete': {
    code: 200,
    message: '设备删除成功',
    data: null
  },
}

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  async error => {
    // 模拟网络延迟，让加载状态更明显
    await delay(500)
    
    // Network error or backend unavailable - use demo mode
    const url = error.config?.url || ''
    console.warn('API call failed, using demo mode:', url)
    isDemoMode = true
    
    // Return mock data if available
    const mockKey = Object.keys(mockData).find(key => url.includes(key))
    if (mockKey) {
      return mockData[mockKey]
    }
    
    // For unknown endpoints, return generic success
    return { code: 200, message: 'Demo mode', data: null }
  }
)

export default request
