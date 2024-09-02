import React, { useContext } from "react";
import { WalletContext } from "./WalletContext"; // Import WalletContext

const ConnectWalletButton = () => {
    const { account, handleConnect, handleDisconnect } = useContext(WalletContext); // Get context values

    return (
        <button
            style={styles.button}
            onClick={account ? handleDisconnect : handleConnect} // Toggle between connect and disconnect
        >
            {account
                ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` // Show connected account
                : "Connect Wallet" // Show connect button if no account is connected
            }
        </button>
    );
};

// Inline styles
const styles = {
    button: {
        backgroundColor: '#28a745', // Green background
        color: 'white', // White text
        padding: '10px 20px', // Padding for button
        border: 'none', // Remove default border
        borderRadius: '5px', // Rounded corners
        fontSize: '16px', // Font size
        cursor: 'pointer', // Pointer cursor on hover
        outline: 'none', // Remove default focus outline
    }
};

export default ConnectWalletButton;
