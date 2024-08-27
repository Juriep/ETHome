import React, { useState, useEffect } from "react";
const { ethers } = require("ethers");

const WalletConnect = ({ onAccountChange }) => {
    const [account, setAccount] = useState(null);

    useEffect(() => {
        // Function to handle account changes
        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                setAccount(accounts[0]); // Update the state with the new account
                onAccountChange(accounts[0]); // Notify parent component of the new account
            } else {
                setAccount(null); // Clear the state if no accounts are available
                onAccountChange(null); // Notify parent component that no account is connected
            }
        };
    
        // Check if MetaMask is available
        if (typeof window.ethereum !== 'undefined') {
            // Set up an event listener for account changes
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }
    
        // Cleanup function to remove the event listener
        return () => {
            if (typeof window.ethereum !== 'undefined') {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, [onAccountChange]);
    
    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                console.log("Accounts retrieved:", accounts);
                
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const userAddress = await signer.getAddress();
                console.log("User address:", userAddress);
                
                if (accounts[0].toLowerCase() === userAddress.toLowerCase()) {
                    setAccount(userAddress);
                    onAccountChange(userAddress);
                    console.log("Connected account:", userAddress);
                } else {
                    throw new Error("Account mismatch between MetaMask and ethers.js");
                }
            } catch (error) {
                console.error("Error connecting wallet:", error);
                alert("Failed to connect wallet");
            }
        } else {
            alert("MetaMask is not installed.");
        }
    };
    
    const disconnectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({
                    method: 'wallet_revokePermissions',
                    params: [{
                        eth_accounts: {}
                    }]
                });
                console.log("Permissions revoked");
    
                setAccount(null);
                onAccountChange(null);
    
                alert("You have been disconnected from MetaMask.");
            } catch (error) {
                console.error("Error revoking permissions:", error);
                alert("Failed to disconnect wallet. Please manually disconnect from MetaMask.");
            }
        } else {
            alert("MetaMask is not installed.");
        }
    };
    

    return (
        <button style={styles.connectButton} onClick={account ? disconnectWallet : connectWallet}>
            {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
        </button>
    );
};

const styles = {
    connectButton: {
        backgroundColor: "#28a745",
        color: "white",
        padding: "15px 30px",
        fontSize: "15px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
    },
};

export default WalletConnect;
