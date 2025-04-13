// time.js
function updateClock() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const beijing = new Date(utc + 8 * 3600000); // 强制 UTC+8

  const hour = beijing.getHours() % 12;
  const minute = beijing.getMinutes();
  const second = beijing.getSeconds();

  const hourDeg = (hour + minute / 60) * 30;
  const minuteDeg = (minute + second / 60) * 6;
  const secondDeg = second * 6;

  document.querySelector('.hand.hour').style.transform = `rotate(${hourDeg}deg)`;
  document.querySelector('.hand.minute').style.transform = `rotate(${minuteDeg}deg)`;
  document.querySelector('.hand.second').style.transform = `rotate(${secondDeg}deg)`;
}

updateClock();
setInterval(updateClock, 1000);