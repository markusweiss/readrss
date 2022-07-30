import { useState } from "react";
import useLocalStorage from "use-local-storage";
import "./App.css";
import Button from "./components/Button/Button";

export default function App() {
    const defaultDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    const [theme, setTheme] = useLocalStorage(
        "theme",
        defaultDark ? "dark" : "light"
    );

    const switchTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    };

    const [items, setItems] = useState([]);
    const getRssFeed = async () => {
        const feedUri = "https://dev98.de/feed/";

        const res = await fetch(
            `https://api.allorigins.win/get?url=${feedUri}`
        );
        const { contents } = await res.json();
        const feed = new window.DOMParser().parseFromString(
            contents,
            "text/xml"
        );
        const items = feed.querySelectorAll("item");
        const feedItems = [...items].map((element) => ({
            link: element.querySelector("link")?.innerHTML,
            title: element.querySelector("title")?.innerHTML,
            description: element.querySelector("description")?.textContent,
        }));
        setItems(feedItems);
    };
    getRssFeed();
    return (
        <div className="app" data-theme={theme}>
            <h1>RSS FEED</h1>
            <Button handleClick={switchTheme} />
            {items.map((item, index) => {
                return (
                    <div className="article" key={index}>
                        <header>
                            <h2 className="header">{item.title}</h2>
                        </header>
                        <p>
                            {item.description
                                .replace(/<[^>]+>/g, "")
                                .substr(0, 320) + "..."}
                        </p>
                        <a target="_blank" href={item.link}>
                            {item.link}
                        </a>
                    </div>
                );
            })}
        </div>
    );
}
