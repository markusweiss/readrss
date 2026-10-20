import { useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
import "./App.css";
import Button from "./components/Button/Button";
import FeedBox from "./components/FeedBox/FeedBox";

const DEFAULT_FEED = "https://feeds.feedburner.com/bahnonline/bo";

export default function App() {
    const [theme, setTheme] = useLocalStorage(
        "theme",
        typeof window !== "undefined" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
    );

    const switchTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
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
            loadFeed(feed);
        }
    };

    const showFeedBox = () => {
        showBox((current) => !current);
    };

    useEffect(() => {
        loadFeed(DEFAULT_FEED);
    }, []);

    const sendUri = () => {
        loadFeed(feed && feed.trim() !== "" ? feed.trim() : DEFAULT_FEED);
    };

    const loadFeed = async (feedUri) => {
        setError("");
        setSpinner(true);
        try {
            const res = await fetch(
                `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUri)}`,
            );
            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }

            const xmlText = await res.text();
            const parsedItems = parseRss(xmlText);

            if (parsedItems.length === 0) {
                setItems([]);
                showBox(true);
                setError("Feed is empty...");
            } else {
                setItems(parsedItems);
                showBox(false);
            }
        } catch (error) {
            console.error(`Houston we have a problem: ${error}`);
            setError(`${error.message || error}`);
            showBox(true);
        } finally {
            setSpinner(false);
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
                                  .slice(0, 320) + "..."
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

// RSS-XML im Browser parsen
function parseRss(xmlText) {
    const doc = new DOMParser().parseFromString(xmlText, "text/xml");
    const nodes = Array.from(doc.querySelectorAll("item"));

    return nodes.map((node) => {
        const get = (tag) =>
            node.querySelector(tag)?.textContent?.trim() ?? null;
        return {
            title: get("title"),
            link: get("link"),
            description: get("description"),
            author: get("author") || get("dc\\:creator") || get("creator"),
            pubDate: get("pubDate"),
            guid: get("guid"),
        };
    });
}