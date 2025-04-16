// work.js

const navItems = [
  { name: "Ahlson", href: "http://8.130.64.208", icon: "favicon/favicon.ico" },
  { name: "LZWL", href: "https://lzwl.yolo880.cn/index", icon: "favicon/work.ico" },
  { name: "ALive", href: "https://www.szalive.com/aliveplatform/index.html#/login", icon: "favicon/szalive.ico" },
  { name: "Dueros", href: "https://dueros.baidu.com/business/emp/view/project/list", icon: "favicon/dueros.ico" },
  { name: "玉泉平台", href: "https://yuquan.xiezhuwang.com/login", icon: "favicon/work.ico" },
  { name: "酒馆", href: "https://console.xiezhuwang.com/Account/Login", icon: "favicon/work.ico" },
  { name: "潘多拉", href: "http://pandoracfg.xiezhuwang.com/Account/Login", icon: "favicon/work.ico" },
  { name: "涂鸦", href: "https://gsmart-hotel.iotwish.com/login", icon: "favicon/work.ico" },
  
  
  { name: "Alist", href: "http://8.130.64.208:5002", icon: "favicon/alisst.svg" },
  { name: "Translate", href: "https://fanyi.baidu.com/", icon: "favicon/translate.ico" },
  { name: "Douyin", href: "https://www.douyin.com/user/MS4wLjABAAAAS6LTta1Q5qiDVIgJbcOmFJP45KrtfZ5JrQ1qB1K1tMWQh642KY4feikZXgbkpSM8?from_tab_name=main", icon: "favicon/douyin.png" },
  { name: "BiliBili", href: "https://space.bilibili.com/396913123", icon: "favicon/bilibili.ico" },
  { name: "Spotify", href: "https://open.spotify.com/user/31keo23jnkoqd5ctrbmrm5nailkq?si=XtQFg9baT7mAn9b_8_zQ8w", icon: "favicon/Spotify.png" },
  { name: "YouTube", href: "https://www.youtube.com/", icon: "favicon/YouTube.png" },
  { name: "ChatGPT", href: "https://chatgpt.com/", icon: "favicon/ChatGPT.ico" },
  { name: "DeepSeek", href: "https://chat.deepseek.com/", icon: "favicon/deepseek.svg" },
];

function renderNav() {
  const container = document.getElementById("navContainer");
  navItems.forEach(item => {
    const card = document.createElement("a");
    card.className = "nav-card";
    card.href = item.href;
    card.target = "_blank";
    card.innerHTML = `<img src="${item.icon}" alt="icon" /><span>${item.name}</span>`;
    container.appendChild(card);
  });
}

function handleSearch(event) {
  event.preventDefault();
  const engine = document.getElementById("engine").value;
  const query = document.getElementById("searchInput").value.trim();
  if (query) window.open(engine + encodeURIComponent(query), "_blank");
}

const workStart = [8, 0];
const workEnd = [17, 30];
const startWeekDate = new Date("2024-12-27");
function isRestDay(date) {
  const day = date.getDay();
  const weekNum = Math.floor((date - startWeekDate) / (7 * 86400000));
  const isDouble = weekNum % 2 === 1;
  return day === 0 || (day === 6 && isDouble);
}

function updateCountdown(now = new Date()) {
  const end = new Date(now);
  end.setHours(workEnd[0], workEnd[1], 0, 0);
  const countdownTime = document.getElementById("countdownTime");
  if (isRestDay(now)) {
    document.getElementById("countdownTitle").textContent = "今天休息 😎";
    countdownTime.innerHTML = "";
    return;
  }
  if (now >= end) {
    document.getElementById("countdownTitle").textContent = "今天已经下班啦！🎉";
    countdownTime.innerHTML = "";
    return;
  }
  const diff = end - now;
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  countdownTime.textContent = `${hours}小时 ${minutes}分 ${seconds}秒`;
}

function updateClock() {
  const now = new Date();
  const hour = now.getHours() % 12;
  const minute = now.getMinutes();
  const second = now.getSeconds();
  const millisecond = now.getMilliseconds();
  document.querySelector(".hand.hour").style.transform = `rotate(${hour * 30 + minute * 0.5}deg)`;
  document.querySelector(".hand.minute").style.transform = `rotate(${minute * 6 + second * 0.1}deg)`;
  document.querySelector(".hand.second").style.transform = `rotate(${second * 6 + millisecond * 0.006}deg)`;
  document.getElementById("digitalClock").textContent =
    `${String(now.getHours()).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
  updateCountdown(now);
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
}

function animate() {
  updateClock();
  requestAnimationFrame(animate);
}

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function changeMonth(direction) {
  currentMonth += direction;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentYear, currentMonth);  // 更新日历
}

function renderCalendar(year, month) {
  const grid = document.getElementById("calendarGrid");
  const label = document.getElementById("calendarMonthYear");
  grid.innerHTML = "";
  const days = ["日", "一", "二", "三", "四", "五", "六"];
  days.forEach(d => {
    const el = document.createElement("div");
    el.style.fontWeight = "bold";
    el.textContent = d;
    grid.appendChild(el);
  });
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);
  const lastDay = lastDate.getDay();
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  let day = 1;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      const el = document.createElement("div");
      if (i === 0 && j < firstDay.getDay()) {
        el.textContent = prevMonthLastDate - firstDay.getDay() + j + 1;
        el.style.color = "#ccc";
      } else if (day <= lastDate.getDate()) {
        el.textContent = day++;
        const currentDate = new Date(year, month, el.textContent);
        if (currentDate.getDate() === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear()) {
          el.classList.add("today");
        } else if (isRestDay(currentDate)) {
          el.classList.add("rest");
        }
      } else {
        el.style.visibility = "hidden";
      }
      grid.appendChild(el);
    }
  }
  label.textContent = `${year}年${month + 1}月`;
}

function isRestDay(date) {
  const day = date.getDay();
  const weekNum = Math.floor((date - startWeekDate) / (7 * 86400000));
  const isDouble = weekNum % 2 === 1;
  return day === 0 || (day === 6 && isDouble);
}


    renderNav();
    initTheme();
    renderCalendar(new Date().getFullYear(), new Date().getMonth());
    animate();
