import { View, Text } from 'react-native'
import React, { createContext, useState } from 'react'

export const IsLoginContext = createContext();


const IsLogin = ({ children }) => {
    const [isLogin, setLogin] = useState(false);

    return (
        <IsLoginContext.Provider value={{ isLogin, setLogin}}>
            {children}
        </IsLoginContext.Provider>
    )
}

export default IsLogin


