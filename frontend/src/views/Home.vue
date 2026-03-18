<template>
  <el-container class="home-container">
    <el-aside width="200px">
      <div class="logo">533健康</div>
      <el-menu :default-active="$route.path" router>
        <el-menu-item index="/home/dashboard">
          <span>控制台</span>
        </el-menu-item>
        <el-menu-item index="/home/health-record">
          <span>健康档案</span>
        </el-menu-item>
        <el-menu-item index="/home/assessment">
          <span>健康评估</span>
        </el-menu-item>
        <el-menu-item index="/home/intervention">
          <span>干预计划</span>
        </el-menu-item>
        <el-menu-item index="/home/device">
          <span>设备管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-right">
          <span>{{ username }}</span>
          <el-button type="danger" size="small" @click="handleLogout">退出</el-button>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')

onMounted(() => {
  username.value = localStorage.getItem('username') || '用户'
})

const handleLogout = () => {
  localStorage.clear()
  router.push('/login')
}
</script>

<style scoped>
.home-container {
  height: 100vh;
}

.el-aside {
  background-color: #304156;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}

.el-header {
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.el-main {
  padding: 20px;
}
</style>
