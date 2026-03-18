<template>
  <div class="health-record">
    <div class="page-header">
      <h2>健康档案管理</h2>
      <p class="subtitle">记录您的健康数据，掌握身体状况</p>
    </div>
    
    <el-card class="form-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>📝 基本健康信息</span>
          <el-button type="primary" text @click="loadDemoData">加载示例数据</el-button>
        </div>
      </template>
      
      <el-form :model="form" label-width="100px" class="health-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身高">
              <el-input v-model="form.height" placeholder="cm" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体重">
              <el-input v-model="form.weight" placeholder="kg" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="12">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="高压">
              <el-input v-model="form.bloodPressureHigh" placeholder="高压" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="低压">
              <el-input v-model="form.bloodPressureLow" placeholder="低压" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="心率">
              <el-input v-model="form.heartRate" placeholder="次/分" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="血糖">
              <el-input v-model="form.bloodSugar" placeholder="mmol/L" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="血氧">
              <el-input v-model="form.bloodOxygen" placeholder="%" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <div class="form-actions">
          <el-button type="primary" size="large" @click="save">保存健康档案</el-button>
          <el-button size="large" @click="reset">重置</el-button>
          <el-button size="large" @click="loadDemoData">加载示例</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const form = ref({
  height: '',
  weight: '',
  bloodPressureHigh: '',
  bloodPressureLow: '',
  heartRate: '',
  bloodSugar: '',
  bloodOxygen: ''
})

const save = () => {
  ElMessage.success('健康档案已保存')
}

const reset = () => {
  form.value = {
    height: '',
    weight: '',
    bloodPressureHigh: '',
    bloodPressureLow: '',
    heartRate: '',
    bloodSugar: '',
    bloodOxygen: ''
  }
  ElMessage.info('已重置')
}

const loadDemoData = () => {
  form.value = {
    height: '170',
    weight: '65',
    bloodPressureHigh: '120',
    bloodPressureLow: '80',
    heartRate: '72',
    bloodSugar: '5.6',
    bloodOxygen: '98'
  }
}
</script>

<style scoped>
.health-record {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
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

.form-card {
  border-radius: 12px;
  border: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}
</style>
