// WalletContext.js
import React, { createContext, useState } from 'react';
import { connectWallet, disconnectWallet } from './WalletConnectionUtils';

// Create the context
export const WalletContext = createContext();

// WalletProvider component to wrap around the application
export const WalletProvider = ({ children }) => {
    const [account, setAccount] = useState(null); // State to hold the connected account

    // Function to handle wallet connection on user action
    const handleConnect = async () => {
        const newAccount = await connectWallet();
        if (newAccount) {
            setAccount(newAccount);
        }
    };

    // Function to handle wallet disconnection
    const handleDisconnect = async () => {
        await disconnectWallet();
        setAccount(null);
    };

    return (
        <WalletContext.Provider value={{ account, handleConnect, handleDisconnect }}>
            {children}
        </WalletContext.Provider>
    );
};
