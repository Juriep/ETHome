import { useEffect, useRef, useState } from "react";
import ApartmentCard from "./ApartmentCard";
import './HomePage.css'; // Import the CSS file

export default function Component() {
  const canvasRef = useRef(null);
  const [apartments, setApartments] = useState([]);

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

  const handleListApartment = () => {
    const newApartment = {
      image: "/placeholder.svg?height=200&width=300",
      description: "New apartment listing",
      price: "X ETH",
    };
    setApartments([...apartments, newApartment]);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden', backgroundColor: 'black' }}>
      <canvas ref={canvasRef} className="canvas-container" />

      <div className="main-content">
        <div className="header">
          <h1 className="title">ETHome</h1>
          <button className="button">
            Connect Wallet
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
          {apartments.map((apt, index) => (
            <ApartmentCard key={index} {...apt} />
          ))}
        </div>
      </div>
    </div>
  );
}