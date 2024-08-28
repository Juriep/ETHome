import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import generateStars from "./GenerateStars"; // Correct import for the default export
import "./HomePage.css"; // Import the CSS file for star animations
import ConnectButton from "./ConnectButton"; // Import the ConnectButton component
import { connectWallet, disconnectWallet } from "./WalletConnectionUtils"; // Import wallet connection methods

const Authentication = () => {
    const navigate = useNavigate();
    const [stars, setStars] = useState([]); // State for stars in the background
    const [account, setAccount] = useState(null); // State for connected account

    useEffect(() => {
        setStars(generateStars(1000)); // Generate stars
    }, []);

    const handleRegisterClick = () => {
        navigate("/register");
    };

    // Handle account change
    const handleAccountChange = (newAccount) => {
        setAccount(newAccount);
    };

    return (
        <div style={styles.container}>
            {/* Star Background */}
            <div className="stars-background">
                {stars.map((star) => (
                    <div
                        key={star.key}
                        className="star"
                        style={{
                            width: star.size,
                            height: star.size,
                            top: star.top,
                            left: star.left,
                            animationDuration: star.animationDuration,
                            animationDelay: star.animationDelay,
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div style={styles.content}>
                <h1 style={styles.title}>ETHome</h1>
                <p style={styles.subtitle}>Welcome to ETHome, where your dream "house or apartment" is waiting for you!</p>
                <ul style={styles.list}>
                    <li style={styles.listItem}>If you are a new user, please register and connect your wallet.</li>
                    <li style={styles.listItem}>If you are already registered, log in and connect your wallet.</li>
                </ul>

                {/* Buttons positioned below the list */}
                <div style={styles.buttonContainer}>
                    <button style={styles.button} onClick={handleRegisterClick}>Register</button>
                    <button style={styles.button}>Login</button>
                </div>

                {/* Connect Button */}
                <ConnectButton
                    account={account}
                    onConnect={() => connectWallet(handleAccountChange)}
                    onDisconnect={() => disconnectWallet(handleAccountChange)}
                />
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "black",
        overflow: "hidden", // Ensures stars do not overflow the container
    },
    content: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center", // Centers text horizontally
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "50px",
        gap: "20px",
    },
    button: {
        backgroundColor: "#28a745",
        color: "white",
        padding: "15px 30px",
        fontSize: "20px",
        border: "none",
        borderRadius: "15px",
        cursor: "pointer",
        width: "120px",
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
        padding: "0", // Removes default padding
        margin: "20px 0", // Centers the list within its container
        textAlign: "center", // Centers the text horizontally
    },
    listItem: {
        fontSize: "25px",
        color: "white",
        marginTop: "10px",
    }
};

export default Authentication;
