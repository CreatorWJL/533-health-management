<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>健康数据概览</h2>
      <p class="subtitle">实时监测您的健康状况</p>
    </div>
    
    <!-- 健康指标卡片 -->
    <el-row :gutter="12" class="stat-row">
      <el-col :xs="12" :sm="12" :md="6" v-for="(stat, index) in statCards" :key="stat.label">
        <el-card 
          class="stat-card" 
          :class="'stat-card-' + (index + 1)"
          shadow="hover"
        >
          <div class="stat-icon" :style="{ background: stat.gradient }">
            <span v-html="stat.icon"></span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
              {{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}%
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表区域 -->
    <el-row :gutter="12" style="margin-top: 12px">
      <el-col :xs="24" :sm="24" :md="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>健康趋势</span>
              <el-radio-group v-model="chartPeriod" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <!-- 模拟折线图 -->
            <svg class="line-chart" viewBox="0 0 600 200">
              <!-- 网格线 -->
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#409EFF;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#67C23A;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#409EFF;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#409EFF;stop-opacity:0" />
                </linearGradient>
              </defs>
              <!-- 网格 -->
              <g class="grid">
                <line v-for="i in 5" :key="'h'+i" 
                  :x1="0" :y1="(i-1)*45" :x2="600" :y2="(i-1)*45" 
                  stroke="#e4e7ed" stroke-dasharray="4"/>
                <line v-for="i in 7" :key="'v'+i"
                  :x1="(i-1)*100" y1="0" :x2="(i-1)*100" y2="180"
                  stroke="#e4e7ed" stroke-dasharray="4"/>
              </g>
              <!-- 区域填充 -->
              <path :d="areaPath" fill="url(#areaGradient)"/>
              <!-- 折线 -->
              <path :d="linePath" fill="none" stroke="url(#lineGradient)" stroke-width="3" stroke-linecap="round"/>
              <!-- 数据点 -->
              <circle v-for="(point, i) in chartPoints" :key="'p'+i"
                :cx="point.x" :cy="point.y" r="5" fill="#fff" stroke="#409EFF" stroke-width="2"/>
              <!-- X轴标签 -->
              <g class="x-labels">
                <text v-for="(label, i) in xLabels" :key="'l'+i"
                  :x="i * 100 + 50" y="200" text-anchor="middle" fill="#909399" font-size="12">
                  {{ label }}
                </text>
              </g>
            </svg>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>健康评分</span>
            </div>
          </template>
          <div class="score-ring">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#e4e7ed" stroke-width="12"/>
              <circle cx="100" cy="100" r="80" fill="none" 
                stroke="url(#scoreGradient)" stroke-width="12" 
                stroke-linecap="round"
                :stroke-dasharray="scoreDash"
                transform="rotate(-90 100 100)"/>
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#67C23A"/>
                  <stop offset="100%" style="stop-color:#409EFF"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="score-text">
              <span class="score-value">{{ healthScore }}</span>
              <span class="score-label">健康指数</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 底部信息 -->
    <el-row :gutter="12" style="margin-top: 12px">
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>📋 最近评估</span>
            </div>
          </template>
          <div v-if="latestAssessment" class="assessment-info">
            <div class="assessment-item">
              <span class="label">评估类型:</span>
              <el-tag type="primary">{{ latestAssessment.assessmentType }}</el-tag>
            </div>
            <div class="assessment-item">
              <span class="label">风险等级:</span>
              <el-tag :type="getRiskType(latestAssessment.riskLevel)">
                {{ latestAssessment.riskLevel }}
              </el-tag>
            </div>
            <div class="assessment-item">
              <span class="label">评估日期:</span>
              <span class="value">{{ latestAssessment.assessmentDate }}</span>
            </div>
          </div>
          <el-empty v-else description="暂无评估记录" :image-size="80"/>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>💊 进行中的干预计划</span>
            </div>
          </template>
          <div v-if="plans.length" class="plan-list">
            <div v-for="plan in plans" :key="plan.id" class="plan-item">
              <div class="plan-header">
                <span class="plan-name">{{ plan.planName }}</span>
                <el-tag size="small" type="success">进行中</el-tag>
              </div>
              <el-progress 
                :percentage="plan.progress" 
                :stroke-width="8"
                :color="plan.progress > 70 ? '#67C23A' : '#409EFF'"
              />
            </div>
          </div>
          <el-empty v-else description="暂无干预计划" :image-size="80"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { healthApi } from '@/api/health'
import { assessmentApi } from '@/api/assessment'
import { interventionApi } from '@/api/intervention'

const stats = ref<any>({})
const latestAssessment = ref<any>(null)
const plans = ref<any[]>([])
const chartPeriod = ref('week')
const healthScore = ref(85)

const statCards = computed(() => [
  {
    icon: '⚖️',
    value: stats.value.bmi || '--',
    label: 'BMI指数',
    gradient: 'linear-gradient(135deg, #409EFF, #67C23A)',
    trend: 2.5
  },
  {
    icon: '💓',
    value: stats.value.bloodPressure || '--',
    label: '血压(mmHg)',
    gradient: 'linear-gradient(135deg, #E6A23C, #F56C6C)',
    trend: -1.2
  },
  {
    icon: '💗',
    value: stats.value.heartRate || '--',
    label: '心率(次/分)',
    gradient: 'linear-gradient(135deg, #F56C6C, #909399)',
    trend: 0.8
  },
  {
    icon: '🩸',
    value: stats.value.bloodSugar || '--',
    label: '血糖(mmol/L)',
    gradient: 'linear-gradient(135deg, #909399, #409EFF)',
    trend: -3.1
  }
])

const chartPoints = computed(() => {
  const baseY = 100
  const data = [80, 65, 90, 70, 85, 60, 95]
  return data.map((y, i) => ({
    x: i * 100 + 50,
    y: baseY - (y - 70) * 1.2
  }))
})

const linePath = computed(() => {
  const points = chartPoints.value
  if (!points.length) return ''
  return 'M ' + points.map(p => `${p.x},${p.y}`).join(' L ')
})

const areaPath = computed(() => {
  const points = chartPoints.value
  if (!points.length) return ''
  return `M ${points[0].x},180 L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${points[points.length-1].x},180 Z`
})

const xLabels = computed(() => ['周一', '周二', '周三', '周四', '周五', '周六', '周日'])

const scoreDash = computed(() => {
  const circumference = 2 * Math.PI * 80
  const progress = (healthScore.value / 100) * circumference
  return `${progress} ${circumference}`
})

const getRiskType = (level: string) => {
  const types: Record<string, string> = {
    '高风险': 'danger',
    '中风险': 'warning',
    '低风险': 'success'
  }
  return types[level] || 'info'
}

const userId = Number(localStorage.getItem('userId'))

onMounted(async () => {
  try {
    const record = await healthApi.getLatestRecord(userId)
    if (record.data) {
      stats.value = {
        bmi: record.data.bmi,
        bloodPressure: record.data.bloodPressureHigh && record.data.bloodPressureLow 
          ? `${record.data.bloodPressureHigh}/${record.data.bloodPressureLow}` : null,
        heartRate: record.data.heartRate,
        bloodSugar: record.data.bloodSugar
      }
    }
    
    const assessments = await assessmentApi.list(userId)
    if (assessments.data.length) {
      latestAssessment.value = assessments.data[0]
    }
    
    const interventionPlans = await interventionApi.list(userId)
    plans.value = interventionPlans.data.filter((p: any) => p.status === 1)
  } catch (e) {
    // 使用模拟数据
    stats.value = {
      bmi: '22.5',
      bloodPressure: '120/80',
      heartRate: '72',
      bloodSugar: '5.6'
    }
  }
})
</script>

<style scoped>
.dashboard {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dashboard-header {
  margin-bottom: 24px;
}

.dashboard-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.subtitle {
  margin: 6px 0 0;
  color: #909399;
  font-size: 14px;
}

.stat-row {
  margin-top: 20px;
}

.stat-card {
  border-radius: 12px;
  border: none;
  transition: all 0.3s ease;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.stat-content {
  margin-left: 16px;
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.stat-trend {
  font-size: 12px;
  margin-top: 6px;
}

.stat-trend.up { color: #F56C6C; }
.stat-trend.down { color: #67C23A; }

.chart-card {
  border-radius: 12px;
  border: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.chart-container {
  padding: 10px 0;
}

.line-chart {
  width: 100%;
  height: 200px;
}

.info-card {
  border-radius: 12px;
  border: none;
}

.assessment-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.assessment-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.assessment-item .label {
  color: #909399;
  font-size: 14px;
  min-width: 80px;
}

.assessment-item .value {
  color: #606266;
}

.plan-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plan-item {
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.plan-item:last-child {
  border-bottom: none;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.plan-name {
  font-weight: 500;
  color: #303133;
}

/* 健康评分环 */
.score-ring {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
}

.score-ring svg {
  width: 100%;
  height: 100%;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-value {
  display: block;
  font-size: 42px;
  font-weight: 700;
  color: #409EFF;
}

.score-label {
  font-size: 14px;
  color: #909399;
}
</style>
