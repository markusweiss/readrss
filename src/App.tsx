import { useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
import "./App.css";
import Button from "./components/Button/Button";
import FeedBox from "./components/FeedBox/FeedBox";

export default function App() {

    /* theme change with local storage */
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

    const checkStat = theme === "light" ? true : false;


    /* read feed with proxy */
    let [feed, setFeed] = useState();

    let [isError, setError] = useState(String);

    let [spinner, setSpinner] = useState(() => {
        return false;
    });

    const [items, setItems] = useState([]);

    const [isActive, showBox] = useState(() => {
        return false;
    });

    const handleChanged = (event) => {
        setFeed(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            getRssFeed(feed);
        }
    };

    const showFeedBox = () => {
        showBox((current) => !current);
    };

    const feedUri = "https://www.netz98.de/feed/";
    //const feedUri = "https://seibert-media.net/feed/";

    useEffect(() => {
        getRssFeed(feedUri);
    }, []);

    const sendUri = () => {
        setError("");
        if (feed === undefined) {
            getRssFeed("https://digitaltechandbusiness.com/feed/");
        }
        else {
            getRssFeed(feed);
        }
    };

    /* use proxy to pass through */

    const getRssFeed = async (feedUri) => {
        setSpinner(true);
        try {
            const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${feedUri}`)
            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }
            const contents = await res.json();
            setItems(contents.items);
            if (contents.items.length === 0) {
                setSpinner(false);
                showBox(true);
                setError(`Feed is empty...`);
            } else {
                setSpinner(false);
                showBox(false);
            }

        } catch (error) {
            console.error(`Housten we have a problem: ${error}`);
            setError(`${error}`);
            setTimeout(() => {
                setSpinner(false);
                showBox(true);
            }, 3000)
        }
    };

    return (
        <>
            {spinner ? <div className="loading">LOADING...</div> : false}
            <div className="app" data-theme={theme}>
                <h1 onClick={showFeedBox}>RSS FEED</h1>
                {isActive ? (
                    <>
                        <div className="feed--box">
                            {isError ? <div>Status: {isError}</div> : false}
                            <FeedBox
                                handleChange={handleChanged}
                                handleKeyDown={handleKeyDown}
                                handleUri={sendUri}
                                defaultText="search"
                            ></FeedBox>
                        </div>
                    </>
                ) : (
                    ""
                )}

                <Button defaultCheck={checkStat} handleClick={switchTheme} />
                {!spinner && items.map((item, index) => {
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
                            <p>
                                {item.author}
                            </p>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
