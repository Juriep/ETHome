import React from 'react';


const ApartmentCard = ({ image, description, price }) => (
  <div className="apartment-card">
    <img src={image} alt="Apartment" />
    <div className="content">
      <div className="description-container">
        <h3 className="label">Description:</h3>
        <p className="description">{description}</p>
      </div>
      <div className="price-container">
        <h3>Price:</h3>
        <p className="price-value">{price}</p>
      </div>
      <button className="buy-button">Buy</button>
    </div>
  </div>
);

export default ApartmentCard;
