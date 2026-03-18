<template>
  <div class="settings-container">
    <div class="settings-header">
      <h2>⚙️ 个人设置</h2>
      <p class="subtitle">管理您的账户和个人偏好</p>
    </div>

    <!-- 用户信息 -->
    <el-card class="settings-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>👤 个人信息</span>
          <el-button size="small" type="primary" @click="editProfile">
            {{ editing ? '保存' : '编辑' }}
          </el-button>
        </div>
      </template>
      
      <div class="profile-section">
        <div class="avatar-section">
          <el-avatar :size="80" :src="userInfo.avatar">
            {{ userInfo.realName?.charAt(0) }}
          </el-avatar>
          <el-button size="small" @click="changeAvatar">更换头像</el-button>
        </div>
        
        <el-form :model="userInfo" label-width="100px" class="profile-form">
          <el-form-item label="用户名">
            <el-input v-model="userInfo.username" :disabled="!editing" />
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="userInfo.realName" :disabled="!editing" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="userInfo.phone" :disabled="!editing" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.email" :disabled="!editing" />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="userInfo.gender" :disabled="!editing">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input-number v-model="userInfo.age" :disabled="!editing" :min="1" :max="150" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 健康目标设置 -->
    <el-card class="settings-card" shadow="hover">
      <template #header>
        <span>🎯 健康目标设置</span>
      </template>
      
      <div class="goals-section">
        <div v-for="goal in healthGoals" :key="goal.id" class="goal-item">
          <div class="goal-icon">{{ goal.icon }}</div>
          <div class="goal-info">
            <span class="goal-name">{{ goal.name }}</span>
            <span class="goal-target">目标: {{ goal.target }}</span>
            <el-slider 
              v-model="goal.current" 
              :min="0" 
              :max="goal.max" 
              :show-tooltip="true"
              :format-tooltip="(val: number) => `${val}${goal.unit}`"
              @change="updateGoal(goal)"
            />
          </div>
          <div class="goal-progress">
            <el-progress 
              type="circle" 
              :percentage="Math.round((goal.current / goal.max) * 100)" 
              :width="60"
            />
          </div>
        </div>
      </div>
    </el-card>

    <!-- 安全设置 -->
    <el-card class="settings-card" shadow="hover">
      <template #header>
        <span>🔐 安全设置</span>
      </template>
      
      <div class="security-section">
        <div class="security-item">
          <div class="security-info">
            <span class="security-title">修改密码</span>
            <span class="security-desc">定期修改密码可以保护账户安全</span>
          </div>
          <el-button type="primary" plain @click="showPasswordDialog = true">
            修改密码
          </el-button>
        </div>
        
        <el-divider />
        
        <div class="security-item">
          <div class="security-info">
            <span class="security-title">两步验证</span>
            <span class="security-desc">为账户添加额外的安全保护</span>
          </div>
          <el-switch v-model="securitySettings.twoFactor" />
        </div>
        
        <el-divider />
        
        <div class="security-item">
          <div class="security-info">
            <span class="security-title">登录通知</span>
            <span class="security-desc">新设备登录时发送通知</span>
          </div>
          <el-switch v-model="securitySettings.loginNotify" />
        </div>
      </div>
    </el-card>

    <!-- 通知偏好 -->
    <el-card class="settings-card" shadow="hover">
      <template #header>
        <span>🔔 通知偏好</span>
      </template>
      
      <div class="notification-section">
        <div class="notification-item">
          <div class="notification-info">
            <span class="notification-title">健康提醒</span>
            <span class="notification-desc">接收健康数据异常提醒</span>
          </div>
          <el-switch v-model="notificationSettings.healthReminder" />
        </div>
        
        <el-divider />
        
        <div class="notification-item">
          <div class="notification-info">
            <span class="notification-title">用药提醒</span>
            <span class="notification-desc">定时提醒服药</span>
          </div>
          <el-switch v-model="notificationSettings.drugReminder" />
        </div>
        
        <el-divider />
        
        <div class="notification-item">
          <div class="notification-info">
            <span class="notification-title">运动提醒</span>
            <span class="notification-desc">运动目标达成提醒</span>
          </div>
          <el-switch v-model="notificationSettings.exerciseReminder" />
        </div>
        
        <el-divider />
        
        <div class="notification-item">
          <div class="notification-info">
            <span class="notification-title">系统通知</span>
            <span class="notification-desc">接收系统更新和维护通知</span>
          </div>
          <el-switch v-model="notificationSettings.systemNotify" />
        </div>
        
        <el-divider />
        
        <div class="notification-item">
          <div class="notification-info">
            <span class="notification-title">邮件通知</span>
            <span class="notification-desc">通过邮件接收重要通知</span>
          </div>
          <el-switch v-model="notificationSettings.emailNotify" />
        </div>
      </div>
    </el-card>

    <!-- 隐私设置 -->
    <el-card class="settings-card" shadow="hover">
      <template #header>
        <span>🔒 隐私设置</span>
      </template>
      
      <div class="privacy-section">
        <div class="privacy-item">
          <div class="privacy-info">
            <span class="privacy-title">健康数据可见性</span>
            <span class="privacy-desc">控制谁可以看到您的健康数据</span>
          </div>
          <el-select v-model="privacySettings.dataVisibility" style="width: 120px">
            <el-option label="仅自己" value="self" />
            <el-option label="医生可见" value="doctor" />
            <el-option label="家人可见" value="family" />
          </el-select>
        </div>
        
        <el-divider />
        
        <div class="privacy-item">
          <div class="privacy-info">
            <span class="privacy-title">数据共享</span>
            <span class="privacy-desc">允许与医疗机构共享健康数据</span>
          </div>
          <el-switch v-model="privacySettings.dataShare" />
        </div>
        
        <el-divider />
        
        <div class="privacy-item">
          <div class="privacy-info">
            <span class="privacy-title">匿名数据贡献</span>
            <span class="privacy-desc">贡献匿名健康数据用于研究</span>
          </div>
          <el-switch v-model="privacySettings.anonymousContribute" />
        </div>
      </div>
    </el-card>

    <!-- 其他设置 -->
    <el-card class="settings-card" shadow="hover">
      <template #header>
        <span>⚡ 其他设置</span>
      </template>
      
      <div class="other-section">
        <div class="other-item">
          <div class="other-info">
            <span class="other-title">语言</span>
            <span class="other-desc">选择界面显示语言</span>
          </div>
          <el-select v-model="otherSettings.language" style="width: 120px">
            <el-option label="简体中文" value="zh-CN" />
            <el-option label="English" value="en" />
          </el-select>
        </div>
        
        <el-divider />
        
        <div class="other-item">
          <div class="other-info">
            <span class="other-title">深色模式</span>
            <span class="other-desc">切换深色/浅色主题</span>
          </div>
          <el-switch v-model="otherSettings.darkMode" />
        </div>
        
        <el-divider />
        
        <div class="other-item">
          <div class="other-info">
            <span class="other-title">数据自动同步</span>
            <span class="other-desc">自动同步设备健康数据</span>
          </div>
          <el-switch v-model="otherSettings.autoSync" />
        </div>
        
        <el-divider />
        
        <div class="other-item">
          <div class="other-info">
            <span class="other-title">缓存管理</span>
            <span class="other-desc">清除本地缓存数据</span>
          </div>
          <el-button size="small" @click="clearCache">清除缓存</el-button>
        </div>
      </div>
    </el-card>

    <!-- 账户操作 -->
    <el-card class="settings-card danger-card" shadow="hover">
      <template #header>
        <span>⚠️ 账户操作</span>
      </template>
      
      <div class="danger-section">
        <div class="danger-item">
          <div class="danger-info">
            <span class="danger-title">导出健康数据</span>
            <span class="danger-desc">下载您的所有健康数据</span>
          </div>
          <el-button type="primary" plain @click="exportData">
            导出数据
          </el-button>
        </div>
        
        <el-divider />
        
        <div class="danger-item">
          <div class="danger-info">
            <span class="danger-title">注销账户</span>
            <span class="danger-desc">永久删除账户及所有数据</span>
          </div>
          <el-button type="danger" @click="deleteAccount">
            注销账户
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="400px">
      <el-form :model="passwordForm" label-width="80px">
        <el-form-item label="原密码">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="changePassword">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const editing = ref(false)
const showPasswordDialog = ref(false)

const userInfo = reactive({
  username: 'admin',
  realName: '管理员',
  phone: '13800138000',
  email: 'admin@example.com',
  gender: 'male',
  age: 45,
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
})

const healthGoals = ref([
  { id: 1, name: '每日步数', target: '10000步', current: 8500, max: 10000, unit: '步', icon: '👟' },
  { id: 2, name: '睡眠时长', target: '8小时', current: 7.2, max: 8, unit: '小时', icon: '😴' },
  { id: 3, name: '运动时间', target: '150分钟/周', current: 120, max: 150, unit: '分钟', icon: '🏃' },
  { id: 4, name: '喝水数量', target: '8杯/天', current: 6, max: 8, unit: '杯', icon: '💧' }
])

const securitySettings = reactive({
  twoFactor: false,
  loginNotify: true
})

const notificationSettings = reactive({
  healthReminder: true,
  drugReminder: true,
  exerciseReminder: true,
  systemNotify: true,
  emailNotify: false
})

const privacySettings = reactive({
  dataVisibility: 'self',
  dataShare: false,
  anonymousContribute: true
})

const otherSettings = reactive({
  language: 'zh-CN',
  darkMode: false,
  autoSync: true
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const editProfile = () => {
  if (editing.value) {
    // 保存
    ElMessage.success('个人信息已保存')
  }
  editing.value = !editing.value
}

const changeAvatar = () => {
  ElMessage.info('头像上传功能开发中')
}

const updateGoal = (goal: any) => {
  ElMessage.success(`${goal.name}目标已更新`)
}

const changePassword = () => {
  if (!passwordForm.oldPassword || !passwordForm.newPassword) {
    ElMessage.warning('请填写完整密码信息')
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }
  ElMessage.success('密码修改成功')
  showPasswordDialog.value = false
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

const clearCache = () => {
  ElMessageBox.confirm('确定清除本地缓存吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('缓存已清除')
  }).catch(() => {})
}

const exportData = () => {
  ElMessage.info('数据导出功能开发中')
}

const deleteAccount = () => {
  ElMessageBox.confirm('此操作将永久删除您的账户和所有数据，是否继续？', '警告', {
    confirmButtonText: '确定注销',
    cancelButtonText: '取消',
    type: 'error'
  }).then(() => {
    ElMessage.success('账户已注销')
  }).catch(() => {})
}
</script>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.settings-header {
  text-align: center;
  margin-bottom: 24px;
}

.settings-header h2 {
  color: #409eff;
  margin-bottom: 8px;
}

.subtitle {
  color: #909399;
  font-size: 14px;
  margin: 0;
}

.settings-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-section {
  display: flex;
  gap: 24px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.profile-form {
  flex: 1;
}

.goals-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.goal-icon {
  font-size: 28px;
}

.goal-info {
  flex: 1;
}

.goal-name {
  display: block;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.goal-target {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.security-section, .notification-section, .privacy-section, .other-section, .danger-section {
  padding: 0 8px;
}

.security-item, .notification-item, .privacy-item, .other-item, .danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.security-info, .notification-info, .privacy-info, .other-info, .danger-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.security-title, .notification-title, .privacy-title, .other-title, .danger-title {
  font-weight: 500;
  color: #303133;
}

.security-desc, .notification-desc, .privacy-desc, .other-desc, .danger-desc {
  font-size: 12px;
  color: #909399;
}

.danger-card {
  border: 1px solid #f56c6c;
}

/* 响应式 */
@media (max-width: 768px) {
  .settings-container {
    padding: 12px;
  }
  
  .profile-section {
    flex-direction: column;
    align-items: center;
  }
  
  .profile-form {
    width: 100%;
  }
  
  .goal-item {
    flex-wrap: wrap;
  }
  
  .goal-progress {
    margin-left: auto;
  }
  
  .security-item, .notification-item, .privacy-item, .other-item, .danger-item {
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>
