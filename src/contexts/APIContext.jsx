import React, { createContext, useContext, useState } from "react";

const APIContext = createContext();


export const APIProvider = ({ children }) => {
    const [devURL, setDevURL] = useState("localhost");
    const [prodURL, setProdURL] = useState("https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev");


    const getDevURL = () => {
        return devURL;
    }

    const getProdURL = () => {
        return prodURL;
    }
}