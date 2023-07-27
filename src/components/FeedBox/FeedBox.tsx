import "./FeedBox.css";

const FeedBox = ({
    handleChange,
    handleKeyDown,
    handleUri,
    defaultText,
}: FeedBoxProps) => {
    return (
        <>
            <div className="add--feed">
                <label htmlFor="feed" className="feed--label"></label>
                <input
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    type="text"
                    id="feed"
                    name="feed"
                    className="input--feed"
                    defaultValue="https://itch.io/blog.rss"
                />
                <button className="input--button" onClick={handleUri}>
                    {defaultText}
                </button>
            </div>
        </>
    );
};

interface FeedBoxProps {
    handleChange;
    handleKeyDown;
    handleUri: () => void;
    defaultText: string;
    //setFeed: React.Dispatch<React.SetStateAction<string>>;
}

export default FeedBox;
