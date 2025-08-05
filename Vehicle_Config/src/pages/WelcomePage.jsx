import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const navigate = useNavigate();
  const isAuthorized = true;

  const [segments, setSegments] = useState([]);
  const [segId, setSegmentId] = useState("");

  const [manufacturers, setManufacturers] = useState([]);
  const [mfgId, setManufacturerId] = useState("");

  const [models, setModels] = useState([]);
  const [modelId, setModelId] = useState("");

  const [quantity, setQuantity] = useState("");
  const [minQty, setMinQty] = useState(1); // new state to track minimum

  // Fetch segments on mount
  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const res = await fetch("http://localhost:8080/segments");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setSegments(data);
      } catch (error) {
        console.error("Failed to fetch segments:", error);
      }
    };
    fetchSegments();
  }, []);

  // Fetch manufacturers when segment changes
  useEffect(() => {
    if (!segId) {
      setManufacturers([]);
      setManufacturerId("");
      setModels([]);
      setModelId("");
      return;
    }

    fetch(`http://localhost:8080/manufacturers/by-segment/${segId}`)
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setManufacturers(data);
      })
      .catch(err => {
        console.error("Failed to fetch manufacturers:", err);
        setManufacturers([]);
      });
  }, [segId]);

  // Fetch models when manufacturer or segment changes
  useEffect(() => {
    if (!mfgId || !segId) {
      setModels([]);
      setModelId("");
      return;
    }

    fetch(`http://localhost:8080/models/by-segment/${segId}/manufacturer/${mfgId}`)
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setModels(data);
        setModelId("");
      })
      .catch(err => {
        console.error("Error fetching models:", err);
        setModels([]);
        setModelId("");
      });
  }, [mfgId, segId]);

  // Handle model selection change
  const handleModelChange = (e) => {
    const selectedId = e.target.value;
    setModelId(selectedId);

    const selectedModel = models.find(mdl => String(mdl.modelId) === selectedId);
    if (selectedModel) {
      setMinQty(selectedModel.minQty);
      setQuantity(selectedModel.minQty);
    } else {
      setMinQty(1);
      setQuantity("");
    }
  };

  // Handle quantity input with validation
  const handleQuantityChange = (e) => {
    const enteredQty = parseInt(e.target.value, 10);
    if (enteredQty >= minQty) {
      setQuantity(enteredQty);
    } else {
      alert(`Quantity cannot be less than minimum required: ${minQty}`);
    }
  };

  if (!isAuthorized) {
    return <h2 style={{ textAlign: "center", marginTop: "5rem" }}>Access Denied</h2>;
  }

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
        fontFamily: "Arial, sans-serif",
        padding: "1rem",
        overflowY: "auto"
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>Welcome Page</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "2rem",
          borderRadius: "8px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          width: "100%",
          maxWidth: "600px"
        }}
      >
        <select value={segId} onChange={(e) => setSegmentId(e.target.value)} style={inputStyle}>
          <option value="">-- Select Vehicle Segment --</option>
          {segments.map((seg) => (
            <option key={seg.segId} value={seg.segId}>{seg.segName}</option>
          ))}
        </select>

        <select
          value={mfgId}
          onChange={(e) => setManufacturerId(e.target.value)}
          disabled={!segId}
          style={inputStyle}
        >
          <option value="">-- Select Manufacturer --</option>
          {Array.isArray(manufacturers) && manufacturers.map(m => (
            <option key={m.mfgId} value={m.mfgId}>{m.mfgName}</option>
          ))}
        </select>

        <select
          value={modelId}
          onChange={handleModelChange}
          disabled={!mfgId}
          style={inputStyle}
        >
          <option value="">-- Select Model --</option>
          {models.map((mdl) => (
            <option key={mdl.modelId} value={mdl.modelId}>{mdl.modelName}</option>
          ))}
        </select>

        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder={`Min quantity: ${minQty}`}
          style={inputStyle}
          min={minQty}
        />

        <button
          onClick={() => {
            if (!segId || !mfgId || !modelId) {
              alert("Please select segment, manufacturer and model.");
              return;
            }
            if (!quantity || quantity < minQty) {
              alert(`Quantity must be at least ${minQty}`);
              return;
            }

            navigate("/configuration", {
              state: { segId, mfgId, modelId, quantity: Number(quantity) }
            });
          }}
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
          Go
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "0.8rem",
  borderRadius: "4px",
  border: "none",
  fontSize: "1rem"
};

export default WelcomePage;
