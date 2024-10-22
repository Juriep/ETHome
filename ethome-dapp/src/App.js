// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Authentication from "./Authentication";
import UserRegistration from "./UserRegistration";
import HomePage from "./HomePage";
import ListApartment from "./ListApartment"
import { WalletProvider } from "./WalletContext"; // Import WalletProvider

function App() {
  return (
    <Router>
      <WalletProvider>
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/register" element={<UserRegistration />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/listApartment" element={<ListApartment />} />
        </Routes>
      </WalletProvider>
    </Router>
  );
}

export default App;
