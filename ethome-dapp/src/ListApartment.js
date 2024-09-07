import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { checkWalletConnection, connectWallet, disconnectWallet } from './WalletConnectionUtils'; // Import wallet utilities
import './ListApartment.css'; // Import the CSS file

export default function ListApartment() {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(""); // State to store the price input value
  const [account, setAccount] = useState(null); // State to store the connected wallet address
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const stars = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < 350; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          speedX: Math.random() * 0.1,
          speedY: Math.random() * 0.1,
        });
      }
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.x += star.speedX;
        star.y += star.speedY;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      });
    };

    const animate = () => {
      drawStars();
      requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    // Check wallet connection on mount
    checkWalletConnection(setAccount, (address) => {
      console.log("Wallet connected:", address);
    });
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePriceChange = (event) => {
    const value = event.target.value;
    // Only allow numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const handleListApartment = () => {
    const newApartment = {
      id: Date.now(), // Generate a unique ID
      description,
      price,
      image, // Image remains in the state, but we're not storing it in local storage
    };

    // Instead of saving to local storage, we pass the data via the React Router's state
    navigate("/Home", { state: { newApartment } });
  };

  const handleWalletButtonClick = async () => {
    if (account) {
      // If wallet is connected, disconnect
      await disconnectWallet(setAccount, () => {
        console.log("Wallet disconnected");
      });
    } else {
      // If wallet is not connected, connect
      await connectWallet(setAccount, (address) => {
        console.log("Wallet connected:", address);
      });
    }
  };

  return (
    <div className="container">
      <canvas ref={canvasRef} className="canvas" />

      <div className="content">
        <h1 className="title">ETHome</h1>

        <p className="paragraph">
          Please enter the following information to complete the apartment listing.
          By clicking the "List apartment" button a new apartment ownership will be added to the
          wallet connected.
        </p>

        <label htmlFor="imageUpload" className="image-upload">
          {image ? (
            <img src={image} alt="Uploaded apartment" className="image" />
          ) : (
            <span>Click to upload image</span>
          )}
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden-input"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={handleDescriptionChange}
          className="input"
        />

        <input
          type="text"
          placeholder="ETH price"
          value={price}
          onChange={handlePriceChange}
          className="input"
          inputMode="decimal" // Mobile-friendly input type for numbers and decimals
          pattern="[0-9]*"   // Ensures only numbers are allowed
        />

        <button className="button" onClick={handleListApartment}>
          List apartment
        </button>

        <div className="wallet-section">
          <button className="wallet-button" onClick={handleWalletButtonClick}>
            {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </div>
  );
}
