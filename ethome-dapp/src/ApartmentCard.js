import React from 'react';

const ApartmentCard = ({ image, description, price }) => (
  <div className="apartment-card">
    <img src={image} alt="Apartment" />
    <div className="content">
      <h3>Description:</h3>
      <p>{description}</p>
      <div className="price-container">
        <h3>Price:</h3>
        <p className="price-value">{price}</p>
      </div>
      <button className="buy-button">Buy</button>
    </div>
  </div>
);

export default ApartmentCard;
