import React, { useEffect, useState } from "react";

const NewsAPIComponent = () =>{
  const [news, setNews] = useState([]);

  useEffect(() => {
      const fetchNews = async () =>{
        const request = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www.polygon.com/rss/index.xml&api_key=jdb7irzaiao8eeds90qloiuwo7n1wfc5okanzpcl");
        const data = await request.json()
        console.log(data);
        setNews(data.items || [])
      }

      fetchNews()
  }, [])

  return(
    <>
      {news.map((item,index) => (
        <div key={index}>
          <h1>{item.title}</h1>
          <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
          {item.enclosure && <img src={item.enclosure.link} alt="" style={{maxWidth: "200px"}} />}
          <br/>
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            Читать полностью
          </a>
          <p>{new Date(item.pubDate).toLocaleString()}</p>
        </div>
      ))}
    </>
  )
}

export default NewsAPIComponent;