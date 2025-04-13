// calendar.js
let holidays = {};

const baseDate = new Date("2025-01-06"); // 基准双休周（周一）

function isDoubleRestWeek(date) {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  const diff = Math.floor((startOfWeek - baseDate) / msPerWeek);
  return diff % 2 === 0;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

async function fetchHolidays(year) {
  const res = await fetch(`https://timor.tech/api/holiday/year/${year}`);
  const data = await res.json();
  holidays = {};
  for (const key in data.holiday) {
    const fullDate = data.holiday[key].date;
    holidays[fullDate] = data.holiday[key];
  }
}

let currentDate = new Date();

async function renderCalendar(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const todayStr = formatDate(new Date());

  await fetchHolidays(year);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const container = document.getElementById("calendar");
  container.innerHTML = `
    <div class="calendar-header">
      <button id="prevMonth">&lt;</button>
      ${year}年${month + 1}月
      <button id="nextMonth">&gt;</button>
    </div>
  `;

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  weekdays.forEach(day => {
    const cell = document.createElement("div");
    cell.textContent = day;
    cell.className = "calendar-cell weekday";
    grid.appendChild(cell);
  });

  for (let i = 0; i < firstDay; i++) {
    grid.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const thisDate = new Date(year, month, d);
    const day = thisDate.getDay();
    const dateStr = formatDate(thisDate);
    const cell = document.createElement("div");
    cell.className = "calendar-cell";
    cell.textContent = d;

    const isToday = dateStr === todayStr;
    const doubleRest = isDoubleRestWeek(thisDate);
    const isWeekend = doubleRest ? (day === 0 || day === 6) : (day === 0 || (day === 6 && false));

    if (holidays[dateStr]) {
      cell.classList.add("holiday-public");
      const label = document.createElement("div");
      label.className = "holiday-label";
      label.textContent = holidays[dateStr].name || "假";
      cell.appendChild(label);
    } else if (isWeekend) {
      cell.classList.add("holiday-weekend");
    }

    if (isToday) {
      cell.classList.add("today");
    }

    grid.appendChild(cell);
  }

  container.appendChild(grid);

  document.getElementById("prevMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  };
  document.getElementById("nextMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  };
}

renderCalendar();