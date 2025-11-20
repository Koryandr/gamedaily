import React, { useEffect, useState } from "react";

// 1. Список RSS, которые точно работают через rss2json
const rssFeeds = [
  "https://www.polygon.com/rss/index.xml",           // Polygon — точно работает
  "https://kotaku.com/rss",                          // Kotaku — рабочий RSS
  "https://www.rockpapershotgun.com/feed"           // Rock Paper Shotgun — рабочий RSS
];

const NewsAPIComponent = () => {
  const [news, setNews] = useState([]); // 2. Хранение всех новостей

  useEffect(() => {
    const fetchNews = async () => {
      let allNews = []; // 3. Пустой массив для всех новостей

      for (let feed of rssFeeds) {
        try {
          // 4. Получаем новости через rss2json
          const res = await fetch(
            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}&api_key=jdb7irzaiao8eeds90qloiuwo7n1wfc5okanzpcl`
          );
          const data = await res.json(); // 5. Превращаем в JSON
          
          // 6. Добавляем новости в массив и помечаем источник
          allNews = allNews.concat(
            (data.items || []).map(item => ({ ...item, source: feed }))
          );
        } catch (err) {
          console.log(`Ошибка с ${feed}:`, err); // 7. Логируем ошибки
        }
      }

      // 8. Сортируем новости по дате публикации
      allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

      setNews(allNews); // 9. Кладём в состояние для отображения
    };

    fetchNews(); // 10. Запуск функции загрузки
  }, []); // 11. Выполняется один раз при монтировании компонента

  return (
    <>
      {news.map((item, index) => (
        <div key={index}>
          <h1>{item.title}</h1> {/* 12. Заголовок */}
          <p dangerouslySetInnerHTML={{ __html: item.description }}></p> {/* 13. Описание */}
          {item.enclosure && (
            <img src={item.enclosure.link} alt="" style={{ maxWidth: "200px" }} />
          )} {/* 14. Картинка, если есть */}
          <br />
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            Читать полностью
          </a> {/* 15. Ссылка */}
          <p>{new Date(item.pubDate).toLocaleString()}</p> {/* 16. Дата */}
          <p>Источник: {item.source}</p> {/* 17. Источник RSS */}
        </div>
      ))}
    </>
  );
};

export default NewsAPIComponent;
