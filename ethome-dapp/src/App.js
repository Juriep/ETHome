import React, { useState } from "react";
import WalletConnect from "./WalletConnect";

const App = () => {
    const [account, setAccount] = useState(null);

    const handleAccountChange = (newAccount) => {
        setAccount(newAccount);
    };

    return (
        <div style={styles.container}>
            <div style={styles.topButtonsContainer}>
                <div style={styles.leftButtons}>
                    <button style={styles.button}>Register</button>
                    <button style={styles.button}>Login</button>
                </div>
                <WalletConnect onAccountChange={handleAccountChange} />
            </div>

            <h1 style={styles.title}>ETHome</h1>
            <p style={styles.subtitle}>Welcome to ETHome, where your dream "house or apartment" is waiting for you!</p>
            <ul style={styles.list}>
                <li style={styles.listItem}>If you are a new user please register and connect your wallet.</li>
                <li style={styles.listItem}>If you are already registered log in and connect your wallet.</li>
            </ul>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "black",
        position: "relative",
    },
    topButtonsContainer: {
        position: "absolute",
        top: "20px",
        left: "20px",
        right: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftButtons: {
        display: "flex",
        gap: "10px",
    },
    button: {
        backgroundColor: "#28a745",
        color: "white",
        padding: "15px 30px",
        fontSize: "15px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
    },
    title: {
        fontSize: "64px",
        color: "#28a745",
        textAlign: "center",
    },
    subtitle: {
        fontSize: "25px",
        color: "white",
        textAlign: "center",
        marginTop: "20px",
    },
    list: {
        listStyleType: "disc", // Use disc markers
        paddingLeft: "20px", // Indent list items
        marginTop: "20px",
    },
    listItem: {
        fontSize: "25px",
        color: "white",
        textAlign: "left", // Align text to the left for readability
        marginTop: "10px", // Space between list items
    },
    connectedAccount: {
        fontSize: "18px",
        color: "#333",
        textAlign: "center",
        marginTop: "20px",
    },
};

export default App;
