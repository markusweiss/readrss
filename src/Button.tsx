import "./Button.css";

const Button = ({ handleClick, label }: ButtonProps) => {
    return (
        <>
            <div className="day-night">
                <input
                    onClick={handleClick}
                    type="checkbox"
                    id="toggle"
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
    label: string;
}

export default Button;
