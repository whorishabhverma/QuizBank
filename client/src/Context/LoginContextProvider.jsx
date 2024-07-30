import React, { useState, useEffect } from "react";
import LoginContext from "./LoginContext";

const LoginContextProvider = ({ children }) => {
    const [loginId, setloginId] = useState(JSON.parse(sessionStorage.getItem('loginId')) || null);
    // send loginId and method 

    // Update session storage whenever loginId changes
    useEffect(() => {
        sessionStorage.setItem('loginId', JSON.stringify(loginId));
    }, [loginId]);


    return (
        <LoginContext.Provider value={{ loginId, setloginId }}>
            {children}
        </LoginContext.Provider>
    );
};

export default LoginContextProvider;