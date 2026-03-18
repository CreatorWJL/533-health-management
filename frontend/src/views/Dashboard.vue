<template>
  <div class="dashboard">
    <h2>健康数据概览</h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-value">{{ stats.bmi || '--' }}</div>
            <div class="stat-label">BMI指数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-value">{{ stats.bloodPressure || '--' }}</div>
            <div class="stat-label">血压(mmHg)</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-value">{{ stats.heartRate || '--' }}</div>
            <div class="stat-label">心率(次/分)</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-value">{{ stats.bloodSugar || '--' }}</div>
            <div class="stat-label">血糖(mmol/L)</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>最近评估</template>
          <div v-if="latestAssessment">
            <p>评估类型: {{ latestAssessment.assessmentType }}</p>
            <p>风险等级: {{ latestAssessment.riskLevel }}</p>
            <p>评估日期: {{ latestAssessment.assessmentDate }}</p>
          </div>
          <el-empty v-else description="暂无评估记录" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>进行中的干预计划</template>
          <div v-if="plans.length">
            <div v-for="plan in plans" :key="plan.id" style="margin-bottom: 10px">
              <el-tag>{{ plan.planName }}</el-tag>
            </div>
          </div>
          <el-empty v-else description="暂无干预计划" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { healthApi } from '@/api/health'
import { assessmentApi } from '@/api/assessment'
import { interventionApi } from '@/api/intervention'

const stats = ref<any>({})
const latestAssessment = ref<any>(null)
const plans = ref<any[]>([])

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
    console.error(e)
  }
})
</script>

<style scoped>
.dashboard h2 {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  padding: 20px 0;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409eff;
}

.stat-label {
  margin-top: 10px;
  color: #666;
}
</style>
