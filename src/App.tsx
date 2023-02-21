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
    let [feed, setFeed] = useState(() => {
        return false;
    });

    const handleChanged = (event) => {
        setFeed(event.target.value);
        console.log("EV-TV:::", event.target.value);
    };

    const [isActive, showBox] = useState(() => {
        return false;
    });


    const showFeedBox = () => {
        showBox((current) => !current);
    };

    const [items, setItems] = useState([]);

    const feedUri = "https://www.netz98.de/feed/";

    useEffect(() => {
        getRssFeed(feedUri);
    }, []);

    let [spinner, setSpinner] = useState(true);

    const sendUri = () => {
        setSpinner(true);
        console.log("sp1", spinner);
        feed = feed ? "https://digitaltechandbusiness.com/feed/" : feed;
        console.log("feed:::", feed);
        //getRssFeed("https://digitaltechandbusiness.com/feed/");
        getRssFeed(feed);
    };

    /* use proxy to pass through */

    const getRssFeed = async (feedUri) => {
        try {
            const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${feedUri}`)
            const contents = await res.json();
            console.log("items", contents);
            setItems(contents.items);
            contents.items.length < 1 ? showBox(true) : showBox(false);
            contents.items.length > 1 ? setSpinner(false) : setSpinner(false);
            //setSpinner(false);
            console.log("sp2", spinner)
        } catch (e) {
            console.log(e);
        }
    };

    //console.log(items)

    return (
        <>
            {spinner ? <div className="loading">LOADING or NO FEED FOUND...</div> : false}
            <div className="app" data-theme={theme}>
                <h1 onClick={showFeedBox}>RSS FEED</h1>
                {isActive ? (
                    <div className="feed--box">
                        <FeedBox
                            handleChange={handleChanged}
                            handleUri={sendUri}
                            defaultText="search"
                        ></FeedBox>

                        {items.length === undefined ? (
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
