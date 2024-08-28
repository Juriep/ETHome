import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserRegistration = () => {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");

    const navigate = useNavigate();

    const handleRegister = () => {
        if (!name) {
            alert("Please enter your name.");
            return;
        }
        if (!age) {
            alert("Please enter your age.");
            return;
        }
        alert("Welcome to the ETHome Dapp " + name + 
            ". Now you will be redirected to the home page where you can login" 
            + " into your account");

        navigate("/");
    };

    // Function to ensure only numbers are entered in the Age field
    const handleAgeChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // RegEx to test if the value is all digits
            setAge(value);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>ETHome</h1>
            <p style={styles.prompt}>To register into the Dapp, please enter the following information:</p>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
            />
            <input
                type="text" // Changed to 'text' to hide spinner arrows
                placeholder="Age"
                value={age}
                onChange={handleAgeChange}
                style={{ ...styles.input, ...styles.inputNumber }} // Merged styles
                inputMode="numeric" // Keeps the numeric keypad on mobile devices
            />
            <button style={styles.button} onClick={handleRegister}>
                Register
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start", // Align items towards the top of the page
        height: "100vh", // Full viewport height
        width: "100vw",  // Full viewport width
        backgroundColor: "black",
        color: "white",
        padding: "20px",
        paddingTop: "13vh", // Move content slightly down from the top
    },
    title: {
        fontSize: "64px",
        color: "#28a745",
        textAlign: "center",
        marginBottom: "20px",
    },
    prompt: {
        fontSize: "25px",
        color: "white",
        textAlign: "center",
        marginTop: "10px",
        marginBottom: "20px",
    },
    input: {
        backgroundColor: "black",
        color: "white",
        border: "2px solid #28a745",
        padding: "17px",
        marginTop: "25px",
        width: "80%",
        maxWidth: "350px",
        borderRadius: "10px",
        textAlign: "center", // Center text inside input fields
        fontSize: "17px", // Increased font size for larger text
    },
    inputNumber: {
        MozAppearance: "textfield", // Removes spinner controls in Firefox
        appearance: "textfield", // Removes spinner controls in Chrome
    },
    button: {
        backgroundColor: "#28a745",
        color: "white",
        padding: "17px",
        fontSize: "18px",
        border: "none",
        borderRadius: "10px", // Match the input border radius for consistency
        cursor: "pointer",
        marginTop: "35px",
        width: "80%", // Match the width of the input fields
        maxWidth: "300px", // Ensure consistency with input field width
    },
};

export default UserRegistration;
