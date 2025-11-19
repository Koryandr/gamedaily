import React, { useEffect, useState } from "react";

const NewsAPIComponent = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(
      "https://newsapi.org/v2/everything?q=gaming&language=en&sortBy=publishedAt&apiKey=04cfa3b5283d4e33805ca2556f09c46a"
    )
      .then(res => res.json())
      .then(data => {
        if (data.articles) setArticles(data.articles);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <section>
      <h1>Игровые новости</h1>
      {articles.map((item, index) => (
        <div key={index}>
          <h2>{item.title}</h2>
          <p>{item.publishedAt}</p>
          <p>{item.description}</p>
          <a href={item.url} target="_blank">Читать полностью</a>
        </div>
      ))}
    </section>
  );
};

export default NewsAPIComponent;
