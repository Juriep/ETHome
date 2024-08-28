import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import Authentication from "./Authentication";
import UserRegistration from "./UserRegistration";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/register" element={<UserRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;
