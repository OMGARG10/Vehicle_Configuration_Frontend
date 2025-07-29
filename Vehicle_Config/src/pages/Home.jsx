import React, { useEffect, useState } from "react";

const carImages = [
  "/images/1.jpeg",
  "/images/2.jpeg",
  "/images/3.jpeg",
  "/images/4.jpeg",
  "/images/5.jpeg",
  "/images/6.jpeg"
];

function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % carImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${carImages[currentImage]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "background-image 1s ease-in-out",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* 🌐 Floating Menu Bar */}
      <nav
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          padding: "1rem",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 10
        }}
      >
        {["Home","About Us","Contact Us","Registration","Sign In",].map(label => (
          <button
            key={label}
            style={{
              background: "transparent",
              border: "2px solid #fff",
              borderRadius: "5px",
              padding: "0.5rem 1rem",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background 0.3s"
            }}
            onClick={() => alert(`${label} clicked`)}
            onMouseEnter={e =>
              (e.target.style.background = "rgba(255,255,255,0.2)")
            }
            onMouseLeave={e => (e.target.style.background = "transparent")}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* 🚗 Explore Button */}
      <button
        style={{
          marginTop: "30rem",
          padding: "1rem 2rem",
          fontSize: "1.5rem",
          fontWeight: "bold",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
          cursor: "pointer"
        }}
        onClick={() => alert("Exploring Cars!")}
      >
        Explore
      </button>
    </div>
  );
}

export default Home;