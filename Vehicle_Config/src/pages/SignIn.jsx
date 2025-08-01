import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Import navigation hook

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // 👈 Initialize navigation

  const handleSignIn = (e) => {
    e.preventDefault();

    // Simulated authentication logic
    if (email && password) {
      alert(`Signed in as ${email}`);
      navigate("/welcome"); // 👈 Redirect to Welcome Page
    } else {
      alert("Please enter valid credentials.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #1e3c72, #2a5298)",
        color: "#fff",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <h1>Welcome Back</h1>
      <form
        onSubmit={handleSignIn}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "2rem",
          borderRadius: "8px",
          backgroundColor: "rgba(255, 255, 255, 0.1)"
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "0.8rem",
            borderRadius: "4px",
            border: "none",
            fontSize: "1rem"
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "0.8rem",
            borderRadius: "4px",
            border: "none",
            fontSize: "1rem"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.8rem",
            borderRadius: "4px",
            border: "none",
            fontWeight: "bold",
            backgroundColor: "#fff",
            color: "#2a5298",
            cursor: "pointer"
          }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default SignIn;