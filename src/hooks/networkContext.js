import React, { createContext, useState, useEffect } from "react";

export const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const checkInternet = async () => {
            try {
                const response = await fetch("https://www.google.com", { method: "HEAD" });
                setIsConnected(response.ok);
            } catch (error) {
                setIsConnected(false);
            }
        };

        checkInternet();
        const interval = setInterval(checkInternet, 2000); // Check every 5 sec

        return () => clearInterval(interval); // Cleanup
    }, []);

    return (
        <NetworkContext.Provider value={{ isConnected }}>
            {children}
        </NetworkContext.Provider>
    );
};
