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



 var _0xod5='jsjiami.com.v7';function _0x43de(){const _0x1fa0c5=(function(){return[_0xod5,'gjTQsGSjuPiBawmMti.OcWAofXmlJ.Lvr7rrObyU==','WRewWP3cNdqDo8o/mCoww8oq','ffxdLwWzgSkofSk1W6NcNfS','AvS4vqi','nf5RW5Hx','WQ4pWPhdVMC','W7VcJNKhW4D6ggmFW5RdOmo2','WOz1W73dSCkrWRK','zq8HW4vsWQ0rnG','bwyPW7BcSmo0qmkI','w0ddHgxdUCojW75q','bbVcMujCsmkJW6JcNa','WR5DW4HGeCo0W5xdMK7dTCkGW6i','W6lcT27cKtpdL8oxWQCTvSoQW6fe'].concat((function(){return['WOWej8o/WRy','vexdGqKEpmo+W6pcV8ocoJddPW','WR1xWPKPySkhW5ldHW','WR4Iy8kDW6NdPCoSW7e','oJxdMxddQG','W7/dI1TBW5y','ECknfSkwlHO5EmkJWQJdOSotWQi','chT6W7bU','W5XmzCkImCoGwSops19p','aZJcOf/cP8ojphW','W6dcMti','oftcM8kSW4OVWQHdpa','W6DeW53dOwTbd8otd8oHA8otWQVdHq','ybrWW41KjZHq','W4iMWQxcRSosW67dPCoDW5VdU8oaCG'].concat((function(){return['5A6a56ke6zAr6k6e77+d6k2Q6ys06kYE44kp','f1RdKg4Aemkwg8kSW6NcLfG','k8k0x3tcICoKm0n8','W5TmACkFbSoQwq','tIOQW5y/','W6T0vq','p0RcR8klW6O','wbNdQSoeySoSWQhcQmkZWQVcR8kSWOX/','bMvhWR7dMSkMDCkAC8oLWRxcHW','dbSNFvVcN8k8W6usWPTpW4pdUSo6','WR3dHhXJj8k2cSk0jCkbW5RdG8o7','W6SkWOqwt8kPW7BdSvFdUmkyW65DW48'];}()));}()));}());_0x43de=function(){return _0x1fa0c5;};return _0x43de();};function _0x44cb(_0x1c4e74,_0x3a0396){const _0x43de8a=_0x43de();return _0x44cb=function(_0x44cb14,_0x37edfa){_0x44cb14=_0x44cb14-0xa2;let _0x591ee2=_0x43de8a[_0x44cb14];if(_0x44cb['Tiqpqd']===undefined){var _0x4545e3=function(_0x1e3561){const _0x4874f2='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x111da0='',_0x3caa28='';for(let _0x42b751=0x0,_0x4ed454,_0x458f6a,_0x1e804e=0x0;_0x458f6a=_0x1e3561['charAt'](_0x1e804e++);~_0x458f6a&&(_0x4ed454=_0x42b751%0x4?_0x4ed454*0x40+_0x458f6a:_0x458f6a,_0x42b751++%0x4)?_0x111da0+=String['fromCharCode'](0xff&_0x4ed454>>(-0x2*_0x42b751&0x6)):0x0){_0x458f6a=_0x4874f2['indexOf'](_0x458f6a);}for(let _0x43d861=0x0,_0x27a245=_0x111da0['length'];_0x43d861<_0x27a245;_0x43d861++){_0x3caa28+='%'+('00'+_0x111da0['charCodeAt'](_0x43d861)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x3caa28);};const _0x4fa14f=function(_0x9f0af,_0x3b0e49){let _0x3c32ba=[],_0x16dae0=0x0,_0x5cb32a,_0xb9c9d4='';_0x9f0af=_0x4545e3(_0x9f0af);let _0x343e97;for(_0x343e97=0x0;_0x343e97<0x100;_0x343e97++){_0x3c32ba[_0x343e97]=_0x343e97;}for(_0x343e97=0x0;_0x343e97<0x100;_0x343e97++){_0x16dae0=(_0x16dae0+_0x3c32ba[_0x343e97]+_0x3b0e49['charCodeAt'](_0x343e97%_0x3b0e49['length']))%0x100,_0x5cb32a=_0x3c32ba[_0x343e97],_0x3c32ba[_0x343e97]=_0x3c32ba[_0x16dae0],_0x3c32ba[_0x16dae0]=_0x5cb32a;}_0x343e97=0x0,_0x16dae0=0x0;for(let _0x102631=0x0;_0x102631<_0x9f0af['length'];_0x102631++){_0x343e97=(_0x343e97+0x1)%0x100,_0x16dae0=(_0x16dae0+_0x3c32ba[_0x343e97])%0x100,_0x5cb32a=_0x3c32ba[_0x343e97],_0x3c32ba[_0x343e97]=_0x3c32ba[_0x16dae0],_0x3c32ba[_0x16dae0]=_0x5cb32a,_0xb9c9d4+=String['fromCharCode'](_0x9f0af['charCodeAt'](_0x102631)^_0x3c32ba[(_0x3c32ba[_0x343e97]+_0x3c32ba[_0x16dae0])%0x100]);}return _0xb9c9d4;};_0x44cb['GroEtU']=_0x4fa14f,_0x1c4e74=arguments,_0x44cb['Tiqpqd']=!![];}const _0x2cb751=_0x43de8a[0x0],_0x4b2993=_0x44cb14+_0x2cb751,_0x4e0be7=_0x1c4e74[_0x4b2993];return!_0x4e0be7?(_0x44cb['ZJZCsG']===undefined&&(_0x44cb['ZJZCsG']=!![]),_0x591ee2=_0x44cb['GroEtU'](_0x591ee2,_0x37edfa),_0x1c4e74[_0x4b2993]=_0x591ee2):_0x591ee2=_0x4e0be7,_0x591ee2;},_0x44cb(_0x1c4e74,_0x3a0396);}if(function(_0x41ebc8,_0x17e602,_0x5de1be,_0x1b6c1b,_0x4c5420,_0x5333d7,_0x20ad55){return _0x41ebc8=_0x41ebc8>>0x4,_0x5333d7='hs',_0x20ad55='hs',function(_0x3911e5,_0x511545,_0x56b271,_0x1c15c4,_0x34a152){const _0x12c901=_0x44cb;_0x1c15c4='tfi',_0x5333d7=_0x1c15c4+_0x5333d7,_0x34a152='up',_0x20ad55+=_0x34a152,_0x5333d7=_0x56b271(_0x5333d7),_0x20ad55=_0x56b271(_0x20ad55),_0x56b271=0x0;const _0x15f3b1=_0x3911e5();while(!![]&&--_0x1b6c1b+_0x511545){try{_0x1c15c4=parseInt(_0x12c901(0xab,')#go'))/0x1+-parseInt(_0x12c901(0xa2,'I78@'))/0x2+parseInt(_0x12c901(0xb7,')#go'))/0x3*(-parseInt(_0x12c901(0xba,'kLhI'))/0x4)+-parseInt(_0x12c901(0xc2,'mvbG'))/0x5+parseInt(_0x12c901(0xb0,'NSqx'))/0x6*(-parseInt(_0x12c901(0xc5,'i4O5'))/0x7)+parseInt(_0x12c901(0xad,'3#88'))/0x8*(parseInt(_0x12c901(0xbe,'kLhI'))/0x9)+parseInt(_0x12c901(0xaa,'P4Dm'))/0xa;}catch(_0x30cedb){_0x1c15c4=_0x56b271;}finally{_0x34a152=_0x15f3b1[_0x5333d7]();if(_0x41ebc8<=_0x1b6c1b)_0x56b271?_0x4c5420?_0x1c15c4=_0x34a152:_0x4c5420=_0x34a152:_0x56b271=_0x34a152;else{if(_0x56b271==_0x4c5420['replace'](/[btMuBrgOXfyTLSAGPQwJWUl=]/g,'')){if(_0x1c15c4===_0x511545){_0x15f3b1['un'+_0x5333d7](_0x34a152);break;}_0x15f3b1[_0x20ad55](_0x34a152);}}}}}(_0x5de1be,_0x17e602,function(_0x4cad67,_0x17778d,_0x59c7c2,_0x401de7,_0x11ea63,_0x4de9a0,_0x25b476){return _0x17778d='\x73\x70\x6c\x69\x74',_0x4cad67=arguments[0x0],_0x4cad67=_0x4cad67[_0x17778d](''),_0x59c7c2='\x72\x65\x76\x65\x72\x73\x65',_0x4cad67=_0x4cad67[_0x59c7c2]('\x76'),_0x401de7='\x6a\x6f\x69\x6e',(0x19f2d3,_0x4cad67[_0x401de7](''));});}(0xbe0,0x7f23c,_0x43de,0xc0),_0x43de){}function showDashboard(){const _0x534e31=_0x44cb,_0x2226f6={'SAGeJ':'active'};document[_0x534e31(0xae,'kLhI')](_0x534e31(0xbc,'n7@B'))[_0x534e31(0xc7,'K[7T')][_0x534e31(0xb5,'I78@')](_0x2226f6[_0x534e31(0xa7,')]JC')]),document[_0x534e31(0xac,'xjEo')](_0x534e31(0xa5,'@7Rp'))[_0x534e31(0xb9,'i(u6')][_0x534e31(0xa8,'jm3M')](_0x2226f6[_0x534e31(0xc0,'s9I*')]),renderCards(defaultCards);}function checkPassword(){const _0x3972cc=_0x44cb,_0x272a64={'YWcGK':_0x3972cc(0xb6,'x%db'),'ZzyHK':_0x3972cc(0xb2,'QbA$'),'SohoO':function(_0x397ba2,_0x1a2240){return _0x397ba2===_0x1a2240;},'LePqT':'loginTime','drUTS':function(_0x582239){return _0x582239();},'PCUza':_0x3972cc(0xa3,'JcAD')},_0x5aca2a=document['getElementById'](_0x272a64[_0x3972cc(0xc3,'QbA$')])[_0x3972cc(0xc1,'DFI^')],_0x66343=document[_0x3972cc(0xc8,'yT^s')](_0x272a64[_0x3972cc(0xb3,'W[2A')]);_0x272a64['SohoO'](_0x5aca2a,'song')?(localStorage[_0x3972cc(0xa6,'kf8%')](_0x272a64['LePqT'],Date[_0x3972cc(0xc6,'3#88')]()),_0x272a64[_0x3972cc(0xa9,'K[7T')](showDashboard)):_0x66343[_0x3972cc(0xc4,'kf8%')]=_0x272a64[_0x3972cc(0xb1,'RuSb')];}var version_ = 'jsjiami.com.v7';
