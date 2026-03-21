# 533健康管理平台

> 5G + 三早（早筛查、早评估、早干预）全周期健康管理系统

[English](README_en.md) | 简体中文

---

## 📋 项目简介

533健康管理平台是响应**健康中国战略**的数字健康管理平台，基于5G技术实现全人群、全方位、全周期的健康服务。

### 533含义

| 数字 | 含义 |
|:---:|------|
| **5** | 5G技术底座 — 大数据、云计算、AI、穿戴设备 |
| **第一个3** | 三早 — 早筛查、早评估、早干预 |
| **第二个3** | 三全 — 全人群、全方位、全周期 |

**目标**：促健康、防重病、管慢病

### 官方背景

- 🏛️ 中国科协列入10个对工程技术创新具有关键作用的工程技术难题之一
- 🔬 国家自然科学基金项目
- 🏥 健康中国推进委员会办公室试点指导单位
- 🤝 腾讯医疗健康 × 浙江中医药大学健康管理研究所 联合推进

---

## ✨ 核心功能

### 模块一览

| 模块 | 功能描述 |
|-----|---------|
| 👤 **用户管理** | 注册登录、健康档案、个人信息 |
| 📋 **健康档案** | 体检记录、既往病史、家族病史 |
| 🩺 **健康评估** | 三早筛查、风险评估、健康评分 |
| 📝 **干预计划** | 个性化健康方案、跟踪执行 |
| 📱 **设备接入** | 可穿戴设备数据同步、实时监测 |
| 📊 **健康报告** | 生成周期性健康报告 |
| 🔔 **消息通知** | 提醒、预警、医嘱推送 |
| ⚙️ **设置** | 账号安全、偏好配置 |

---

## 🏗️ 技术架构

### 技术栈

#### 后端
- **框架**: Spring Boot 3.x
- **ORM**: MyBatis-Plus
- **数据库**: MySQL 8.0
- **缓存**: Redis
- **认证**: JWT

#### 前端
- **框架**: Vue 3 + Composition API
- **UI组件**: Element Plus
- **构建**: Vite
- **HTTP**: Axios
- **路由**: Vue Router

### 项目结构

```
533-health-management/
├── backend/                          # Spring Boot 后端
│   ├── src/main/java/com/health533/
│   │   ├── Health533Application.java  # 启动类
│   │   ├── config/                    # 配置类
│   │   │   ├── CorsConfig.java        # 跨域配置
│   │   │   └── RedisConfig.java       # Redis配置
│   │   ├── controller/                # 控制器层
│   │   │   ├── UserController.java           # 用户管理
│   │   │   ├── HealthRecordController.java   # 健康档案
│   │   │   ├── HealthAssessmentController.java  # 健康评估
│   │   │   ├── InterventionPlanController.java  # 干预计划
│   │   │   └── DeviceDataController.java  # 设备数据
│   │   ├── service/                   # 服务层
│   │   ├── mapper/                    # 数据访问层
│   │   ├── model/                     # 实体类
│   │   │   ├── User.java
│   │   │   ├── HealthRecord.java
│   │   │   ├── HealthAssessment.java
│   │   │   ├── InterventionPlan.java
│   │   │   └── DeviceData.java
│   │   └── common/                    # 通用类
│   │       └── Result.java             # 统一响应格式
│   └── src/main/resources/
│       └── application.yml             # 配置文件
│
├── frontend/                          # Vue 3 前端
│   ├── src/
│   │   ├── api/                      # API 调用封装
│   │   │   ├── request.ts            # Axios 封装
│   │   │   ├── user.ts               # 用户API
│   │   │   ├── health.ts             # 健康档案API
│   │   │   ├── assessment.ts         # 健康评估API
│   │   │   ├── intervention.ts       # 干预计划API
│   │   │   └── device.ts             # 设备API
│   │   ├── views/                    # 页面组件
│   │   │   ├── Home.vue              # 主框架
│   │   │   ├── Dashboard.vue         # 控制台
│   │   │   ├── Login.vue             # 登录
│   │   │   ├── Register.vue          # 注册
│   │   │   ├── HealthRecord.vue      # 健康档案
│   │   │   ├── Assessment.vue         # 健康评估
│   │   │   ├── Intervention.vue       # 干预计划
│   │   │   ├── Device.vue             # 设备管理
│   │   │   ├── Report.vue            # 健康报告
│   │   │   ├── Notification.vue      # 消息通知
│   │   │   └── Settings.vue          # 设置
│   │   ├── router/                   # 路由配置
│   │   └── App.vue                   # 根组件
│   ├── vercel.json                   # Vercel配置
│   ├── vite.config.ts                # Vite配置
│   └── package.json
│
└── docs/                             # 文档（待添加）
```

---

## 🚀 快速开始

### 前置要求

- JDK 17+
- Node.js 18+
- Maven 3.8+
- MySQL 8.0
- Redis

### 后端启动

```bash
cd backend
# 配置数据库连接 (src/main/resources/application.yml)
# 运行
mvn spring-boot:run
```

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 部署

### 国内访问

域名：`533healthcare.com` / `www.533healthcare.com`

通过阿里云ECS反向代理到Vercel，解决国内访问问题。

### 海外访问

域名：`533-health-management.vercel.app`

直连Vercel部署。

---

## 📄 License

MIT License
