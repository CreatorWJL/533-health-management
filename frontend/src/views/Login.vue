<template>
  <div class="login-container">
    <div class="login-bg">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>
    </div>
    <div class="login-content">
      <transition name="login-fade" appear>
        <el-card class="login-card">
          <template #header>
            <div class="header">
              <div class="logo-wrapper">
                <span class="logo-icon">⚕️</span>
              </div>
              <div class="title-area">
                <h2>533健康管理平台</h2>
                <p>科学管理 · 主动健康</p>
              </div>
              <el-tag v-if="isDemoMode" type="warning" effect="dark" size="small" class="demo-tag">
                演示模式
              </el-tag>
            </div>
          </template>
          <el-form 
            :model="form" 
            :rules="rules" 
            ref="formRef" 
            label-position="top"
            class="login-form"
          >
            <el-form-item label="用户名" prop="username">
              <el-input 
                v-model="form.username" 
                placeholder="请输入用户名"
                :prefix-icon="User"
                size="large"
              />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input 
                v-model="form.password" 
                type="password" 
                placeholder="请输入密码"
                :prefix-icon="Lock"
                size="large"
                show-password
                @keyup.enter="handleLogin"
              />
            </el-form-item>
            <el-form-item>
              <el-button 
                type="primary" 
                @click="handleLogin" 
                :loading="loading" 
                size="large"
                class="login-btn"
              >
                登录
              </el-button>
            </el-form-item>
            <div class="register-link">
              <span>还没有账号？</span>
              <el-link type="primary" @click="$router.push('/register')">
                立即注册
              </el-link>
            </div>
            <el-divider>
              <span class="divider-text">或</span>
            </el-divider>
            <el-button 
              @click="handleDemoLogin" 
              :loading="loading" 
              size="large"
              class="demo-btn"
            >
              <el-icon><Promotion /></el-icon>
              进入演示模式 (admin/123456)
            </el-button>
          </el-form>
        </el-card>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Promotion } from '@element-plus/icons-vue'
import { userApi } from '@/api/user'
import { getDemoMode } from '@/api/request'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const isDemoMode = computed(() => getDemoMode())

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  await formRef.value.validate()
  loading.value = true
  try {
    const res = await userApi.login(form)
    localStorage.setItem('token', res.data.token || 'mock-token')
    localStorage.setItem('userId', String(res.data.id))
    ElMessage.success('登录成功')
    router.push('/home')
  } catch (e: any) {
    if (form.username === 'admin' && form.password === '123456') {
      handleDemoLogin()
    } else {
      ElMessage.error(e.message || '登录失败，请检查账号密码')
    }
  } finally {
    loading.value = false
  }
}

const handleDemoLogin = () => {
  loading.value = true
  setTimeout(() => {
    localStorage.setItem('token', 'demo-token-12345')
    localStorage.setItem('userId', '1')
    localStorage.setItem('username', 'admin')
    localStorage.setItem('isDemoMode', 'true')
    ElMessage.success('演示模式登录成功')
    loading.value = false
    router.push('/home')
  }, 500)
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1f2e 0%, #2d3748 50%, #1a202c 100%);
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.shape-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #409EFF, #67C23A);
  top: -150px;
  right: -100px;
  animation: float 8s ease-in-out infinite;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #E6A23C, #F56C6C);
  bottom: -100px;
  left: -100px;
  animation: float 10s ease-in-out infinite reverse;
}

.shape-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #909399, #409EFF);
  top: 50%;
  left: 30%;
  animation: float 12s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -30px); }
}

.login-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  padding: 20px;
}

.login-card {
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
}

.logo-wrapper {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #409EFF, #67C23A);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.3);
}

.logo-icon {
  font-size: 36px;
}

.title-area {
  text-align: center;
}

.title-area h2 {
  margin: 0;
  color: #1a1f2e;
  font-size: 24px;
  font-weight: 700;
}

.title-area p {
  margin: 6px 0 0;
  color: #909399;
  font-size: 14px;
}

.demo-tag {
  margin-top: 12px;
}

.login-form {
  margin-top: 20px;
}

.login-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #409EFF, #67C23A);
  border: none;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.4);
}

.register-link {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  color: #909399;
}

.divider-text {
  color: #c0c4cc;
  font-size: 12px;
}

.demo-btn {
  width: 100%;
  height: 44px;
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.demo-btn:hover {
  border-color: #67C23A;
  color: #67C23A;
  background: rgba(103, 194, 58, 0.1);
}

/* 登录动画 */
.login-fade-enter-active {
  animation: loginIn 0.6s ease-out;
}

@keyframes loginIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
