import React from "react";

const PrimaryButton = ({
    text,
    icon,
    onClick,
    type = "button",
    disabled = false,
    className = "",
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`w-full bg-blue-900 text-white cursor-pointer py-3 px-6 rounded-lg text-lg font-medium hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4 ${className}`}
        >
            {icon ? icon : null}
            {text}
        </button>
    );
};

export default PrimaryButton;
