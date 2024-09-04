import { useEffect, useRef, useState } from "react";
import "./ListApartment.css"; // Import the CSS file
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

export default function ListApartment() {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(""); // State to store the price input value
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
      image,
      description,
      price
    };

    // Save to local storage (or replace with your preferred state management method)
    localStorage.setItem('newApartment', JSON.stringify(newApartment));

    // Navigate to the /Home route
    navigate("/Home");
  };

  return (
    <div className="container">
      <canvas ref={canvasRef} className="canvas" />

      <div className="content">
        <h1 className="title">ETHome</h1>

        <p className="paragraph">
          Please enter the following information to complete the apartment listing.
          By clicking the "List apartment" button a new apartment ownership will be addressed to the
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
      </div>
    </div>
  );
}
