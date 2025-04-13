// index.js
const defaultCards = [
  // 系统 & 服务
  { name: "Baota", href: "https://8.130.64.208:5001/ahlson", icon: "../favicon/baota.ico" },
  { name: "Qinglong", href: "http://8.130.64.208:5003", icon: "../favicon/qinglong.svg" },
  { name: "Home Assistant", href: "http://8.130.64.208:5006", icon: "../favicon/HomeAssistant.ico" },
  { name: "Ward", href: "http://8.130.64.208:5007", icon: "../favicon/ward.ico" },

  // 文件管理 & 下载
  { name: "Alist", href: "http://8.130.64.208:5002", icon: "../favicon/alisst.svg" },
  { name: "Kodbox", href: "http://8.130.64.208:5008", icon: "../favicon/kodbox.ico" },
  { name: "AriaNg", href: "http://8.130.64.208:5005", icon: "../favicon/ariang.png" },
  { name: "frps dashboard", href: "http://8.130.64.208:7500", icon: "../favicon/frp.ico" },
  // 社交 & 娱乐
  { name: "Douyin", href: "https://www.douyin.com/user/MS4wLjABAAAAS6LTta1Q5qiDVIgJbcOmFJP45KrtfZ5JrQ1qB1K1tMWQh642KY4feikZXgbkpSM8?from_tab_name=main", icon: "../favicon/douyin.png" },
  { name: "BiliBili", href: "https://space.bilibili.com/396913123", icon: "../favicon/bilibili.ico" },
  { name: "Spotify", href: "https://open.spotify.com/user/31keo23jnkoqd5ctrbmrm5nailkq?si=XtQFg9baT7mAn9b_8_zQ8w", icon: "../favicon/Spotify.png" },
  { name: "YouTube", href: "https://www.youtube.com/", icon: "../favicon/YouTube.png" },

  // 开发 & 学习
  { name: "GItHub", href: "https://github.com/OfSong", icon: "../favicon/GitHub.png" },
  { name: "Gitee", href: "https://gitee.com/Ahlson", icon: "../favicon/gitee.ico" },
  { name: "CSDN", href: "https://blog.csdn.net/m0_62518864", icon: "../favicon/CSDN.ico" },
  { name: "ChatGPT", href: "https://chatgpt.com/", icon: "../favicon/ChatGPT.ico" },

  //   其它

  { name: "frp client", href: "http://8.130.64.208:5000", icon: "../favicon/frp.ico" },
  { name: "Aliyun", href: "https://ecs.console.aliyun.com/server/", icon: "../favicon/aliyun.ico" },
  { name: "iCloud", href: "https://www.icloud.com/", icon: "../favicon/iCould.png" },
  { name: "Time", href: "./time.html", icon: "../favicon/time.png" },
  { name: "hifini", href: "https://hifini.com/", icon: "../favicon/hifini.png" }

];


  function renderCards(cards) {
    const container = document.getElementById("cards");
    container.innerHTML = "";
    cards.forEach(item => {
      const div = document.createElement("div");
      div.className = "card";
      div.onclick = () => window.open(item.href, "_blank");
      div.innerHTML = `
        <div class="icon"><img src="${item.icon}" alt="${item.name}" /></div>
        <div class="name">${item.name}</div>
      `;
      container.appendChild(div);
    });
  }

  function checkLoginStatus() {
    const savedTime = localStorage.getItem("loginTime");
    const oneDay = 24 * 60 * 60 * 1000;
    if (savedTime && Date.now() - savedTime < oneDay) {
      showDashboard();
    } else {
      localStorage.removeItem("loginTime");
      document.getElementById("login").classList.add("active");
      document.getElementById("password").focus();
    }
  }

  // 回车登录
  document.getElementById("password").addEventListener("keydown", function(e) {
    if (e.key === "Enter") checkPassword();
  });

  window.onload = checkLoginStatus;

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

// JS 放在页面底部
function applyTheme(mode) {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
  localStorage.setItem('theme', mode);
}

document.getElementById('themeToggle').addEventListener('click', () => {
  const isDark = document.documentElement.classList.contains('dark-mode');
  applyTheme(isDark ? 'light' : 'dark');
});

// 初始加载时检测系统或本地设置
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
})();

function checkPassword() {
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");
  if (password === "song") {
    localStorage.setItem("loginTime", Date.now());
    showDashboard();
  } else {
    error.textContent = "密码错误，请重试。";
  }
}
