/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./App.css";
import FAQ from "./Components/HomePage/FAQ";
import Contact from "./Components/HomePage/ContactUs";
import { useAuth } from "./Common/AuthContext";
import { useNavigate } from "react-router-dom";
import { API, axios } from "./Common/Constants";

function App() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const handleLogout = async () => {
    await axios.get(API.auth.logout);
    logout();
    nav("/");
  };
  return (
    <div>
      <div className="landing-container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <h1 className="logo">J3Mail</h1>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
            {user ? (
              <div>
                <button
                  onClick={() => {
                    nav("/mail/");
                  }}
                >
                  Inbox
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Signout
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => {
                    nav("/auth/login");
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    nav("/auth/signup");
                  }}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <header className="hero" id="home">
          <h2>
            Welcome to <span className="highlight">J3Mail</span>{" "}
            {user ? `, ${user.name}` : ""}
          </h2>
          <p className="subtext">
            J3Mail is a secure and private email service offering end-to-end
            encryption to ensure the confidentiality of your communications.
            Designed for reliability and speed, it provides a spam-free
            experience accessible across multiple devices.{" "}
          </p>
          <div className="hero-buttons">
            {user ? (
              <button className="cta-btn" onClick={(e) => nav("/mail")}>
                Check My Mails
              </button>
            ) : (
              <button className="cta-btn" onClick={(e) => nav("/auth/signup")}>
                Get Started
              </button>
            )}
          </div>
        </header>

        {/* Features Section */}
        <section className="features" id="features">
          <div className="feature-card">
            <h3>🔒 End-to-End Encryption</h3>
            <p>Your emails are encrypted for ultimate privacy.</p>
          </div>
          <div className="feature-card">
            <h3>📧 Fast & Reliable</h3>
            <p>Experience instant email delivery with zero delays.</p>
          </div>
          <div className="feature-card">
            <h3>🔑 Secure Authentication</h3>
            <p>
              Multi-layered encrypted login ensures only you can access your
              emails, protecting against unauthorized access.
            </p>
          </div>
          <div className="feature-card">
            <h3>📱 Multi-Device Access</h3>
            <p>Check your emails anytime, anywhere on any device.</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Multi-Layer Encryption</h3>
            <p>
              Combines AES, RSA, and ECC encryption to ensure maximum security
              and privacy.
            </p>
          </div>
          <div className="feature-card">
            <h3>📜 Cryptographic Integrity</h3>
            <p>
              Uses digital signatures and hashing to verify email authenticity
              and prevent tampering.
            </p>
          </div>
        </section>
        <div id="faq">
          <FAQ />
        </div>
        <div id="contact">
          <Contact />
        </div>
        <footer>
          <p>© 2025 J3Mail. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
