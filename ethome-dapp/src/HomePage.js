import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import generateStars from "./GenerateStars"; // Correct import for the default export
import "./HomePage.css";
import { connectWallet, disconnectWallet } from "./WalletConnectionUtils";

const HomePage = () => {
    const [stars, setStars] = useState([]); // State for stars in the background
    const [account, setAccount] = useState(null); // State for connected account
    const navigate = useNavigate(); // Hook for navigation

    // Handle account change
    const handleAccountChange = (newAccount) => {
        setAccount(newAccount);
    };

    // Generate random stars for the background
    useEffect(() => {
        setStars(generateStars(1000)); // Adjust number of stars as needed
    }, []);

    return (
        <div className="page-container">
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
            <div className="content">
                <h1 className="title">ETHome</h1>
                <p className="description">Please connect your wallet to proceed into the Dapp</p>
                <button
                    className="connect-button"
                    onClick={account ? () => disconnectWallet(handleAccountChange) : () => connectWallet(handleAccountChange)}
                >
                    {account
                        ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
                        : "Connect Wallet"
                    }
                </button>
            </div>
        </div>
    );
};

export default HomePage;
