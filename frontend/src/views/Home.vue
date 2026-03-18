<template>
  <el-container class="home-container">
    <!-- 移动端顶部导航 -->
    <div class="mobile-header">
      <div class="mobile-logo">⚕️ 533健康</div>
      <el-dropdown @command="handleCommand" trigger="click">
        <span class="mobile-menu-btn">☰</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item index="/home/dashboard">控制台</el-dropdown-item>
            <el-dropdown-item index="/home/health-record">健康档案</el-dropdown-item>
            <el-dropdown-item index="/home/assessment">健康评估</el-dropdown-item>
            <el-dropdown-item index="/home/intervention">干预计划</el-dropdown-item>
            <el-dropdown-item index="/home/device">设备管理</el-dropdown-item>
            <el-dropdown-item index="/home/report">健康报告</el-dropdown-item>
            <el-dropdown-item index="/home/notification">消息通知</el-dropdown-item>
            <el-dropdown-item index="/home/settings">设置</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 移动端底部导航 -->
    <div class="mobile-nav">
      <div 
        v-for="item in navItems" 
        :key="item.path"
        class="mobile-nav-item"
        :class="{ active: $route.path === item.path }"
        @click="$router.push(item.path)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-text">{{ item.name }}</span>
      </div>
    </div>

    <!-- 桌面端侧边栏 -->
    <el-aside width="220px" class="desktop-sidebar">
      <div class="logo">
        <span class="logo-icon">⚕️</span>
        <span class="logo-text">533健康</span>
      </div>
      <el-menu 
        :default-active="$route.path" 
        router 
        class="sidebar-menu"
        background-color="#1a1f2e"
        text-color="#8a97b0"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/home/dashboard">
          <span>📊 控制台</span>
        </el-menu-item>
        <el-menu-item index="/home/health-record">
          <span>📋 健康档案</span>
        </el-menu-item>
        <el-menu-item index="/home/assessment">
          <span>🔬 健康评估</span>
        </el-menu-item>
        <el-menu-item index="/home/intervention">
          <span>💊 干预计划</span>
        </el-menu-item>
        <el-menu-item index="/home/device">
          <span>⌚ 设备管理</span>
        </el-menu-item>
        <el-menu-item index="/home/report">
          <span>📄 健康报告</span>
        </el-menu-item>
        <el-menu-item index="/home/notification">
          <span>🔔 消息通知</span>
        </el-menu-item>
        <el-menu-item index="/home/settings">
          <span>⚙️ 设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header class="desktop-header">
        <div class="header-title">
          <h3>{{ pageTitle }}</h3>
        </div>
        <div class="header-right">
          <span class="username">{{ username }}</span>
          <el-button type="danger" size="small" @click="handleLogout">退出</el-button>
        </div>
      </el-header>
      
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const username = ref('')

const navItems = [
  { name: '控制台', path: '/home/dashboard', icon: '📊' },
  { name: '档案', path: '/home/health-record', icon: '📋' },
  { name: '评估', path: '/home/assessment', icon: '🔬' },
  { name: '干预', path: '/home/intervention', icon: '💊' },
  { name: '更多', path: '/home/report', icon: '📄' }
]

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/home/dashboard': '健康数据概览',
    '/home/health-record': '健康档案',
    '/home/assessment': '健康评估',
    '/home/intervention': '干预计划',
    '/home/device': '设备管理',
    '/home/report': '健康报告',
    '/home/notification': '消息通知',
    '/home/settings': '设置'
  }
  return titles[route.path] || '533健康管理'
})

onMounted(() => {
  username.value = localStorage.getItem('username') || '用户'
})

const handleCommand = (command: string) => {
  if (command === 'logout') {
    handleLogout()
  } else if (command) {
    router.push(command)
  }
}

const handleLogout = () => {
  localStorage.clear()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
/* 移动端顶部导航 */
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: #1a1f2e;
  color: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  z-index: 1000;
}

.mobile-logo {
  font-size: 18px;
  font-weight: bold;
}

.mobile-menu-btn {
  font-size: 24px;
  cursor: pointer;
}

/* 移动端底部导航 */
.mobile-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
}

.mobile-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #909399;
  cursor: pointer;
}

.mobile-nav-item.active {
  color: #409EFF;
}

.nav-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

/* 桌面端侧边栏 */
.desktop-sidebar {
  background-color: #1a1f2e;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.desktop-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.home-container {
  height: 100vh;
  background-color: #f0f2f5;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #409EFF, #67C23A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sidebar-menu {
  border-right: none;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  margin: 4px 12px;
  border-radius: 8px;
  font-size: 14px;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background-color: rgba(64, 158, 255, 0.15) !important;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.2), rgba(103, 194, 58, 0.1)) !important;
}

.header-title h3 {
  margin: 0;
  color: #303133;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.username {
  color: #606266;
  font-weight: 500;
}

.main-content {
  padding: 20px;
  background-color: #f0f2f5;
}

/* 页面切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .mobile-header {
    display: flex;
  }
  
  .mobile-nav {
    display: flex;
  }
  
  .desktop-sidebar,
  .desktop-header {
    display: none;
  }
  
  .main-content {
    margin-top: 50px;
    margin-bottom: 56px;
    padding: 12px;
  }
}
</style>
