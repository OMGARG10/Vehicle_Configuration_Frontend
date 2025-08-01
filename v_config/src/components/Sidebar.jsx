const Sidebar = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "200px",
        backgroundColor: "rgba(0, 0, 0, 0.6)", // semi-transparent over background
        color: "white",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        zIndex: 1000, // ensure it stays on top
        boxShadow: "2px 0 5px rgba(0,0,0,0.3)"
      }}
    >
      <h2>Menu</h2>
      <a href="/" style={{ color: "white", textDecoration: "none" }}>Home</a>
      <a href="/about" style={{ color: "white", textDecoration: "none" }}>About</a>
      <a href="/contact" style={{ color: "white", textDecoration: "none" }}>Contact</a>
    </div>
  );
};