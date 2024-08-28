import { ethers } from 'ethers';

export const connectWallet = async (setAccount, handleAccountChange) => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Accounts retrieved:", accounts);

            // Create an ethers provider and signer
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

export const disconnectWallet = async (setAccount, handleAccountChange) => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request to revoke permissions (if supported)
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
