import React, {useState} from "react";
const {ethers} = require("ethers");

const WalletConnect = () => {

    const [account, setAccount] = useState(null);

    const connectWallet = async () => {

        if(typeof window.ethereum !== 'undefined') // Check if MetaMask is installed
        {
            
            try
            {

                // Prompt user for account connections
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                // Create a new provider instance using ethers.js
                const provider = new ethers.providers.Web3Provider(window.ethereum);

                // Get the signer instance from the provider
                const signer = provider.getSigner(); 

                // Fetch the user's Ethereum address
                const userAddress = await signer.getAddress();

                // Save the user's Ethereum address to the state
                setAccount(userAddress); 

                console.log("Connected account: ", userAddress);

            }
            catch(error)
            {
                // Handle errors if the wallet connection fails
                alert("Failed to connect wallet");
            }

        }

        else
        {
            alert("Metamask is not installed.") // Inform the user that MetaMask is not installed
        }

    };

    return (
        <button style={styles.connectButton} onClick={connectWallet}>
            Connect Wallet
        </button>
    );

}
// Button styling for consistency
const styles = {
  connectButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "20px 40px",
    fontSize: "18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default WalletConnect;
