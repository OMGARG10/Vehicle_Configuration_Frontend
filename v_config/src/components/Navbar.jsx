import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      backgroundColor: "#1a1a1a",
      padding: "1rem 0",
      zIndex: 999,
      boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
    }}>
      <ul style={{
        display: "flex",
        justifyContent: "center",
        listStyle: "none",
        margin: 0,
        padding: 0,
        gap: "2rem"
      }}>
        {["/",  "/about", "/contact", "/registration","/signon",].map((path, index) => {
          const labels = ["Home", "About Us", "Contact Us", "Registration", "Sign-In",];
          return (
            <li key={path}>
              <Link
                to={path}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "1rem"
                }}
                onMouseOver={e => e.target.style.color = "#00aced"}
                onMouseOut={e => e.target.style.color = "#fff"}
              >
                {labels[index]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Navbar;