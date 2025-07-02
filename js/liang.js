// index.js
const defaultCards = [
  { name: "Douyin", href: "https://www.douyin.com/", icon: "favicon/douyin.png" },
  { name: "BiliBili", href: "https://space.bilibili.com/", icon: "favicon/bilibili.ico" },
  { name: "Tencent Video", href: "https://v.qq.com/", icon: "favicon/tencentvideo.ico" },
  { name: "iQIYI", href: "https://www.iqiyi.com/", icon: "favicon/iqiyi.ico" },

  { name: "Translate", href: "https://fanyi.baidu.com/", icon: "favicon/translate.ico" },
  { name: "DeepSeek", href: "https://chat.deepseek.com/", icon: "favicon/deepseek.svg" },
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