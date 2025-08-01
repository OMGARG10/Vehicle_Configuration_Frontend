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
  const [showIcons, setShowIcons] = useState(false);
  const toggleIcons = () => setShowIcons(prev => !prev);

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
        position: "relative"
      }}
    >

      {/* Explore Button */}
      <button
        style={{
           marginTop: "25rem",
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