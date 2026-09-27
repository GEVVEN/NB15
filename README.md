# 几个字汽修15班 - 评价墙

一个炫酷的班级评价墙网站，带有星空背景和彩虹特效。

## 功能特性

- ✨ 炫酷的星空背景和彩虹渐变标题动画
- 📱 完全适配手机端，滑动流畅无卡顿
- ⭐ 6个等级选择：行、可以、很好、非常好、十分好、宇宙大爆炸的好
- 💬 实时评价展示，支持回车提交
- 🔄 3秒自动刷新，所有人实时看到最新评价
- 💾 数据存储在Supabase数据库

## 快速开始

### 1. 本地运行

直接打开 `index.html` 文件即可预览（使用本地存储）。

### 2. 配置Supabase（推荐）

1. 访问 [supabase.com](https://supabase.com) 注册账号
2. 创建新项目
3. 进入 SQL Editor，执行 `supabase.sql` 文件中的代码
4. 在项目 Settings → API 中获取：
   - Project URL
   - anon/public key
5. 在 `app.js` 中替换：
   ```javascript
   const CONFIG = {
       SUPABASE_URL: '你的项目URL',
       SUPABASE_ANON_KEY: '你的anon key'
   };
   ```

### 3. 部署到GitHub Pages

1. 创建GitHub仓库
2. 上传所有文件
3. 进入 Settings → Pages
4. Source 选择 main branch，保存
5. 等待1-2分钟，访问 `https://你的用户名.github.io/仓库名`

## 文件说明

- `index.html` - 主页面结构
- `style.css` - 样式和动画
- `app.js` - 功能和交互逻辑
- `supabase.sql` - 数据库建表语句
- `README.md` - 本说明文档

## 注意事项

- 手机上输入框字号设为16px，防止iOS自动缩放
- 使用 `-webkit-overflow-scrolling: touch` 保证滑动流畅
- 所有动画都使用 GPU 加速的 CSS transform
- Supabase 每3秒轮询一次，确保多人实时查看
