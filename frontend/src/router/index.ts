import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '',
        redirect: '/home/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: 'health-record',
        name: 'HealthRecord',
        component: () => import('@/views/HealthRecord.vue')
      },
      {
        path: 'assessment',
        name: 'Assessment',
        component: () => import('@/views/Assessment.vue')
      },
      {
        path: 'intervention',
        name: 'Intervention',
        component: () => import('@/views/Intervention.vue')
      },
      {
        path: 'device',
        name: 'Device',
        component: () => import('@/views/Device.vue')
      },
      {
        path: 'report',
        name: 'Report',
        component: () => import('@/views/Report.vue')
      },
      {
        path: 'notification',
        name: 'Notification',
        component: () => import('@/views/Notification.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
