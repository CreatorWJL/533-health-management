<template>
  <div class="assessment-container">
    <div class="assessment-header">
      <h2>🩺 健康评估 - 三早筛查</h2>
      <p class="subtitle">早筛查、早评估、早干预，守护您的健康</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <template v-else>
      <!-- 步骤条 -->
      <el-card class="steps-card">
        <el-steps :active="step" finish-status="success" align-center>
          <el-step title="基本信息" />
          <el-step title="健康问卷" />
          <el-step title="评估结果" />
        </el-steps>
      </el-card>

      <!-- 动画过渡 - 放在问卷上方 -->
      <el-card v-if="showAnimation" class="animation-card">
        <div class="animation-content">
          <div class="spinner"></div>
          <p class="animation-text">正在分析您的健康数据...</p>
          <p class="animation-sub">请稍候</p>
        </div>
      </el-card>

      <!-- 步骤1: 基本信息 -->
      <el-card v-show="step === 0" class="form-card">
        <template #header>
          <span class="card-title">📋 请填写基本信息</span>
        </template>
        
        <el-form :model="formData" label-position="top" size="large">
          <el-form-item label="年龄">
            <el-input-number 
              v-model="formData.age" 
              :min="18" 
              :max="100" 
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="性别">
            <el-radio-group v-model="formData.gender">
              <el-radio label="male">👨 男</el-radio>
              <el-radio label="female">👩 女</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="身高 (cm)">
            <el-input-number 
              v-model="formData.height" 
              :min="100" 
              :max="220" 
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="体重 (kg)">
            <el-input-number 
              v-model="formData.weight" 
              :min="30" 
              :max="200" 
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="家族病史">
            <el-checkbox-group v-model="formData.familyHistory">
              <el-checkbox label="高血压">高血压</el-checkbox>
              <el-checkbox label="糖尿病">糖尿病</el-checkbox>
              <el-checkbox label="心脏病">心脏病</el-checkbox>
              <el-checkbox label="肿瘤">肿瘤</el-checkbox>
              <el-checkbox label="无">无</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          
          <el-button type="primary" @click="nextStep" class="next-btn">
            下一步 <el-icon><ArrowRight /></el-icon>
          </el-button>
        </el-form>
      </el-card>

      <!-- 步骤2: 健康问卷 -->
      <el-card v-show="step === 1" class="form-card">
        <template #header>
          <span class="card-title">📝 健康问卷调查</span>
        </template>
        
        <div class="question-list">
          <div v-for="(q, index) in questions" :key="index" class="question-item">
            <p class="question-title">{{ index + 1 }}. {{ q.title }}</p>
            <el-radio-group v-model="answers[q.key]" size="default">
              <el-radio-button 
                v-for="opt in q.options" 
                :key="opt.value" 
                :label="opt.value"
              >
                {{ opt.label }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
        
        <div class="button-group">
          <el-button @click="prevStep" class="prev-btn">
            <el-icon><ArrowLeft /></el-icon> 上一步
          </el-button>
          <el-button type="primary" @click="submitAssessment" class="submit-btn" :loading="submitting || showAnimation">
            {{ showAnimation ? '分析中...' : '提交评估' }}
          </el-button>
        </div>
      </el-card>

      <!-- 步骤3: 风险评估结果 -->
      <el-card v-show="step >= 2 && !showAnimation && result" class="result-card">
        <template #header>
          <span class="card-title">📊 评估结果</span>
        </template>
        
        <div class="result-content" v-if="result">
          <div class="risk-level" :class="result.riskLevel">
            <div class="risk-icon">
              <el-icon v-if="result.riskLevel === 'low'"><CircleCheck /></el-icon>
              <el-icon v-else-if="result.riskLevel === 'medium'"><Warning /></el-icon>
              <el-icon v-else><WarningFilled /></el-icon>
            </div>
            <h3>{{ result.riskLevelText }}</h3>
            <div class="score-circle">
              <el-progress 
                type="circle" 
                :percentage="result.score" 
                :color="getScoreColor(result.score)"
                :width="120"
              />
            </div>
          </div>
          
          <div class="recommendations">
            <h4>💡 健康建议</h4>
            <ul>
              <li v-for="(rec, index) in result.recommendations" :key="index">
                {{ rec }}
              </li>
            </ul>
          </div>
          
          <div class="result-actions">
            <el-button type="primary" @click="startIntervention">
              开始干预计划
            </el-button>
            <el-button @click="resetForm">
              重新评估
            </el-button>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty v-else description="暂无评估结果" />
      </el-card>

      <!-- 历史评估记录 -->
      <el-card class="history-card">
        <template #header>
          <span class="card-title">📜 历史评估记录</span>
        </template>
        
        <div v-if="historyList.length">
          <el-timeline>
            <el-timeline-item
              v-for="item in historyList"
              :key="item.id"
              :timestamp="item.assessmentDate"
              placement="top"
              :type="getRiskType(item.riskLevel)"
            >
              <el-card class="history-item">
                <h4>{{ item.assessmentType }}</h4>
                <div class="history-meta">
                  <el-tag :type="getRiskTagType(item.riskLevel)" size="small">
                    {{ item.riskLevel }}
                  </el-tag>
                  <span class="score">得分: {{ item.score }}</span>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        
        <el-empty v-else description="暂无历史评估记录" />
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight, CircleCheck, Warning, WarningFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import request from '@/api/request'

const router = useRouter()

const loading = ref(true)
const submitting = ref(false)
const showAnimation = ref(false)
const step = ref(0)
const historyList = ref<any[]>([])
const result = ref<any>(null)

const formData = reactive({
  age: 45,
  gender: 'male',
  height: 170,
  weight: 70,
  familyHistory: [] as string[]
})

const answers = reactive({
  exercise: '',
  diet: '',
  sleep: '',
  stress: '',
  smoking: '',
  drinking: ''
})

// 健康问卷题目
const questions = [
  {
    key: 'exercise',
    title: '您每周运动几次？',
    options: [
      { value: '1', label: '从不运动' },
      { value: '2', label: '1-2次' },
      { value: '3', label: '3-4次' },
      { value: '4', label: '5次以上' }
    ]
  },
  {
    key: 'diet',
    title: '您的饮食习惯是？',
    options: [
      { value: '1', label: '口味重' },
      { value: '2', label: '一般' },
      { value: '3', label: '口味清淡' },
      { value: '4', label: '营养均衡' }
    ]
  },
  {
    key: 'sleep',
    title: '您每晚睡眠时长？',
    options: [
      { value: '1', label: '不足5小时' },
      { value: '2', label: '5-6小时' },
      { value: '3', label: '7-8小时' },
      { value: '4', label: '8小时以上' }
    ]
  },
  {
    key: 'stress',
    title: '您的压力水平？',
    options: [
      { value: '1', label: '非常大' },
      { value: '2', label: '比较大' },
      { value: '3', label: '一般' },
      { value: '4', label: '较小' }
    ]
  },
  {
    key: 'smoking',
    title: '您是否吸烟？',
    options: [
      { value: '1', label: '经常吸烟' },
      { value: '2', label: '偶尔吸烟' },
      { value: '3', label: '已戒烟' },
      { value: '4', label: '从不吸烟' }
    ]
  },
  {
    key: 'drinking',
    title: '您是否饮酒？',
    options: [
      { value: '1', label: '经常饮酒' },
      { value: '2', label: '偶尔饮酒' },
      { value: '3', label: '已戒酒' },
      { value: '4', label: '从不饮酒' }
    ]
  }
]

// 获取历史记录
const fetchHistory = async () => {
  try {
    const res = await request.get('/assessment/list')
    historyList.value = res.data || []
  } catch (e) {
    console.error('获取历史记录失败', e)
  }
}

onMounted(async () => {
  await fetchHistory()
  loading.value = false
})

const nextStep = () => {
  step.value++
}

const prevStep = () => {
  step.value--
}

const submitAssessment = async () => {
  submitting.value = true
  
  // 提交时先把问卷步骤打勾
  step.value = 2
  
  // 计算得分
  let score = 0
  Object.values(answers).forEach((val: any) => {
    score += parseInt(val || '0')
  })
  score = Math.round((score / 24) * 100)
  
  // 生成风险等级
  let riskLevel = 'low'
  let riskLevelText = '低风险'
  let recommendations = ['继续保持健康生活方式', '定期体检']
  
  if (score < 50) {
    riskLevel = 'high'
    riskLevelText = '高风险'
    recommendations = [
      '建议立即就医进行全面检查',
      '严格控制饮食，减少高盐高脂食物',
      '加强运动，建议每周至少3次有氧运动',
      '定期监测血压、血糖等指标'
    ]
  } else if (score < 75) {
    riskLevel = 'medium'
    riskLevelText = '中风险'
    recommendations = [
      '建议改善生活习惯',
      '增加运动量',
      '定期体检监测',
      '保持充足睡眠'
    ]
  }
  
  result.value = {
    score,
    riskLevel,
    riskLevelText,
    recommendations
  }
  
  submitting.value = false
  // 显示分析动画
  showAnimation.value = true
  
  // 2秒后动画结束，显示结果，所有步骤打勾
  setTimeout(() => {
    showAnimation.value = false
    step.value = 3 // 设置为3让所有步骤都显示勾
    ElMessage.success('评估完成！')
  }, 2000)
}

const startIntervention = () => {
  // 使用 window.location 强制跳转
  window.location.href = '/#/home/intervention'
}

const resetForm = () => {
  step.value = 0
  result.value = null
  Object.keys(answers).forEach(key => {
    answers[key as keyof typeof answers] = ''
  })
}

const getScoreColor = (score: number) => {
  if (score >= 75) return '#67c23a'
  if (score >= 50) return '#e6a23c'
  return '#f56c6c'
}

const getRiskType = (level: string) => {
  if (level === '低风险') return 'success'
  if (level === '中风险') return 'warning'
  return 'danger'
}

const getRiskTagType = (level: string) => {
  if (level === '低风险') return 'success'
  if (level === '中风险') return 'warning'
  return 'danger'
}
</script>

<style scoped>
.assessment-container {
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.assessment-header {
  text-align: center;
  margin-bottom: 20px;
}

.assessment-header h2 {
  color: #409eff;
  margin-bottom: 8px;
}

.subtitle {
  color: #909399;
  font-size: 14px;
}

.steps-card {
  margin-bottom: 20px;
}

.form-card, .result-card, .history-card {
  margin-bottom: 20px;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
}

.loading-container {
  padding: 40px 20px;
}

.question-list {
  margin-bottom: 20px;
}

.question-item {
  margin-bottom: 24px;
}

.question-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #303133;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.next-btn, .submit-btn {
  width: 100%;
}

.result-content {
  text-align: center;
  padding: 20px 0;
}

.risk-level {
  margin-bottom: 30px;
}

.risk-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.risk-level.low .risk-icon { color: #67c23a; }
.risk-level.medium .risk-icon { color: #e6a23c; }
.risk-level.high .risk-icon { color: #f56c6c; }

.risk-level h3 {
  margin: 10px 0 20px;
  font-size: 24px;
}

.score-circle {
  display: flex;
  justify-content: center;
}

.recommendations {
  text-align: left;
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.recommendations h4 {
  margin-bottom: 12px;
  color: #303133;
}

.recommendations ul {
  padding-left: 20px;
}

.recommendations li {
  margin-bottom: 8px;
  color: #606266;
}

.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.history-item h4 {
  margin: 0 0 8px;
  font-size: 15px;
}

.history-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.score {
  color: #909399;
  font-size: 13px;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .assessment-container {
    padding: 12px;
  }
  
  .assessment-header h2 {
    font-size: 20px;
  }
  
  .button-group {
    flex-direction: row;
    gap: 12px;
  }
  
  .button-group .el-button {
    flex: 1;
  }
  
  .result-actions {
    flex-direction: row;
    gap: 12px;
  }
  
  .result-actions .el-button {
    flex: 1;
  }
  
  :deep(.el-radio-group) {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  :deep(.el-radio-button) {
    flex: 1;
    min-width: 70px;
  }
  
  :deep(.el-radio-button__inner) {
    width: 100%;
  }
}

/* 动画效果 */
.form-card, .result-card {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 分析动画 */
.animation-card {
  margin-top: 20px;
  animation: pulse 1.5s ease-in-out infinite;
}

.animation-content {
  text-align: center;
  padding: 40px 20px;
}

.spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border: 4px solid #e4e7ed;
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.animation-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
}

.animation-sub {
  font-size: 14px;
  color: #909399;
  margin: 0;
}
</style>
