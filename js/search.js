// search.js
const searchEngines = {
  google: "https://www.google.com/search?q={query}",
  bing: "https://www.bing.com/search?q={query}",
  baidu: "https://www.baidu.com/s?wd={query}",
  duckduckgo: "https://duckduckgo.com/?q={query}"
};

// 搜索功能
document.getElementById('search-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const engine = document.getElementById('engine-select').value;
    const query = encodeURIComponent(e.target.value.trim());
    if (query) {
      window.open(searchEngines[engine].replace('{query}', query), '_blank');
    }
  }
});