import React from "react";
import { news } from "./data";

const BestNews = () =>{
    return(
        <section>
            <h1>Лучшие новости этого месяца</h1>
            {news.slice(0,2).map(item => (
                <div key={item.id}>
                    <h2>{item.title}</h2>
                    <p>{item.date}</p>
                    <p>{item.preview}</p>
                </div>
            ))}
        </section>
    )
}

export default BestNews;