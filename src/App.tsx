import { useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
import "./App.css";
import Button from "./components/Button/Button";
import FeedBox from "./components/FeedBox/FeedBox";

export default function App() {
    const [theme, setTheme] = useLocalStorage(
        "theme",
        typeof window !== "undefined" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
    );

    const switchTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    };

    const checkStat = theme === "light";

    const [feed, setFeed] = useState("");
    const [isError, setError] = useState("");
    const [spinner, setSpinner] = useState(false);
    const [items, setItems] = useState([]);
    const [isActive, showBox] = useState(false);

    const handleChanged = (event) => {
        setFeed(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            getRssFeed(feed);
        }
    };

    const showFeedBox = () => {
        showBox((current) => !current);
    };

    const feedUri = "https://feeds.feedburner.com/bahnonline/bo";

    useEffect(() => {
        getRssFeed(feedUri);
    }, []);

    const sendUri = () => {
        if (!feed || feed.trim() === "") {
            getRssFeed("https://feeds.feedburner.com/bahnonline/bo");
        } else {
            getRssFeed(feed.trim());
        }
    };

    const getRssFeed = async (feedUri) => {
        setError("");
        setSpinner(true);
        try {
            const res = await fetch(
                `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUri)}`,
            );
            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }
            const contents = await res.json();

            if (!contents.items || contents.items.length === 0) {
                setItems([]);
                setSpinner(false);
                showBox(true);
                setError(`Feed is empty...`);
            } else {
                setItems(contents.items);
                setSpinner(false);
                showBox(false);
            }
        } catch (error) {
            console.error(`Houston we have a problem: ${error}`);
            setError(`${error.message || error}`);
            setSpinner(false);
            showBox(true);
        }
    };

    return (
        <>
            {spinner && <div className="loading">LOADING...</div>}
            <div className="app" data-theme={theme}>
                <h1 onClick={showFeedBox} style={{ cursor: "pointer" }}>
                    RSS FEED
                </h1>
                {isActive && (
                    <div className="feed--box">
                        {isError && <div>Status: {isError}</div>}
                        <FeedBox
                            handleChange={handleChanged}
                            handleKeyDown={handleKeyDown}
                            handleUri={sendUri}
                            defaultText="search"
                        />
                    </div>
                )}

                <Button defaultCheck={checkStat} handleClick={switchTheme} />
                {!spinner &&
                    items.map((item, index) => {
                        const descriptionText = item.description
                            ? item.description
                                  .replace(/<[^>]+>/g, "")
                                  .substr(0, 320) + "..."
                            : "Keine Beschreibung verfügbar.";

                        return (
                            <div
                                className="article"
                                key={item.guid || item.link || index}
                            >
                                <header>
                                    <h2 className="header">{item.title}</h2>
                                </header>
                                <p>{descriptionText}</p>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={item.link}
                                >
                                    {item.link}
                                </a>
                                {item.author && <p>{item.author}</p>}
                            </div>
                        );
                    })}
            </div>
        </>
    );
}
