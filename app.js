// 配置
const CONFIG = {
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-anon-key'
};

// Supabase客户端
let supabase = null;
let reviews = [];
let pollingInterval = null;

// 初始化
async function init() {
    createStars();
    setupEventListeners();
    
    // 尝试连接Supabase
    try {
        const supabaseModule = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
        supabase = supabaseModule.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
        await loadReviews();
        startPolling();
    } catch (error) {
        console.log('使用本地模式');
        loadLocalReviews();
    }
}

// 创建星空背景
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = window.innerWidth < 768 ? 50 : 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
        star.style.animationDelay = Math.random() * 5 + 's';
        starsContainer.appendChild(star);
    }
}

// 设置事件监听
function setupEventListeners() {
    const messageInput = document.getElementById('messageInput');
    const charCount = document.getElementById('charCount');
    const submitBtn = document.getElementById('submitBtn');
    
    // 输入字数统计
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
    submitBtn.addEventListener('click', handleSubmit);
    
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
        if (supabase) {
            // 保存到Supabase
            const { error } = await supabase
                .from('reviews')
                .insert([{
                    level: level,
                    message: message,
                    created_at: new Date().toISOString()
                }]);
            
            if (error) throw error;
        } else {
            // 保存到本地
            saveLocalReview({ level, message });
        }
        
        // 清空输入
        messageInput.value = '';
        document.getElementById('charCount').textContent = '0/200';
        
        // 刷新评价列表
        await loadReviews();
        
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
async function loadReviews() {
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            reviews = data || [];
        } else {
            reviews = getLocalReviews();
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

// 显示消息
function showMessage(text, type = 'info') {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 0.95rem;
        z-index: 1000;
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
    localStorage.setItem('reviews', JSON.stringify(existing));
}

function getLocalReviews() {
    const data = localStorage.getItem('reviews');
    return data ? JSON.parse(data) : [];
}

function loadLocalReviews() {
    reviews = getLocalReviews();
    renderReviews();
}

// 轮询更新
function startPolling() {
    pollingInterval = setInterval(() => {
        loadReviews();
    }, 3000); // 每3秒检查一次新评价
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 启动应用
init();
