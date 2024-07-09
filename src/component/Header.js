import React from 'react';
import logo from '../assets/Iammadeon.PNG'; // Adjust the path as necessary

function Header() {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
      <img src={logo} alt="Logo" style={{ marginRight: '10px', width: '150px', height: '50px' }} /> {/* Adjust styling as needed */}
      <h1>IAMMADEON</h1>
    </header>
  );
}

export default Header;