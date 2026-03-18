<template>
  <div class="notification-container">
    <div class="notification-header">
      <h2>🔔 消息通知</h2>
      <p class="subtitle">系统消息、健康提醒一手掌握</p>
    </div>

    <!-- 消息分类和操作 -->
    <el-card class="filter-card" shadow="hover">
      <div class="filter-bar">
        <el-radio-group v-model="activeTab" size="default">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="health">健康提醒</el-radio-button>
          <el-radio-button label="system">系统通知</el-radio-button>
          <el-radio-button label="drug">用药提醒</el-radio-button>
        </el-radio-group>
        
        <div class="filter-actions">
          <el-button size="small" @click="markAllRead">
            <el-icon><Check /></el-icon>
            全部已读
          </el-button>
          <el-button size="small" type="danger" @click="clearAll" plain>
            <el-icon><Delete /></el-icon>
            清空
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 消息列表 -->
    <div class="notification-list">
      <el-card 
        v-for="notification in filteredNotifications" 
        :key="notification.id"
        class="notification-item"
        :class="{ unread: !notification.read }"
        shadow="hover"
        @click="handleNotificationClick(notification)"
      >
        <div class="notification-content">
          <div class="notification-icon" :class="notification.type">
            <el-icon v-if="notification.type === 'health'"><FirstAidKit /></el-icon>
            <el-icon v-else-if="notification.type === 'system'"><Bell /></el-icon>
            <el-icon v-else-if="notification.type === 'drug'"><FirstAidKit /></el-icon>
            <el-icon v-else><Warning /></el-icon>
          </div>
          
          <div class="notification-body">
            <div class="notification-title">
              {{ notification.title }}
              <el-badge v-if="!notification.read" is-dot class="unread-badge" />
            </div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-meta">
              <span class="notification-time">{{ notification.time }}</span>
              <el-tag v-if="notification.priority === 'high'" type="danger" size="small">紧急</el-tag>
              <el-tag v-if="notification.priority === 'normal'" type="warning" size="small">重要</el-tag>
            </div>
          </div>
          
          <div class="notification-actions">
            <el-button 
              v-if="notification.action" 
              size="small" 
              :type="notification.actionType || 'primary'"
              @click.stop="handleAction(notification)"
            >
              {{ notification.actionText || '查看' }}
            </el-button>
            <el-button 
              size="small" 
              text 
              type="danger"
              @click.stop="deleteNotification(notification.id)"
            >
              删除
            </el-button>
          </div>
        </div>
      </el-card>
      
      <el-empty v-if="!filteredNotifications.length" description="暂无通知消息" />
    </div>

    <!-- 药品提醒设置 -->
    <el-card class="drug-reminder-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>💊 药品提醒设置</span>
          <el-button type="primary" size="small" @click="addDrugReminder">
            添加提醒
          </el-button>
        </div>
      </template>
      
      <div v-if="drugReminders.length" class="drug-list">
        <div v-for="drug in drugReminders" :key="drug.id" class="drug-item">
          <div class="drug-icon">💊</div>
          <div class="drug-info">
            <span class="drug-name">{{ drug.name }}</span>
            <span class="drug-dose">{{ drug.dose }}</span>
            <span class="drug-time">
              <el-icon><Clock /></el-icon>
              {{ drug.times.join('、') }}
            </span>
          </div>
          <div class="drug-actions">
            <el-switch v-model="drug.enabled" @change="toggleDrugReminder(drug)" />
            <el-button size="small" text @click="editDrugReminder(drug)">编辑</el-button>
            <el-button size="small" text type="danger" @click="deleteDrugReminder(drug.id)">删除</el-button>
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无药品提醒设置" :image-size="60" />
    </el-card>

    <!-- 添加药品提醒对话框 -->
    <el-dialog v-model="showDrugDialog" title="添加药品提醒" width="500px">
      <el-form :model="drugForm" label-width="80px">
        <el-form-item label="药品名称">
          <el-input v-model="drugForm.name" placeholder="请输入药品名称" />
        </el-form-item>
        <el-form-item label="剂量">
          <el-input v-model="drugForm.dose" placeholder="如：1片、50mg" />
        </el-form-item>
        <el-form-item label="提醒时间">
          <el-time-picker
            v-model="drugForm.times"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="drugForm.remark" type="textarea" placeholder="可选备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDrugDialog = false">取消</el-button>
        <el-button type="primary" @click="saveDrugReminder">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Bell, Check, Delete, Warning, FirstAidKit, Clock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeTab = ref('all')
const showDrugDialog = ref(false)

const notifications = ref([
  {
    id: 1,
    type: 'health',
    title: '健康数据异常提醒',
    message: '您今天晨起的血压偏高(145/95)，建议休息后再次测量并记录。',
    time: '2024-01-18 08:30',
    read: false,
    priority: 'high',
    action: 'view-record',
    actionText: '查看记录',
    actionType: 'primary'
  },
  {
    id: 2,
    type: 'drug',
    title: '用药提醒',
    message: '该服用降压药了，请在饭后半小时服用。',
    time: '2024-01-18 08:00',
    read: false,
    priority: 'high',
    action: 'mark-taken',
    actionText: '已服用',
    actionType: 'success'
  },
  {
    id: 3,
    type: 'health',
    title: '健康周报已生成',
    message: '您的本周健康报告已生成，综合评分85分，点击查看详情。',
    time: '2024-01-17 10:00',
    read: true,
    priority: 'normal',
    action: 'view-report',
    actionText: '查看报告'
  },
  {
    id: 4,
    type: 'system',
    title: '设备同步提醒',
    message: '小米手环8已成功同步今日健康数据，共记录心率、步数等数据。',
    time: '2024-01-17 09:00',
    read: true,
    priority: 'normal'
  },
  {
    id: 5,
    type: 'health',
    title: '运动目标达成',
    message: '恭喜！您已完成今日运动目标(8000步)，继续保持！',
    time: '2024-01-16 18:00',
    read: true,
    priority: 'normal'
  },
  {
    id: 6,
    type: 'system',
    title: '系统更新通知',
    message: '533健康管理平台已升级至V2.0，新增健康报告导出功能。',
    time: '2024-01-15 12:00',
    read: true,
    priority: 'normal'
  },
  {
    id: 7,
    type: 'drug',
    title: '用药提醒',
    message: '该服用维生素D了，每日一次，饭后服用。',
    time: '2024-01-15 20:00',
    read: true,
    priority: 'normal'
  },
  {
    id: 8,
    type: 'health',
    title: '体检预约提醒',
    message: '您已3个月未进行体检，建议预约进行全面检查。',
    time: '2024-01-14 10:00',
    read: true,
    priority: 'normal',
    action: 'book-checkup',
    actionText: '预约体检'
  }
])

const drugReminders = ref([
  {
    id: 1,
    name: '降压药',
    dose: '1片',
    times: ['08:00', '20:00'],
    enabled: true,
    remark: '饭后半小时服用'
  },
  {
    id: 2,
    name: '维生素D',
    dose: '1粒',
    times: ['08:00'],
    enabled: true,
    remark: '饭后服用'
  },
  {
    id: 3,
    name: '钙片',
    dose: '2片',
    times: ['21:00'],
    enabled: false,
    remark: '睡前服用'
  }
])

const drugForm = ref({
  name: '',
  dose: '',
  times: [],
  remark: ''
})

const filteredNotifications = computed(() => {
  if (activeTab.value === 'all') return notifications.value
  return notifications.value.filter(n => n.type === activeTab.value)
})

const handleNotificationClick = (notification: any) => {
  if (!notification.read) {
    notification.read = true
  }
}

const handleAction = (notification: any) => {
  if (!notification.read) {
    notification.read = true
  }
  
  switch (notification.action) {
    case 'view-record':
      router.push('/home/health-record')
      break
    case 'view-report':
      router.push('/home/report')
      break
    case 'mark-taken':
      ElMessage.success('已记录服药')
      break
    case 'book-checkup':
      ElMessage.info('预约功能开发中')
      break
    default:
      break
  }
}

const deleteNotification = (id: number) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
  ElMessage.success('通知已删除')
}

const markAllRead = () => {
  notifications.value.forEach(n => n.read = true)
  ElMessage.success('已全部标记为已读')
}

const clearAll = () => {
  ElMessageBox.confirm('确定清空所有通知吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    notifications.value = []
    ElMessage.success('通知已清空')
  }).catch(() => {})
}

const addDrugReminder = () => {
  drugForm.value = {
    name: '',
    dose: '',
    times: [],
    remark: ''
  }
  showDrugDialog.value = true
}

const editDrugReminder = (drug: any) => {
  drugForm.value = { ...drug }
  showDrugDialog.value = true
}

const saveDrugReminder = () => {
  if (!drugForm.value.name || !drugForm.value.dose) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  ElMessage.success('药品提醒已保存')
  showDrugDialog.value = false
}

const toggleDrugReminder = (drug: any) => {
  ElMessage.success(`药品提醒已${drug.enabled ? '启用' : '禁用'}`)
}

const deleteDrugReminder = (id: number) => {
  drugReminders.value = drugReminders.value.filter(d => d.id !== id)
  ElMessage.success('药品提醒已删除')
}
</script>

<style scoped>
.notification-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.notification-header {
  text-align: center;
  margin-bottom: 20px;
}

.notification-header h2 {
  color: #409eff;
  margin-bottom: 8px;
}

.subtitle {
  color: #909399;
  font-size: 14px;
  margin: 0;
}

.filter-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

.notification-list {
  margin-bottom: 20px;
}

.notification-item {
  margin-bottom: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.notification-item:hover {
  transform: translateY(-2px);
}

.notification-item.unread {
  background: linear-gradient(to right, #ecf5ff, #fff);
  border-left: 4px solid #409eff;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.notification-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.notification-icon.health {
  background: #f0f9eb;
  color: #67c23a;
}

.notification-icon.system {
  background: #f4f4f5;
  color: #909399;
}

.notification-icon.drug {
  background: #fef0f0;
  color: #f56c6c;
}

.notification-body {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.unread-badge {
  margin-left: 4px;
}

.notification-message {
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.5;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-time {
  font-size: 12px;
  color: #909399;
}

.notification-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.drug-reminder-card {
  border-radius: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drug-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.drug-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.drug-icon {
  font-size: 28px;
}

.drug-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.drug-name {
  font-weight: 600;
  color: #303133;
}

.drug-dose {
  font-size: 13px;
  color: #606266;
}

.drug-time {
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}

.drug-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 响应式 */
@media (max-width: 768px) {
  .notification-container {
    padding: 12px;
  }
  
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-actions {
    justify-content: flex-end;
  }
  
  .notification-content {
    flex-wrap: wrap;
  }
  
  .notification-actions {
    flex-direction: row;
    width: 100%;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #eee;
  }
  
  .drug-item {
    flex-wrap: wrap;
  }
  
  .drug-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 8px;
  }
}
</style>
