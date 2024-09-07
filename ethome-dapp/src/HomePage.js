import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { checkWalletConnection, connectWallet, disconnectWallet } from './WalletConnectionUtils'; // Import wallet utilities
import ApartmentCard from "./ApartmentCard";
import './HomePage.css'; 

export default function HomePage() {
  const canvasRef = useRef(null);
  const [apartments, setApartments] = useState([]);
  const [account, setAccount] = useState(null); // State to store the connected wallet address
  const navigate = useNavigate(); 
  const location = useLocation(); 

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

  useEffect(() => {
    if (location.state && location.state.newApartment) {
      const newApartment = location.state.newApartment;
      setApartments((prevApartments) => {
        const exists = prevApartments.some((apt) => apt.id === newApartment.id);
        if (!exists) {
          return [...prevApartments, newApartment];
        }
        return prevApartments;
      });
    }
  }, [location.state]); 

  const handleListApartment = () => {
    navigate("/listApartment");
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
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden', backgroundColor: 'black' }}>
      <canvas ref={canvasRef} className="canvas-container" />

      <div className="main-content">
        <div className="header">
          <h1 className="title">ETHome</h1>
          <button className="button" onClick={handleWalletButtonClick}>
            {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : "Connect Wallet"}
          </button>
        </div>

        <div className="list-apartment-button">
          <button
            className="button"
            onClick={handleListApartment}
          >
            List apartment for sale
          </button>
        </div>

        <div className="apartment-grid">
          {apartments.map((apt) => (
            <ApartmentCard key={apt.id} {...apt} />
          ))}
        </div>
      </div>
    </div>
  );
}
