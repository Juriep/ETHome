// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage"; // Assume this is your main page component
import UserRegistration from "./UserRegistration"; // This will be the register page component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<UserRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;
