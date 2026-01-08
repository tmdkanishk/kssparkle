import React, { createContext, useContext, useEffect, useState } from "react";
import { _retrieveData } from "../utils/storage";

// Create context
const LanguageCurrencyContext = createContext();

// Provider component
export const LanguageCurrencyProvider = ({ children }) => {
    const [language, setLanguage] = useState();
    const [currency, setCurrency] = useState();

    useEffect(() => {
        getLanguageAndCurrency();
    }, [])

    const getLanguageAndCurrency = async () => {
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        setLanguage(lang?.code);
        setCurrency(cur?.code);
    }


    const changeLanguage = (newLang) => setLanguage(newLang);
    const changeCurrency = (newCurrency) => setCurrency(newCurrency);

    return (
        <LanguageCurrencyContext.Provider
            value={{ language, currency, changeLanguage, changeCurrency }}
        >
            {children}
        </LanguageCurrencyContext.Provider>
    );
};

// Custom hook to use context easily
export const useLanguageCurrency = () => useContext(LanguageCurrencyContext);
