import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // Import the CSS file for star animations
import generateStars from "./GenerateStars"; // Correct import for the default export

const UserRegistration = () => {
    const navigate = useNavigate();
    const [stars, setStars] = useState([]); // State for stars in the background

    useEffect(() => {
        setStars(generateStars(1000)); // Generate stars
    }, []);

    const handleRegisterClick = () => {
        navigate("/register");
    };

    return (
        <div style={styles.container}>
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
            <div style={styles.content}>
                <h1 style={styles.title}>ETHome</h1>
                <p style={styles.subtitle}>Please register your account</p>
                <button style={styles.button} onClick={handleRegisterClick}>Register</button>
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
        overflow: "hidden",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
    },
    button: {
        backgroundColor: "#28a745",
        color: "white",
        padding: "15px 30px",
        fontSize: "20px",
        border: "none",
        borderRadius: "15px",
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
    }
};

export default UserRegistration;
