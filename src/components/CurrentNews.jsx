import React from "react";
import { news } from "./data";

const CurrentNews = () => {
    return(
        <section>
            <h1>Актуальные новости</h1>
            {news.map(item => (
                <div key={item.id}>
                    <h2>{item.title}</h2>
                    <p>{item.date}</p>
                    <p>{item.preview}</p>
                </div>
            ))}
        </section>
    )
}

export default CurrentNews;