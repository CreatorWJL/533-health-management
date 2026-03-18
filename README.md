# 533健康管理平台

> 5G + 三早（早筛查、早评估、早干预）全周期健康管理系统

## 项目简介

533健康管理工程是响应健康中国战略的数字健康管理平台，基于5G技术实现：
- **5** - 5G技术底座
- **3** - 三早：早筛查、早评估、早干预
- **3** - 全周期、全人群、全方位健康管理

目标：**促健康、防重病、管慢病**

## 技术栈

### 后端
- Spring Boot 3.x
- MyBatis-Plus
- MySQL 8.0
- Redis
- JWT 认证

### 前端
- Vue 3 + Composition API
- Element Plus
- Vite
- Axios

## 项目结构

```
533-health-management/
├── backend/                    # Spring Boot 后端
│   └── src/main/java/com/health533/
│       ├── config/            # 配置类
│       ├── controller/        # 控制器
│       ├── service/          # 服务层
│       ├── mapper/           # 数据层
│       ├── model/            # 实体类
│       └── common/          # 通用类
├── frontend/                  # Vue3 前端
│   └── src/
│       ├── views/            # 页面
│       ├── components/      # 组件
│       ├── api/             # API调用
│       └── router/          # 路由
└── docs/                     # 文档
```

## 核心功能模块

| 模块 | 功能 |
|-----|------|
| 用户管理 | 注册登录、健康档案 |
| 健康评估 | 三早筛查、风险评估 |
| 干预计划 | 个性化健康方案 |
| AI服务 | 智能辅助诊断 |
| 设备接入 | 可穿戴设备数据同步 |

## 快速开始

### 后端启动

```bash
cd backend
mvn spring-boot:run
```

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

## License

MIT
