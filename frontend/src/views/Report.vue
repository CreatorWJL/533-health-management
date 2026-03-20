<template>
  <div class="report-container">
    <div class="report-header">
      <h2>📊 健康报告</h2>
      <p class="subtitle">全面了解您的健康状况</p>
    </div>

    <!-- 报告生成选项 -->
    <el-card class="option-card" shadow="hover">
      <template #header>
        <span class="card-title">📋 报告生成选项</span>
      </template>
      
      <el-form :model="reportOptions" label-width="100px">
        <el-form-item label="报告类型">
          <el-radio-group v-model="reportOptions.type">
            <el-radio label="monthly">月度报告</el-radio>
            <el-radio label="quarterly">季度报告</el-radio>
            <el-radio label="yearly">年度报告</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="reportOptions.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="包含内容">
          <el-checkbox-group v-model="reportOptions.includes">
            <el-checkbox label="health">健康指标趋势</el-checkbox>
            <el-checkbox label="assessment">评估结果分析</el-checkbox>
            <el-checkbox label="intervention">干预计划执行</el-checkbox>
            <el-checkbox label="device">设备数据汇总</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="generateReport" :loading="generating">
            <el-icon><Document /></el-icon>
            生成报告
          </el-button>
          <el-button @click="exportPDF" :disabled="!reportGenerated">
            <el-icon><Download /></el-icon>
            导出PDF
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 报告预览 -->
    <el-card v-if="reportGenerated" class="preview-card" shadow="hover">
      <template #header>
        <div class="preview-header">
          <span class="card-title">📄 报告预览</span>
          <el-tag type="success">报告已生成</el-tag>
        </div>
      </template>
      
      <div class="report-content">
        <!-- 报告头部 -->
        <div class="report-title">
          <h3>{{ reportTitle }}</h3>
          <p class="report-date">生成时间: {{ generateTime }}</p>
        </div>
        
        <!-- 健康评分概览 -->
        <div class="report-section">
          <h4>📈 健康评分概览</h4>
          <div class="score-overview">
            <div class="score-item">
              <div class="score-circle large">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e4e7ed" stroke-width="10"/>
                  <circle cx="60" cy="60" r="50" fill="none" 
                    :stroke="getScoreColor(reportData.overallScore)" stroke-width="10" 
                    stroke-linecap="round"
                    :stroke-dasharray="getScoreDash(reportData.overallScore)"
                    transform="rotate(-90 60 60)"/>
                </svg>
                <span class="score-value">{{ reportData.overallScore }}</span>
              </div>
              <span class="score-label">综合评分</span>
            </div>
          </div>
        </div>
        
        <!-- 健康指标趋势 -->
        <div v-if="reportOptions.includes.includes('health')" class="report-section">
          <h4>💓 健康指标趋势</h4>
          <div class="indicator-grid">
            <div v-for="indicator in reportData.indicators" :key="indicator.name" class="indicator-card">
              <div class="indicator-icon">{{ indicator.icon }}</div>
              <div class="indicator-info">
                <span class="indicator-name">{{ indicator.name }}</span>
                <span class="indicator-value">{{ indicator.value }}</span>
                <span class="indicator-trend" :class="indicator.trend > 0 ? 'up' : 'down'">
                  {{ indicator.trend > 0 ? '↑' : '↓' }} {{ Math.abs(indicator.trend) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 评估结果分析 -->
        <div v-if="reportOptions.includes.includes('assessment')" class="report-section">
          <h4>🔬 评估结果分析</h4>
          <div class="assessment-list">
            <div v-for="assessment in reportData.assessments" :key="assessment.id" class="assessment-item">
              <div class="assessment-info">
                <span class="assessment-type">{{ assessment.type }}</span>
                <el-tag :type="getRiskTagType(assessment.riskLevel)" size="small">
                  {{ assessment.riskLevel }}
                </el-tag>
              </div>
              <div class="assessment-date">{{ assessment.date }}</div>
            </div>
          </div>
        </div>
        
        <!-- 干预计划执行 -->
        <div v-if="reportOptions.includes.includes('intervention')" class="report-section">
          <h4>💊 干预计划执行情况</h4>
          <div class="intervention-summary">
            <div class="summary-stat">
              <span class="stat-value">{{ reportData.interventionStats.total }}</span>
              <span class="stat-label">计划总数</span>
            </div>
            <div class="summary-stat">
              <span class="stat-value completed">{{ reportData.interventionStats.completed }}</span>
              <span class="stat-label">已完成</span>
            </div>
            <div class="summary-stat">
              <span class="stat-value ongoing">{{ reportData.interventionStats.ongoing }}</span>
              <span class="stat-label">进行中</span>
            </div>
            <div class="summary-stat">
              <span class="stat-value">{{ reportData.interventionStats.completionRate }}%</span>
              <span class="stat-label">完成率</span>
            </div>
          </div>
        </div>
        
        <!-- 设备数据汇总 -->
        <div v-if="reportOptions.includes.includes('device')" class="report-section">
          <h4>⌚ 设备数据汇总</h4>
          <div class="device-summary">
            <div v-for="device in reportData.devices" :key="device.name" class="device-item">
              <span class="device-name">{{ device.name }}</span>
              <span class="device-status" :class="device.status">{{ device.status }}</span>
              <span class="device-data">{{ device.lastData }}</span>
            </div>
          </div>
        </div>
        
        <!-- 健康建议 -->
        <div class="report-section recommendations">
          <h4>💡 健康建议</h4>
          <ul>
            <li v-for="(rec, index) in reportData.recommendations" :key="index">
              {{ rec }}
            </li>
          </ul>
        </div>
      </div>
    </el-card>

    <!-- 历史报告 -->
    <el-card class="history-card" shadow="hover">
      <template #header>
        <span class="card-title">📁 历史报告</span>
      </template>
      
      <div v-if="reportHistory.length">
        <el-table :data="reportHistory" style="width: 100%">
          <el-table-column prop="name" label="报告名称" />
          <el-table-column prop="type" label="类型" width="100">
            <template #default="{ row }">
              <el-tag size="small">{{ getTypeLabel(row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="生成日期" width="180" />
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button size="small" @click="viewReport(row)">查看</el-button>
              <el-button size="small" type="primary" @click="downloadReport(row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-empty v-else description="暂无历史报告" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Download } from '@element-plus/icons-vue'

const generating = ref(false)
const reportGenerated = ref(false)
const generateTime = ref('')

const reportOptions = ref({
  type: 'monthly',
  dateRange: [],
  includes: ['health', 'assessment', 'intervention', 'device']
})

const reportData = ref({
  overallScore: 85,
  indicators: [
    { name: '血压', value: '120/80 mmHg', icon: '💓', trend: -2.5 },
    { name: '心率', value: '72 次/分', icon: '💗', trend: 0 },
    { name: '血糖', value: '5.6 mmol/L', icon: '🩸', trend: -1.2 },
    { name: 'BMI', value: '22.5', icon: '⚖️', trend: -1.8 },
    { name: '睡眠', value: '7.5 小时', icon: '😴', trend: 5.2 },
    { name: '步数', value: '8500 步', icon: '👟', trend: 12.5 }
  ],
  assessments: [
    { id: 1, type: '三早筛查', riskLevel: '低风险', date: '2024-01-15' },
    { id: 2, type: '心血管风险', riskLevel: '中风险', date: '2024-01-10' },
    { id: 3, type: '糖尿病筛查', riskLevel: '低风险', date: '2024-01-05' }
  ],
  interventionStats: {
    total: 5,
    completed: 2,
    ongoing: 3,
    completionRate: 40
  },
  devices: [
    { name: '小米手环8', status: 'online', lastData: '心率72, 步数8500' },
    { name: '欧姆龙血压计', status: 'offline', lastData: '2024-01-14 20:00' },
    { name: '鱼跃血糖仪', status: 'online', lastData: '血糖5.6 mmol/L' }
  ],
  recommendations: [
    '继续保持规律运动习惯，建议每周至少3次有氧运动',
    '饮食方面注意少盐少油，控制每日热量摄入',
    '保证充足睡眠，尽量在23点前入睡',
    '定期测量血压、血糖等指标，做好健康监测',
    '保持良好心态，适当进行放松活动'
  ]
})

const reportHistory = ref([
  { id: 1, name: '2024年1月健康报告', type: 'monthly', date: '2024-01-15 10:30' },
  { id: 2, name: '2023年第四季度报告', type: 'quarterly', date: '2024-01-01 09:00' },
  { id: 3, name: '2023年度健康报告', type: 'yearly', date: '2024-01-01 08:00' }
])

const reportTitle = computed(() => {
  const types: Record<string, string> = {
    monthly: '月度健康报告',
    quarterly: '季度健康报告',
    yearly: '年度健康报告'
  }
  return `${new Date().getFullYear()}年${types[reportOptions.value.type]}`
})

const generateReport = async () => {
  generating.value = true
  
  // 模拟报告生成过程
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  generateTime.value = new Date().toLocaleString('zh-CN')
  reportGenerated.value = true
  generating.value = false
  
  ElMessage.success('报告生成成功！')
}

const exportPDF = () => {
  ElMessage.info('PDF导出功能开发中，敬请期待...')
}

const viewReport = (report: any) => {
  ElMessage.info(`查看报告: ${report.name}`)
}

const downloadReport = (report: any) => {
  ElMessage.success(`开始下载: ${report.name}`)
}

const getScoreColor = (score: number) => {
  if (score >= 80) return '#67c23a'
  if (score >= 60) return '#e6a23c'
  return '#f56c6c'
}

const getScoreDash = (score: number) => {
  const circumference = 2 * Math.PI * 50
  const progress = (score / 100) * circumference
  return `${progress} ${circumference}`
}

const getRiskTagType = (level: string) => {
  if (level === '低风险') return 'success'
  if (level === '中风险') return 'warning'
  return 'danger'
}

const getTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    monthly: '月度',
    quarterly: '季度',
    yearly: '年度'
  }
  return types[type] || type
}
</script>

<style scoped>
.report-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
}

.report-header {
  text-align: center;
  margin-bottom: 24px;
}

.report-header h2 {
  color: #409eff;
  margin-bottom: 8px;
}

.subtitle {
  color: #909399;
  font-size: 14px;
}

.card-title {
  font-weight: 600;
  font-size: 15px;
}

.option-card, .preview-card, .history-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-content {
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
}

.report-title {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #e4e7ed;
  margin-bottom: 20px;
}

.report-title h3 {
  margin: 0 0 8px;
  font-size: 20px;
  color: #303133;
}

.report-date {
  color: #909399;
  font-size: 13px;
  margin: 0;
}

.report-section {
  margin-bottom: 24px;
}

.report-section h4 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #303133;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.score-overview {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.score-item {
  text-align: center;
}

.score-circle {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 12px;
}

.score-circle svg {
  width: 100%;
  height: 100%;
}

.score-circle .score-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  font-weight: bold;
  color: #409eff;
}

.score-label {
  font-size: 14px;
  color: #909399;
}

.indicator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.indicator-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.indicator-icon {
  font-size: 24px;
}

.indicator-info {
  display: flex;
  flex-direction: column;
}

.indicator-name {
  font-size: 12px;
  color: #909399;
}

.indicator-value {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.indicator-trend {
  font-size: 11px;
}

.indicator-trend.up { color: #f56c6c; }
.indicator-trend.down { color: #67c23a; }

.assessment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.assessment-item {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assessment-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.assessment-type {
  font-weight: 500;
  color: #303133;
}

.assessment-date {
  font-size: 13px;
  color: #909399;
}

.intervention-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.summary-stat {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.summary-stat .stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 4px;
}

.summary-stat .stat-value.completed { color: #67c23a; }
.summary-stat .stat-value.ongoing { color: #e6a23c; }

.summary-stat .stat-label {
  font-size: 12px;
  color: #909399;
}

.device-summary {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.device-item {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.device-name {
  flex: 1;
  font-weight: 500;
}

.device-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.device-status.online {
  background: #f0f9eb;
  color: #67c23a;
}

.device-status.offline {
  background: #fef0f0;
  color: #f56c6c;
}

.device-data {
  font-size: 13px;
  color: #909399;
}

.recommendations {
  background: #ecf5ff;
  border-radius: 8px;
  padding: 16px;
}

.recommendations h4 {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 12px;
}

.recommendations ul {
  margin: 0;
  padding-left: 20px;
}

.recommendations li {
  margin-bottom: 8px;
  color: #606266;
  line-height: 1.6;
}

/* 响应式 */
@media (max-width: 768px) {
  .report-container {
    padding: 12px;
  }
  
  .indicator-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .intervention-summary {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .assessment-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  
  .report-form :deep(.el-form-item__content) {
    display: flex;
    flex-direction: row !important;
    gap: 12px;
  }
  
  .report-form :deep(.el-form-item__content > .el-button) {
    flex: 1;
  }
}
</style>
