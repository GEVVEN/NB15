# 汽修十五班 - 评价墙

一个炫酷的班级评价墙网站，带有荷花背景和彩虹特效。

## 功能特性

- 🌸 荷花背景图 + 霓虹发光效果
- 🔥 炫酷的彩虹渐变大标题动画
- ✨ 小标题带流光特效
- 📱 完全适配手机端，滑动流畅无卡顿
- ⭐ 6个等级选择：行、可以、很好、非常好、十分好、宇宙大爆炸的好
- 💬 实时评价展示，支持回车提交
- 🔄 3秒自动刷新，所有人实时看到最新评价
- 💾 数据存储在Supabase数据库（可配置）
- 🎨 评价卡片带彩虹边框和闪光动画
- 📜 评价列表支持吸附滚动

## 快速开始

### 1. 本地运行

直接打开 `index.html` 文件即可预览（使用本地存储，自带30条默认评价）。

### 2. 部署到GitHub Pages（免费）

1. 创建GitHub账号：https://github.com/signup
2. 创建新仓库，仓库名建议：`qi-xiu-15-class`
3. 上传所有文件（index.html, style.css, app.js, supabase.sql, README.md）
4. 进入 Settings → Pages
5. Source 选择 main branch，保存
6. 等待1-2分钟，访问 `https://你的用户名.github.io/qi-xiu-15-class`

**重要：** GitHub Pages 是静态网站托管，只能前端运行。如果要实现多人实时共享评价，需要配置 Supabase。

### 3. 配置Supabase（可选，实现多人实时共享）

1. 访问 [supabase.com](https://supabase.com) 注册账号（免费）
2. 创建新项目
3. 进入 SQL Editor，执行 `supabase.sql` 文件中的代码
4. 在项目 Settings → API 中获取：
   - Project URL（类似 https://xxxxx.supabase.co）
   - anon/public key
5. 在 [app.js](file:///c:/Users/35435/Documents/2/app.js) 第3-4行替换：
   ```javascript
   const CONFIG = {
       SUPABASE_URL: '你的项目URL',
       SUPABASE_ANON_KEY: '你的anon key'
   };
   ```
6. 重新部署到GitHub Pages

### 4. 使用Vercel部署（推荐，免费+更快）

1. 推送代码到GitHub仓库
2. 访问 [vercel.com](https://vercel.com) 注册
3. 点击 "Add New..." → "Project"
4. 导入你的GitHub仓库
5. 点击 "Deploy"
6. 获得专属域名：`https://你的项目名.vercel.app`

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 主页面结构 |
| `style.css` | 样式和动画（霓虹、彩虹、闪光效果） |
| `app.js` | 功能逻辑和默认评价数据 |
| `supabase.sql` | 数据库建表语句（可选） |
| `README.md` | 本说明文档 |

## 注意事项

- 手机上输入框字号设为16px，防止iOS自动缩放
- 使用 `-webkit-overflow-scrolling: touch` 保证滑动流畅
- 所有动画都使用 GPU 加速的 CSS transform
- Supabase 每3秒轮询一次，确保多人实时查看
- 评价列表有吸附滚动效果，滑一下自动对齐

