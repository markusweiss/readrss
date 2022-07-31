import "./Button.css";

const Button = ({ handleClick, defaultCheck }: ButtonProps) => {
    return (
        <>
            <div className="day-night">
                <input
                    onClick={handleClick}
                    type="checkbox"
                    id="toggle"
                    defaultChecked={defaultCheck}
                    className="toggle--checkbox"
                />
                <label htmlFor="toggle" className="toggle--label">
                    <span className="toggle--label-background"></span>
                </label>
            </div>
        </>
    );
};

interface ButtonProps {
    handleClick: () => void;
    defaultCheck: boolean;
}

export default Button;
