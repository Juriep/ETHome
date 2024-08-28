import React from "react";

const ConnectButton = ({ account, onConnect, onDisconnect }) => {
    return (
        <button
            onClick={account ? onDisconnect : onConnect}
            style={styles.connectButton}
        >
            {account
                ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
                : "Connect Wallet"
            }
        </button>
    );
};

// Inline styles for the connect button
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

export default ConnectButton;
