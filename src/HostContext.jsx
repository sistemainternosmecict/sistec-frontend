import { createContext, useState, useContext } from "react";
import PropTypes from 'prop-types'

export const HostContext = createContext();

const env = import.meta.env.MODE === 'production'
? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV

export const HostProvider = ({ children }) => {
    const [hostUrl, setHostUrl] = useState(env)

    return (
        <HostContext.Provider value={{ hostUrl, setHostUrl }}>
            {children}
        </HostContext.Provider>
    )
}

HostProvider.propTypes = {
    children: PropTypes.object
}

export function useHost() {
    return useContext(HostContext)
}