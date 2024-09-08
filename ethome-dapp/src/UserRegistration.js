import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./UserRegistration.css"; // Import the CSS file for styles
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { connectWallet, disconnectWallet, checkWalletConnection } from './WalletConnectionUtils'; // Import connection functions

const UserRegistration = () => {
  const canvasRef = useRef(null); // Reference to the canvas element
  const [username, setUsername] = useState(""); // State for username input
  const [age, setAge] = useState(""); // State for age input
  const [account, setAccount] = useState(null); // State for wallet address
  const navigate = useNavigate(); // Initialize useNavigate for programmatic navigation

  // Initialize stars and animation on component mount
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const stars = []; // Array to hold star objects

    // Resize the canvas to fill the window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    // Initialize star positions and sizes
    const initStars = () => {
      stars.length = 0; // Clear existing stars
      for (let i = 0; i < 350; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          speedX: Math.random() * 0.1, // Random speed for X axis
          speedY: Math.random() * 0.1, // Random speed for Y axis
        });
      }
    };

    // Draw the stars on the canvas
    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Update star position for random movement
        star.x += star.speedX;
        star.y += star.speedY;

        // If star moves out of bounds, reposition it to the opposite side
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      });
    };

    // Animation loop
    const animate = () => {
      drawStars();
      requestAnimationFrame(animate);
    };

    resizeCanvas(); // Initial canvas setup
    animate(); // Start animation

    // Handle window resize
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Check wallet connection on component mount
  useEffect(() => {
    checkWalletConnection(setAccount, handleAccountChange);
  }, []);

  // Handle account change
  const handleAccountChange = (newAccount) => {
    setAccount(newAccount);
  };

  // Handle wallet connection
  const handleConnect = async () => {
    await connectWallet(setAccount, handleAccountChange);
  };

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    await disconnectWallet(setAccount, handleAccountChange);
  };

  // Handle registration and navigation
  const handleRegisterClick = () => {
    if (!username || !age) {
      alert("Please fill in both fields.");
      return;
    }

    alert(`Welcome ${username}`);

    setTimeout(() => {
      navigate("/Home");
    }, 100); // Redirect after 1 second
  };

  // Handle age input to restrict to numbers only
  const handleAgeChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAge(value);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Canvas for starry background */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Main content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <h1 className="text-green-500 text-6xl font-bold mb-12 mt-20">ETHome</h1>
        <div className="text-container flex flex-col items-center">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field mb-6 input-separation" // Apply input-separation class here
          />
          <input
            type="text"
            placeholder="Age"
            value={age}
            onChange={handleAgeChange}
            className="input-field"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hover-shadow rounded-full bg-green-500 px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black mt-10"
          onClick={handleRegisterClick}
        >
          Register
        </motion.button>

        {/* Connect Wallet Button */}
        <div className="absolute top-0 right-0 m-4">
          {account ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="connect-wallet-button"
              onClick={handleDisconnect}
            >
              {account.slice(0, 6)}...{account.slice(-4)} {/* Abbreviated address */}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="connect-wallet-button"
              onClick={handleConnect}
            >
              Connect Wallet
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
