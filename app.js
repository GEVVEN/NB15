// 配置 - 纯本地存储模式
const CONFIG = {
    LOCAL_STORAGE_KEY: 'qiuxiu15_reviews'
};

// 数据变量
let reviews = [];
let pollingInterval = null;

// 默认评价数据（30条炫彩娱乐评价）
const DEFAULT_REVIEWS = [
    { level: "🚀", message: "汽修十五班牛逼666，发动机都能修出火箭推进器！", time: "刚刚" },
    { level: "💯", message: "这班谁上的谁发财，修车技术比F1赛车手还厉害", time: "1分钟前" },
    { level: "🌟", message: "十五班的同学个个都是技术流，扳手一挥天下无敌", time: "2分钟前" },
    { level: "🚀", message: "别人修车靠经验，我们修车靠实力，十五班永远的神！", time: "3分钟前" },
    { level: "✨", message: "汽修十五班：修得了奔驰宝马，还能修好你的人生", time: "5分钟前" },
    { level: "💯", message: "这技术，这水平，这班不上对不起自己的良心", time: "8分钟前" },
    { level: "🚀", message: "十五班一出，谁与争锋？汽修界的天花板！", time: "10分钟前" },
    { level: "🌟", message: "师傅说我们是最强的，我信了，真的不信不行", time: "12分钟前" },
    { level: "✨", message: "修车不行的汽修工不是好司机，十五班全体达标", time: "15分钟前" },
    { level: "💯", message: "以后修车就找十五班，保证让你心服口服", time: "18分钟前" },
    { level: "🚀", message: "十五班的同学，左手扳手右手图纸，气质这一块拿捏得死死的", time: "20分钟前" },
    { level: "🌟", message: "这手艺，这态度，这班风，不得不服", time: "25分钟前" },
    { level: "✨", message: "汽修十五班：让每一辆车都重新焕发第二春", time: "30分钟前" },
    { level: "💯", message: "别人家的孩子修车，我家孩子修的是梦想", time: "35分钟前" },
    { level: "🚀", message: "十五班不一般，修车修到国外去，丰田本田都得服", time: "40分钟前" },
    { level: "🌟", message: "这手艺，这水平，这态度，满分120我们考220", time: "45分钟前" },
    { level: "✨", message: "汽修十五班，yyds，永远不会过时！", time: "50分钟前" },
    { level: "💯", message: "老师傅看了都点赞，说这帮孩子有前途", time: "55分钟前" },
    { level: "🚀", message: "十五班的同学，修车的时候最帅，没有之一", time: "1小时前" },
    { level: "🌟", message: "这技术，这专业，这态度，没谁了，牛！", time: "1小时前" },
    { level: "✨", message: "汽修十五班：不是所有汽修班都叫十五班", time: "2小时前" },
    { level: "💯", message: "同学们太给力了，修车修出了国际水平", time: "2小时前" },
    { level: "🚀", message: "这手艺，这效率，这配合，简直是汽修界的梦之队", time: "3小时前" },
    { level: "🌟", message: "十五班一出，谁与争锋？修车界的就是硬气", time: "3小时前" },
    { level: "✨", message: "修车找十五班，保你满意笑开颜", time: "4小时前" },
    { level: "💯", message: "这技术流，这操作秀，我直接给跪了", time: "4小时前" },
    { level: "🚀", message: "汽修十五班，未来的汽车大师都在这里！", time: "5小时前" },
    { level: "🌟", message: "同学们太猛了，修车修出了黑科技的感觉", time: "6小时前" },
    { level: "✨", message: "十五班的同学，个个都是技术大牛，未来可期", time: "8小时前" },
    { level: "💯", message: "这班，这技术，这氛围，绝了绝了绝了！", time: "10小时前" }
];

// 创建飘落花瓣效果
function createPetalParticles() {
    const container = document.getElementById('petalsContainer');
    if (!container) return;
    const petalTypes = ['🌸', '🌺', '🌹', '💮', '🏵️', '✿'];
    
    for (let i = 0; i < 12; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.textContent = petalTypes[Math.floor(Math.random() * petalTypes.length)];
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 10 + 15) + 's';
        petal.style.animationDelay = (Math.random() * 10) + 's';
        petal.style.fontSize = (Math.random() * 15 + 15) + 'px';
        container.appendChild(petal);
    }
}

// 初始化
function init() {
    createPetalParticles();
    setupLandingPage();
    setupEventListeners();
    loadReviews();
}

// 设置首页和进入按钮
function setupLandingPage() {
    const enterBtn = document.getElementById('enterBtn');
    const landingPage = document.getElementById('landingPage');
    const mainContent = document.getElementById('mainContent');
    
    enterBtn.addEventListener('click', () => {
        landingPage.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => {
            landingPage.style.display = 'none';
            mainContent.style.display = 'block';
            loadReviews();
            startPolling();
        }, 500);
    });
    
    // 添加淡出动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// 设置事件监听
function setupEventListeners() {
    const messageInput = document.getElementById('messageInput');
    const charCount = document.getElementById('charCount');
    
    messageInput.addEventListener('input', () => {
        const len = messageInput.value.length;
        charCount.textContent = `${len}/200`;
        
        if (len > 180) {
            charCount.style.color = '#ff6b6b';
        } else {
            charCount.style.color = '';
        }
    });
    
    // 提交评价
    document.getElementById('submitBtn').addEventListener('click', handleSubmit);
    
    // 回车提交
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    });
}

// 提交评价
async function handleSubmit() {
    const levelSelect = document.getElementById('levelSelect');
    const messageInput = document.getElementById('messageInput');
    const submitBtn = document.getElementById('submitBtn');
    
    const level = levelSelect.value;
    const message = messageInput.value.trim();
    
    if (!message) {
        showMessage('请输入评价内容', 'error');
        messageInput.focus();
        return;
    }
    
    // 禁用按钮
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span>';
    
    try {
        // 保存到本地
        saveLocalReview({ level, message });
        
        // 清空输入
        messageInput.value = '';
        document.getElementById('charCount').textContent = '0/200';
        
        // 刷新评价列表
        loadReviews();
        
        showMessage('评价发送成功！', 'success');
    } catch (error) {
        console.error('提交失败:', error);
        showMessage('发送失败，请重试', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '发送评价';
    }
}

// 加载评价
function loadReviews() {
    try {
        reviews = getLocalReviews();
        
        // 如果本地没有数据，加载默认评价
        if (reviews.length === 0) {
            reviews = DEFAULT_REVIEWS.map(r => ({
                level: r.level,
                message: r.message,
                created_at: new Date().toISOString()
            }));
            saveLocalReviews(reviews);
        }
        
        renderReviews();
    } catch (error) {
        console.error('加载评价失败:', error);
    }
}

// 渲染评价列表
function renderReviews() {
    const reviewsList = document.getElementById('reviewsList');
    const reviewCount = document.getElementById('reviewCount');
    
    reviewCount.textContent = `共 ${reviews.length} 条评价`;
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="empty-state">
                <p>还没有评价，快来抢沙发吧！🎉</p>
            </div>
        `;
        return;
    }
    
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <span class="review-level">${review.level}</span>
                <span class="review-time">${formatTime(review.created_at)}</span>
            </div>
            <div class="review-content">${escapeHtml(review.message)}</div>
        </div>
    `).join('');
}

// 格式化时间
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
    if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';
    
    return date.toLocaleDateString('zh-CN');
}

// 转义HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 显示消息提示
function showMessage(text, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 9999;
        animation: slideDown 0.3s ease;
        ${type === 'success' ? 'background: #48dbfb; color: #0a0a1a;' : 
          type === 'error' ? 'background: #ff6b6b; color: white;' : 
          'background: rgba(255,255,255,0.9); color: #333;'}
    `;
    toast.textContent = text;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// 本地存储相关
function saveLocalReview(review) {
    const existing = getLocalReviews();
    existing.unshift(review);
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(existing));
}

function getLocalReviews() {
    const data = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// 保存所有评价
function saveLocalReviews(list) {
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(list));
}

// 轮询更新
function startPolling() {
    pollingInterval = setInterval(() => {
        loadReviews();
    }, 3000);
}

// 启动应用
init();

// 调试输出
console.log('页面加载完成');
console.log('默认评价数量:', DEFAULT_REVIEWS.length);
console.log('当前存储评价数量:', getLocalReviews().length);
