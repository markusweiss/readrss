import "./FeedBox.css";

const FeedBox = ({ handleChange, handleUri, defaultText }: FeedBoxProps) => {
    return (
        <>
            <div className="add--feed">
                <label htmlFor="feed" className="feed--label"></label>
                <input
                    onChange={handleChange}
                    type="text"
                    id="feed"
                    name="feed"
                    className="input--feed"
                    defaultValue="https://dev98.de/feed/"
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
    handleUri: () => void;
    defaultText: string;
    //children?: React.ReactNode;
    //feed: string;
    //setFeed: React.Dispatch<React.SetStateAction<string>>;
}

export default FeedBox;
