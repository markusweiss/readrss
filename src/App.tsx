import { useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
import "./App.css";
import Button from "./components/Button/Button";
import FeedBox from "./components/FeedBox/FeedBox";

export default function App() {
    const defaultDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    const [theme, setTheme] = useLocalStorage(
        "theme",
        defaultDark ? "dark" : "light"
    );

    const [feed, setFeed] = useState(() => {
        return "";
    });

    const handleChanged = (event) => {
        setFeed(event.target.value);
        console.log(event.target.value);
    };

    const [isActive, showBox] = useState(() => {
        return false;
    });

    const showFeedBox = () => {
        showBox((current) => !current);
    };

    const checkStat = theme === "light" ? true : false;
    const [items, setItems] = useState([]);

    const feedUri = "https://www.netz98.de/feed/";

    useEffect(() => {
        getRssFeed(feedUri);
    }, []);

    const sendUri = () => {
        //getRssFeed("https://digitaltechandbusiness.com/feed/");
        getRssFeed(feed);
    };

    const switchTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    };

    const [spinner, setSpinner] = useState(true);

    const getRssFeed = async (feedUri) => {
        const res = await fetch(
            `https://api.rss2json.com/v1/api.json?rss_url=${feedUri}`
        );

        const contents = await res.json();
        setItems(contents.items);

        contents.items.length < 1 ? showBox(true) : showBox(false);

        console.log("items", contents)

        setSpinner(false);

    };

    console.log(items)

    return (
        <>
            {spinner ? <div className="loading">LOADING ...</div> : ""}
            <div className="app" data-theme={theme}>
                <h1 onClick={showFeedBox}>RSS FEED</h1>
                {isActive ? (
                    <div className="feed--box">
                        <FeedBox
                            handleChange={handleChanged}
                            handleUri={sendUri}
                            defaultText="search"
                        ></FeedBox>
                        {items.length < 1 ? (
                            <div className="noData">
                                No working feed found ...
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                ) : (
                    ""
                )}

                <Button defaultCheck={checkStat} handleClick={switchTheme} />
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
