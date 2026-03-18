<template>
  <div class="intervention">
    <div class="page-header">
      <h2>💊 干预计划</h2>
      <p class="subtitle">科学干预，健康管理</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <el-skeleton :rows="4" animated />
    </div>

    <template v-else>
      <!-- 统计卡片 -->
      <el-row :gutter="12" class="stats-row">
        <el-col :xs="8" :sm="8">
          <div class="stat-card">
            <div class="stat-value">{{ activePlans }}</div>
            <div class="stat-label">进行中</div>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8">
          <div class="stat-card">
            <div class="stat-value completed">{{ completedPlans }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8">
          <div class="stat-card">
            <div class="stat-value">{{ overallProgress }}%</div>
            <div class="stat-label">总进度</div>
          </div>
        </el-col>
      </el-row>

      <!-- 干预计划列表 -->
      <div class="plan-list">
        <el-card 
          v-for="plan in plans" 
          :key="plan.id" 
          class="plan-card"
          :class="{ completed: plan.status === 2 }"
          shadow="hover"
        >
          <div class="plan-header">
            <div class="plan-icon">{{ plan.icon }}</div>
            <div class="plan-info">
              <h3>{{ plan.name }}</h3>
              <p>{{ plan.description }}</p>
            </div>
            <el-tag :type="getStatusType(plan.status)" size="small">
              {{ getStatusText(plan.status) }}
            </el-tag>
          </div>
          
          <div class="plan-content">
            <div class="plan-detail">
              <span class="label">目标:</span>
              <span class="value">{{ plan.target }}</span>
            </div>
            <div class="plan-detail">
              <span class="label">周期:</span>
              <span class="value">{{ plan.duration }}</span>
            </div>
            <div class="plan-detail">
              <span class="label">完成度:</span>
              <span class="value">{{ plan.progress }}%</span>
            </div>
          </div>

          <el-progress 
            :percentage="plan.progress" 
            :stroke-width="10"
            :color="getProgressColor(plan.progress)"
            :show-text="true"
          />

          <div class="plan-actions">
            <el-button 
              v-if="plan.status === 1" 
              type="primary" 
              size="small" 
              plain
              @click="checkIn(plan)"
            >
              今日打卡
            </el-button>
            <el-button size="small" @click="viewDetail(plan)">
              查看详情
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- 打卡记录 -->
      <el-card class="checkin-card">
        <template #header>
          <span>📅 打卡记录</span>
        </template>
        
        <div v-if="checkinList.length" class="checkin-list">
          <div v-for="item in checkinList" :key="item.id" class="checkin-item">
            <div class="checkin-date">{{ item.date }}</div>
            <div class="checkin-plan">{{ item.planName }}</div>
            <el-tag type="success" size="small">已打卡</el-tag>
          </div>
        </div>
        <el-empty v-else description="暂无打卡记录" />
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(true)
const plans = ref<any[]>([])

const checkinList = ref([
  { id: 1, date: '2024-01-18', planName: '饮食干预' },
  { id: 2, date: '2024-01-17', planName: '运动计划' },
  { id: 3, date: '2024-01-16', planName: '睡眠管理' }
])

const activePlans = computed(() => plans.value.filter(p => p.status === 1).length)
const completedPlans = computed(() => plans.value.filter(p => p.status === 2).length)
const overallProgress = computed(() => {
  if (!plans.value.length) return 0
  const total = plans.value.reduce((sum, p) => sum + p.progress, 0)
  return Math.round(total / plans.value.length)
})

onMounted(async () => {
  // 模拟数据
  plans.value = [
    {
      id: 1,
      name: '饮食干预',
      description: '每日摄入热量控制，少油少盐',
      icon: '🥗',
      status: 1,
      progress: 65,
      target: '每日热量摄入<1800kcal',
      duration: '30天'
    },
    {
      id: 2,
      name: '运动计划',
      description: '每周至少3次有氧运动',
      icon: '🏃',
      status: 1,
      progress: 45,
      target: '每周运动150分钟',
      duration: '60天'
    },
    {
      id: 3,
      name: '睡眠管理',
      description: '保证充足睡眠，规律作息',
      icon: '😴',
      status: 2,
      progress: 100,
      target: '每日睡眠7-8小时',
      duration: '30天'
    },
    {
      id: 4,
      name: '压力管理',
      description: '学习放松技巧，减轻心理压力',
      icon: '🧘',
      status: 1,
      progress: 30,
      target: '每日冥想10分钟',
      duration: '90天'
    }
  ]
  loading.value = false
})

const getStatusType = (status: number) => {
  return status === 1 ? 'warning' : 'success'
}

const getStatusText = (status: number) => {
  return status === 1 ? '进行中' : '已完成'
}

const getProgressColor = (progress: number) => {
  if (progress >= 80) return '#67c23a'
  if (progress >= 50) return '#409eff'
  return '#e6a23c'
}

const checkIn = (plan: any) => {
  plan.progress = Math.min(100, plan.progress + 5)
  if (plan.progress >= 100) {
    plan.status = 2
  }
  ElMessage.success(`已打卡！完成度提升至 ${plan.progress}%`)
}

const viewDetail = (plan: any) => {
  ElMessage.info(`${plan.name}详情：目标 ${plan.target}，周期 ${plan.duration}`)
}
</script>

<style scoped>
.intervention {
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 20px;
}

.page-header h2 {
  color: #409eff;
  margin-bottom: 8px;
}

.subtitle {
  color: #909399;
  font-size: 14px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  background: linear-gradient(135deg, #409eff, #67c23a);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  color: #fff;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
}

.stat-value.completed {
  color: #67c23a;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 4px;
}

.plan-list {
  margin-bottom: 20px;
}

.plan-card {
  margin-bottom: 16px;
  border-radius: 12px;
  transition: all 0.3s;
}

.plan-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.plan-card.completed {
  opacity: 0.7;
}

.plan-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.plan-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.plan-info {
  flex: 1;
}

.plan-info h3 {
  margin: 0 0 4px;
  font-size: 16px;
  color: #303133;
}

.plan-info p {
  margin: 0;
  font-size: 13px;
  color: #909399;
}

.plan-content {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.plan-detail {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 13px;
}

.plan-detail:last-child {
  margin-bottom: 0;
}

.plan-detail .label {
  color: #909399;
}

.plan-detail .value {
  color: #606266;
  font-weight: 500;
}

.plan-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

.checkin-card {
  border-radius: 12px;
}

.checkin-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkin-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 8px;
}

.checkin-date {
  font-size: 13px;
  color: #606266;
}

.checkin-plan {
  flex: 1;
  font-size: 14px;
  color: #303133;
}

.loading {
  padding: 20px;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header h2 {
    font-size: 20px;
  }
  
  .stat-value {
    font-size: 22px;
  }
  
  .plan-header {
    flex-wrap: wrap;
  }
  
  .plan-icon {
    font-size: 28px;
  }
}
</style>
