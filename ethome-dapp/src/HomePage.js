import React, { useState } from "react";
import WalletConnect from "./WalletConnect";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);

    const handleAccountChange = (newAccount) => {
        setAccount(newAccount);
    };

    const handleRegisterClick = () => {
        navigate("/register");
    };

    return (
        <div style={styles.container}>
            <div style={styles.topButtonsContainer}>
                <div style={styles.leftButtons}>
                    <button style={styles.button} onClick={handleRegisterClick}>Register</button>
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
        listStyleType: "disc",
        paddingLeft: "20px",
        marginTop: "20px",
    },
    listItem: {
        fontSize: "25px",
        color: "white",
        textAlign: "left",
        marginTop: "10px",
    }
};

export default HomePage;
