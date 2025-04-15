import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import PrimaryButton from "./PrimaryButton";

const Error = () => {
    const navigate = useNavigate();
    const error = useRouteError();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bg overflow-hidden bg-no-repeat bg-[100%_0%] font-sans">
            <h1 className="text-9xl font-bold text-pri m-0 drop-shadow-lg">
                {error?.status || "404"}
            </h1>
            <h2 className="text-2xl font-semibold text-textdark mt-6 mb-4">
                {error?.statusText || "Oops! Something went wrong"}
            </h2>
            <p className="text-sm text-textdark/40 max-w-xl text-center px-4">
                No route found!
            </p>
            <PrimaryButton text="Go Back" onClick={handleGoBack} className="!w-fit px-20 py-2.5 mt-4" />
        </div>
    );
};

export default Error;