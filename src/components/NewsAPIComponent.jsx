// Импортируем React и два хука useState и useEffect.
// useState — позволяет создавать внутренние данные (состояния) внутри компонента.
// useEffect — позволяет выполнять побочные эффекты: загрузку данных, подписки, таймеры и т.п.
import React, { useEffect, useState } from "react";
import "./NewsAPIComponent.css";

// Массив ссылок на RSS-ленты.
// Каждая строка — это источник новостей, который будет преобразован в JSON через rss2json API.
const rssFeeds = [
  "https://www.polygon.com/rss/index.xml",
  "https://kotaku.com/rss",
  "https://www.rockpapershotgun.com/feed"
];

// Функция-фильтр, которая определяет: является ли новость игровой.
// На вход получает объект item — одну новость из RSS.
function isGamingNews(item) {
  // Объединяем заголовок и описание в одну строку, затем приводим всё к нижнему регистру.
  // Это удобно для проверки ключевых слов, чтобы не учитывать регистр.
  const text = (item.title + " " + item.description).toLowerCase();

  async function translateText(text) {
  try {
    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: "ru",
        format: "text"
      })
    });

    const data = await res.json();
    return data.translatedText;
  } catch (e) {
    console.error("Ошибка перевода:", e);
    return text; // если API упал — показываем оригинал
  }
}


  // Берём категории новости (если их нет — заменяем пустым массивом),
  // затем переводим каждую категорию в нижний регистр.
  const cats = (item.categories || []).map(c => c.toLowerCase());

  // Список разрешённых категорий, которые точно указывают на игровую тему.
  const allowedCats = [
    "game", "games", "gaming",
    "pc gaming", "playstation", "xbox", "nintendo"
  ];

  // Список ключевых слов, которые могут присутствовать в тексте,
  // если категория не помогает определить тематику.
  const allowedKeywords = [
    "game", "games", "gaming", "videogame", "videogames",
    "ps5", "ps4",
    "xbox", "series x", "series s",
    "nintendo", "switch",
    "steam", "pc game",
    "review", "patch", "update", "dlc"
  ];

  // Если категории существуют — сначала проверяем их.
  if (cats.length > 0) {
    // Проверяем: содержит ли массив категорий хотя бы одну из разрешённых.
    if (cats.some(cat => allowedCats.includes(cat))) return true;
  }

  // Если категории пустые или не совпали — проверяем ключевые слова внутри текста.
  // Если хотя бы одно ключевое слово встречается — новость считается игровой.
  return allowedKeywords.some(kw => text.includes(kw));
}

// Главный компонент, который загружает новости и отображает их на странице.
const NewsAPIComponent = () => {
  // Создаём состояние news — массив всех полученных новостей.
  // setNews — функция, позволяющая обновить этот массив.
  const [news, setNews] = useState([]);

  // useEffect выполняется при первом рендере компонента.
  // Здесь загружается весь RSS, чтобы показать новости.
  useEffect(() => {
    // Внутренняя асинхронная функция загрузки новостей.
    const fetchNews = async () => {
      // Общий массив, куда будут добавляться новости из каждого RSS.
      let allNews = [];

      // Перебираем каждую ссылку в массиве rssFeeds.
      for (let feed of rssFeeds) {
        try {
          // Делаем запрос к API rss2json: преобразовать RSS → JSON.
          // encodeURIComponent используется для безопасной передачи URL внутри другого URL.
          const res = await fetch(
            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}&api_key=jdb7irzaiao8eeds90qloiuwo7n1wfc5okanzpcl`
          );

          // Преобразуем полученный ответ HTTP в формат JSON.
          const data = await res.json();

          // Добавляем новости из этого RSS в общий список.
          allNews = allNews.concat(
            (data.items || [])               // Если items нет, подставляем пустой массив.
              .filter(isGamingNews)          // Фильтруем только игровые новости.
              .map(item => ({                // Для каждой новости создаём новый объект...
                ...item,                     // ...копируем все поля из оригинальной новости.
                source: feed                 // ...добавляем поле source — откуда новость.
              }))
          );
        } catch (err) {
          // В случае ошибки выводим информацию в консоль, чтобы понимать проблемный RSS.
          console.log(`Ошибка с ${feed}:`, err);
        }
      }

      // Сортируем все новости по дате публикации — свежие сверху.
      allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

      // Обновляем состояние → React перерисует компонент с новыми данными.
      setNews(allNews);
    };

    // Запускаем загрузку новостей.
    fetchNews();
  // Пустой массив зависимостей означает, что useEffect выполнится один раз — при загрузке компонента.
  }, []);

  // Возвращаем JSX — разметку интерфейса.
  return (
    <>
      {/* Перебор массива новостей для отображения каждой на экране. */}
      {news.map((item, index) => {
        // Перед показом очищаем description:
        // 1) удаляем <img> чтобы не было дубликатов картинок
        // 2) удаляем <a> — встраиваемые "Read more"
        const cleanDescription = item.description
          .replace(/<img[^>]*>/g, "")     // Регулярка удаляет все теги <img ... >
          .replace(/<a[^>]*>(.*?)<\/a>/g, ""); // Удаляем любые ссылки <a>...</a>

        return (
          // Каждый элемент списка обязан иметь уникальный key для оптимальной работы React.
          <div className="block-news" key={index}>
            
            {/* Заголовок новости */}
            <h1 className="news-title">{item.title}</h1>

            {/* Описание новости. Используем dangerouslySetInnerHTML,
                чтобы вставить HTML-строку напрямую.
                Без этого HTML будет отображаться как текст обычными символами. */}
            <p className="description" dangerouslySetInnerHTML={{ __html: cleanDescription }}></p>

            {/* Если у новости в RSS есть отдельная картинка (enclosure), выводим её. */}
            {item.enclosure && (
              <img
                src={item.enclosure.link}   // Ссылка на картинку.
                alt=""                       // Пустой alt, чтобы не показывать текст вместо картинки.
                style={{ maxWidth: "400px" }} // Ограничиваем размер.
              />
            )}

            <br />

            {/* Ссылка на оригинальную статью на сайте-источнике. */}
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              Читать полностью
            </a>

            {/* Показываем дату публикации, преобразовав её в удобный формат. */}
            <p className="news-data">Дата: {new Date(item.pubDate).toLocaleString()}</p>
          </div>
        );
      })}
    </>
  );
};

// Экспортируем компонент, чтобы можно было использовать его в других файлах приложения.
export default NewsAPIComponent;
