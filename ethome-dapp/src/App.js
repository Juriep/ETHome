// App.js

import React, { useState } from "react";
import WalletConnect from "./WalletConnect";

const App = () => {
 
  return (
    <div style={styles.container}>
      {/* Top buttons for "Register" and "Login" */}
      <div style={styles.topButtonsContainer}>
        <div style={styles.leftButtons}>
          <button style={styles.button}>Register</button>
          <button style={styles.button}>Login</button>
        </div>
        {/* Wallet Connect Component */}
        <WalletConnect  />
      </div>

      {/* Main title */}
      <h1 style={styles.title}>ETHome</h1>

      {/* Subtitle */}
      <p style={styles.subtitle}>
        Welcome to ETHome where your dream house is waiting for you!
      </p>

      </div>
  );
};

// Styles for the component
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
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
    gap: "10px", // Space between "Register" and "Login" buttons
  },
  button: {
    backgroundColor: "#28a745", // Green color
    color: "white",
    padding: "20px 40px", // Increased padding for bigger buttons
    fontSize: "18px", // Increased font size for button text
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  title: {
    fontSize: "64px",
    color: "#6A0DAD", // Purple color
    textAlign: "center",
  },
  subtitle: {
    fontSize: "18px",
    color: "#333",
    textAlign: "center",
    marginTop: "20px",
  },
  connectedAccount: {
    fontSize: "18px",
    color: "#333",
    textAlign: "center",
    marginTop: "20px",
  },
};

export default App;
