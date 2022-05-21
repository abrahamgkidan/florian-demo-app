const API_KEY = "ab44cca3d9294d06b8f9e776113cf1ae";
const GOOGLE_NEWS_API = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${API_KEY}`;

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function fetchNews(cb) {
  fetch(GOOGLE_NEWS_API)
    .then((res) => res.json())
    .then(({ status, articles }) => {
      if (status) {
        if (cb && typeof cb === "function") {
          let startIndex = randomIntFromInterval(0, articles.length - 1);
          cb(articles.slice(startIndex, startIndex + 1));
        }
      }
    });
}
