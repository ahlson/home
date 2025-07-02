// index.js
const defaultCards = [
  // ✅ 系统 & 服务
  { name: "Baota", href: "https://192.168.4.17:14312/ahlson", icon: "favicon/baota.ico" },
  { name: "Qinglong", href: "http://192.168.4.17:15700", icon: "favicon/qinglong.svg" },
  { name: "Home Assistant", href: "http://192.168.4.74:8123", icon: "favicon/HomeAssistant.ico" },
  { name: "Aliyun", href: "https://ecs.console.aliyun.com/server/", icon: "favicon/aliyun.ico" },
  { name: "Ward", href: "http://192.168.4.17:4000", icon: "favicon/ward.png" },
  { name: "frps dashboard", href: "http://8.130.64.208:7500", icon: "favicon/frp.ico" },
  { name: "frp client", href: "http://8.130.64.208:5000", icon: "favicon/frp.ico" },

  // ✅ 文件管理 & 下载
  { name: "Alist", href: "http://192.168.4.17:15244", icon: "favicon/alisst.svg" },
  { name: "Kodbox", href: "http://192.168.4.17:8080", icon: "favicon/kodbox.ico" },
  { name: "AriaNg", href: "http://192.168.4.17:6880", icon: "favicon/ariang.png" },
  { name: "Aliyun Drive", href: "https://www.aliyundrive.com/drive", icon: "favicon/aliyundrive.ico" },
  { name: "Baidu Netdisk", href: "https://pan.baidu.com/", icon: "favicon/baiduyun.ico" },
  { name: "Quark Drive", href: "https://pan.quark.cn/", icon: "favicon/quark.icon" },
  { name: "iCloud", href: "https://www.icloud.com/", icon: "favicon/iCould.png" },

  // ✅ 社交 & 娱乐
  { name: "Douyin", href: "https://www.douyin.com/user/MS4wLjABAAAAS6LTta1Q5qiDVIgJbcOmFJP45KrtfZ5JrQ1qB1K1tMWQh642KY4feikZXgbkpSM8?from_tab_name=main", icon: "favicon/douyin.png" },
  { name: "BiliBili", href: "https://space.bilibili.com/396913123", icon: "favicon/bilibili.ico" },
  { name: "Spotify", href: "https://open.spotify.com/user/31keo23jnkoqd5ctrbmrm5nailkq?si=XtQFg9baT7mAn9b_8_zQ8w", icon: "favicon/Spotify.png" },
  { name: "163music", href: "https://music.163.com/#/playlist?id=2249483798", icon: "favicon/163music.ico" },
  { name: "YouTube", href: "https://www.youtube.com/", icon: "favicon/YouTube.png" },
  { name: "Tencent Video", href: "https://v.qq.com/", icon: "favicon/tencentvideo.ico" },
  { name: "iQIYI", href: "https://www.iqiyi.com/", icon: "favicon/iqiyi.ico" },
  
  // ✅ 开发 & 学习
  { name: "GItHub", href: "https://github.com/ahlson", icon: "favicon/GitHub.png" },
  { name: "Gitee", href: "https://gitee.com/Ahlson", icon: "favicon/gitee.ico" },
  { name: "CSDN", href: "https://blog.csdn.net/m0_62518864", icon: "favicon/CSDN.ico" },
  { name: "Linux Do", href: "https://linux.do/", icon: "favicon/linuxdo.png" },
  { name: "Docker", href: "https://www.docker.com/", icon: "favicon/docker.svg" },
  { name: "ChatGPT", href: "https://chatgpt.com/", icon: "favicon/ChatGPT.ico" },
  { name: "DeepSeek", href: "https://chat.deepseek.com/", icon: "favicon/deepseek.svg" },
  { name: "DouBao", href: "https://www.doubao.com/chat/", icon: "https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/web/logo-icon.png" },
  
  // ✅ 学习
  { name: "Mooc", href: "https://www.icourse163.org/", icon: "favicon/mooc.png" },
  
  // ✅ 其它工具 & 站点
  { name: "Apple", href: "https://www.apple.com/", icon: "favicon/apple.ico" },
  { name: "hifini", href: "https://hifini.com/", icon: "favicon/hifini.png" },
  { name: "Translate", href: "https://fanyi.baidu.com/", icon: "favicon/translate.ico" },
  { name: "Work", href: "./work.html", icon: "favicon/time.png" },
];
// 渲染卡片
const cardsContainer = document.getElementById('cards');
defaultCards.forEach(card => {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.innerHTML = `
    <div class="icon"><img src="${card.icon}" alt="${card.name}" /></div>
    <div class="name">${card.name}</div>
  `;
  cardElement.onclick = () => window.open(card.href, '_blank');
  cardsContainer.appendChild(cardElement);
});

// 主题切换
const themeToggle = document.getElementById('themeToggle');
themeToggle.onclick = () => {
  document.body.classList.toggle('dark-mode');
  const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
};

// 加载主题
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
}

// 禁用右键
document.addEventListener('contextmenu', event => event.preventDefault());

// 禁用F12、Ctrl+Shift+I、Ctrl+U等
document.onkeydown = function (e) {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
    (e.ctrlKey && e.key === "U")
  ) {
    return false;
  }
};