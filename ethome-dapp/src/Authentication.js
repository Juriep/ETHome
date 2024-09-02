"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { connectWallet, disconnectWallet } from "./WalletConnectionUtils"; // Import wallet connection functions
import "./Authentication.css"; // Import your custom CSS

const Authentication = () => {
  const canvasRef = useRef(null); // Reference to the canvas element
  const navigate = useNavigate(); // Initialize useNavigate for programmatic navigation
  const [account, setAccount] = useState(null); // State for connected account

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

  const handleAccountChange = (newAccount) => {
    setAccount(newAccount);
    if (newAccount) {
      // Show an alert when the wallet is successfully connected
      alert(`Wallet ${newAccount} successfully connected`);
      // Navigate to the register page after the alert is acknowledged
      navigate("/register");
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet(setAccount, handleAccountChange);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Canvas for starry background */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Main content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <h1 className="text-green-500 text-6xl font-bold mt-20">ETHome</h1>

        {/* Container for description and list with black background */}
        <div className="text-container flex flex-col items-center">
          <p className="text-xl text-white">
            Welcome to ETHome, before proceeding into the Dapp make sure you are
            registered.
          </p>
        </div>

        <div className="mt-16 flex gap-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hover-shadow rounded-full bg-green-500 px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black"
            onClick={handleConnectWallet}
          >
            Register with wallet
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hover-shadow rounded-full bg-green-500 px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black"
            onClick={handleConnectWallet}
          >
            Login with wallet
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
