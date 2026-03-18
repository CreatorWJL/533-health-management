<template>
  <div class="device">
    <h2>设备管理</h2>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>已连接设备</template>
          <el-list>
            <el-list-item v-for="device in devices" :key="device.id">
              <el-icon><Watch /></el-icon>
              <span>{{ device.name }}</span>
              <el-tag size="small" type="success">在线</el-tag>
            </el-list-item>
          </el-list>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>实时数据</template>
          <div v-if="devices.length">
            <p>心率: <b>{{ realtimeData.heartRate }}</b> 次/分</p>
            <p>步数: <b>{{ realtimeData.steps }}</b></p>
            <p>睡眠: <b>{{ realtimeData.sleep }}</b> 小时</p>
          </div>
          <el-empty v-else description="暂无设备连接" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const devices = ref([
  { id: 1, name: '小米手环8' },
  { id: 2, name: '华为手表GT4' }
])

const realtimeData = ref({
  heartRate: 72,
  steps: 8543,
  sleep: 7.5
})
</script>

<style scoped>
.device { padding: 20px; }
</style>
