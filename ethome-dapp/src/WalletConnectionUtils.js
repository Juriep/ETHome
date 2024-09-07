import { ethers } from 'ethers';

// Check if a wallet is already connected
export const checkWalletConnection = async (setAccount, handleAccountChange) => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const userAddress = await signer.getAddress();
                
                if (accounts[0].toLowerCase() === userAddress.toLowerCase()) {
                    setAccount(userAddress);
                    handleAccountChange(userAddress);
                    console.log("Wallet already connected:", userAddress);
                }
            }
        } catch (error) {
            console.error("Error checking wallet connection:", error);
        }
    } else {
        console.log("MetaMask is not installed.");
    }
};

// Connect the wallet
export const connectWallet = async (setAccount, handleAccountChange) => {
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
                handleAccountChange(userAddress);
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

// Disconnect the wallet
export const disconnectWallet = async (setAccount, handleAccountChange) => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({
                method: 'wallet_revokePermissions',
                params: [{ eth_accounts: {} }]
            });
            console.log("Permissions revoked");

            setAccount(null);
            handleAccountChange(null);

            alert("You have been disconnected from MetaMask.");
        } catch (error) {
            console.error("Error revoking permissions:", error);
            alert("Failed to disconnect wallet. Please manually disconnect from MetaMask.");
        }
    } else {
        alert("MetaMask is not installed.");
    }
};
