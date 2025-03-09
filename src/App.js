import React from "react";
import "./App1.css";

const Home = () => {
  const goToLogin = () => {
    window.location.href = "/login"; // Redirect to LoginPage
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to J3Mail</h1>
        <p>Fast, secure, and reliable email service.</p>
        <button className="login-btn" onClick={goToLogin}>
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Home;
