import React from 'react';

const ApartmentCard = ({ image, description, price }) => (
  <div style={{
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '20px',
    border: '1px solid #38a169',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }}>
    <img src={"image"} alt="Apartment" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
    <div style={{ padding: '16px', flex: '1' }}>
      <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>Description:</h3>
      <p style={{ color: '#d1d5db', fontSize: '14px', marginBottom: '8px' }}>{description}</p>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h3 style={{ color: 'white', fontWeight: 'bold', marginRight: '8px' }}>Price:</h3>
        <p style={{ color: '#38a169', fontWeight: 'bold', margin: 0 }}>{price}</p>
      </div>
    </div>
  </div>
);

export default ApartmentCard;
