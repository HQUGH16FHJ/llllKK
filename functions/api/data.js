// GET /api/data - 获取站点数据（公开）
export async function onRequestGet(context) {
  try {
    const { SITE_DATA } = context.env;

    // 从 KV 读取数据
    let data = await SITE_DATA.get('site_data', 'json');

    // 如果 KV 中没有数据，初始化默认数据
    if (!data) {
      data = getDefaultData();
      await SITE_DATA.put('site_data', JSON.stringify(data));
    }

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST /api/data - 保存站点数据（需要管理员密码）
export async function onRequestPost(context) {
  try {
    const { SITE_DATA, ADMIN_PASSWORD } = context.env;

    // 从请求头获取密码
    const password = context.request.headers.get('X-Admin-Password');

    // 验证密码
    if (!password || password !== ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: '密码错误' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 读取请求体
    const newData = await context.request.json();

    if (!newData || typeof newData !== 'object') {
      return new Response(
        JSON.stringify({ error: '数据格式错误' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 保存到 KV
    await SITE_DATA.put('site_data', JSON.stringify(newData));

    return new Response(
      JSON.stringify({ success: true, message: '保存成功' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// OPTIONS 预检
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    },
  });
}

// ==================== 默认数据 ====================
function getDefaultData() {
  return {
    profile: {
      name: '刘骐硕',
      title: '生活记录者 / 创作者',
      bio: '热爱生活，喜欢用镜头和文字记录美好瞬间。在光影与旋律之间，寻找属于自己的表达方式。',
      avatar: '',
      location: '中国',
      douyin: '@刘骐硕',
      email: '3401049114@qq.com',
    },
    photos: [
      { id: 1, title: '城市黄昏', location: '河南省登封市', coordinates: '34.458°N, 113.038°E', category: '城市', date: '2024-08-15', description: '夕阳下的城市剪影', image: 'https://picsum.photos/seed/photo1/800/600' },
      { id: 2, title: '山间晨雾', location: '河南省郑州市', coordinates: '34.747°N, 113.625°E', category: '自然', date: '2024-07-22', description: '清晨的山间薄雾缭绕', image: 'https://picsum.photos/seed/photo2/800/1000' },
      { id: 3, title: '星空银河', location: '河南省洛阳市', coordinates: '34.619°N, 112.454°E', category: '星空', date: '2024-06-10', description: '夏日银河拱桥', image: 'https://picsum.photos/seed/photo3/900/600' },
      { id: 4, title: '古街小巷', location: '河南省开封市', coordinates: '34.797°N, 114.307°E', category: '人文', date: '2024-05-18', description: '历史悠久的古街韵味', image: 'https://picsum.photos/seed/photo4/700/900' },
      { id: 5, title: '湖畔倒影', location: '河南省登封市', coordinates: '34.458°N, 113.038°E', category: '自然', date: '2024-04-05', description: '湖面如镜，倒映天空', image: 'https://picsum.photos/seed/photo5/800/600' },
      { id: 6, title: '云海日出', location: '河南省焦作市', coordinates: '35.217°N, 113.237°E', category: '自然', date: '2024-03-20', description: '山顶云海与日出交相辉映', image: 'https://picsum.photos/seed/photo6/1000/700' },
    ],
    music: [
      { id: 1, title: '夜曲', artist: '周杰伦', album: '十一月的萧邦', cover: 'https://picsum.photos/seed/music1/200/200', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { id: 2, title: '晴天', artist: '周杰伦', album: '叶惠美', cover: 'https://picsum.photos/seed/music2/200/200', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      { id: 3, title: '稻香', artist: '周杰伦', album: '魔杰座', cover: 'https://picsum.photos/seed/music3/200/200', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    ],
    posts: [
      { id: 1, title: '我与摄影的故事', excerpt: '从一台手机开始，到现在成为我生活中不可或缺的一部分...', content: '<p>我与摄影的缘分，始于一台普通的智能手机。</p><h3>初入光影世界</h3><p>记得第一次认真拍照是在高中时期。当我后来翻看那张照片时，突然意识到——原来生活中处处都是美景。</p>', date: '2024-09-01', category: '生活随笔', cover: 'https://picsum.photos/seed/blog1/800/500', readTime: '5 分钟' },
      { id: 2, title: '一个人的旅行', excerpt: '独自踏上旅途，用镜头记录下每一个陌生城市的独特韵味...', content: '<p>有人说，一个人的旅行是与自己对话最好的方式。</p><h3>出发的勇气</h3><p>第一次独自旅行是在大二的暑假。背上相机，坐上绿皮火车。</p>', date: '2024-08-15', category: '旅行日志', cover: 'https://picsum.photos/seed/blog2/800/500', readTime: '8 分钟' },
      { id: 3, title: '记录生活的意义', excerpt: '为什么我们要拍照、写文字？也许这就是答案...', content: '<p>我们记录，是因为我们害怕遗忘。</p><h3>那些被留住的瞬间</h3><p>每一张照片，每一段文字，都是时间的标本。</p>', date: '2024-07-20', category: '生活随笔', cover: 'https://picsum.photos/seed/blog3/800/500', readTime: '6 分钟' },
    ],
    portfolio: [
      { id: 1, title: '摄影作品集 · 城市光影', category: '摄影', description: '城市街头的光影记录，捕捉都市生活的瞬间', cover: 'https://picsum.photos/seed/port1/800/600', link: '#', date: '2024' },
      { id: 2, title: '个人博客网站', category: '网站', description: 'Cloudflare + React 构建的个人博客', cover: 'https://picsum.photos/seed/port2/800/600', link: '#', date: '2024' },
      { id: 3, title: '旅行摄影 · 山河湖海', category: '摄影', description: '记录旅途中遇见的壮丽自然风光', cover: 'https://picsum.photos/seed/port3/800/600', link: '#', date: '2023' },
      { id: 4, title: '文案创作合集', category: '文案', description: '品牌文案、公众号文章、随笔散文精选', cover: 'https://picsum.photos/seed/port4/800/600', link: '#', date: '2023' },
    ],
    socials: [
      { id: 1, name: '抖音', icon: '🎵', url: 'https://www.douyin.com/user/MS4wLjABAAAAQrS2BXoi_LMZyjFMscF85V4tYdFjWdooyw88eHOiPew?from_tab_name=main', handle: '@刘骐硕' },
      { id: 2, name: '邮箱', icon: '✉', url: 'mailto:3401049114@qq.com', handle: '3401049114@qq.com' },
    ],
  };
}
