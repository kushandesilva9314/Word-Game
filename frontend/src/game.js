import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom"; // For navigation
import { FaArrowLeft } from "react-icons/fa"; // Back icon
import Gamebox from "./components/Gamebox";

const Game = () => {
  return (
    <div
      style={{
        backgroundColor: "#1A202C", // Dark theme background
        minHeight: "100vh",
        color: "#E2E8F0", // Light text for dark theme
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Container>
        <div
          className="d-flex align-items-center my-4"
          style={{
            borderBottom: "2px solid #4A5568", // Subtle underline for separation
            paddingBottom: "1rem",
          }}
        >
          {/* Back Icon */}
          <Link
            to="/home"
            className="text-decoration-none me-3"
            style={{ color: "#E2E8F0", display: "flex", alignItems: "center" }}
          >
            <FaArrowLeft size={28} className="me-2" />
            <span style={{ fontSize: "1rem", fontWeight: "500" }}>Back</span>
          </Link>

          {/* Game Title */}
          <h1
            className="text-center flex-grow-1"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "2.5rem",
              fontWeight: "700",
              textTransform: "uppercase",
              margin: "0 auto",
              color: "#63B3ED", // Accent color
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)", // Subtle glow
            }}
          >
            Word Guesser
          </h1>
        </div>

        {/* Game Box */}
        <div className="text-center mt-5">
          <Gamebox />
        </div>
      </Container>
    </div>
  );
};

export default Game;
