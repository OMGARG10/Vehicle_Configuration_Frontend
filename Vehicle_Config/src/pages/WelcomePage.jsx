import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Sample data for manufacturers and models
const vehicleData = {
  "Small Car": {
    manufacturers: {
      Maruti: ["Alto", "WagonR"],
      Hyundai: ["Santro", "i10"]
    },
    minQty: 8
  },
  "Compact Car": {
    manufacturers: {
      Tata: ["Punch", "Tiago"],
      Renault: ["Kwid", "Triber"]
    },
    minQty: 6
  },
  Sedan: {
    manufacturers: {
      Honda: ["City", "Amaze"],
      Skoda: ["Slavia", "Octavia"]
    },
    minQty: 5
  },
  SUVs: {
    manufacturers: {
      Mahindra: ["XUV700", "Scorpio"],
      Hyundai: ["Creta", "Venue"]
    },
    minQty: 3
  },
  "Luxury Car": {
    manufacturers: {
      BMW: ["X5", "3 Series"],
      Audi: ["Q7", "A6"]
    },
    minQty: 2
  }
};

function WelcomePage() {
  const navigate = useNavigate();
  const isAuthorized = true;

  const [segment, setSegment] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [quantity, setQuantity] = useState("");

  const [availableManufacturers, setAvailableManufacturers] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [minQty, setMinQty] = useState(0);

  useEffect(() => {
    if (segment) {
      const data = vehicleData[segment];
      setAvailableManufacturers(Object.keys(data.manufacturers));
      setManufacturer("");
      setModel("");
      setAvailableModels([]);
      setMinQty(data.minQty);
      setQuantity(data.minQty);
    }
  }, [segment]);

  useEffect(() => {
    if (segment && manufacturer) {
      const models = vehicleData[segment].manufacturers[manufacturer];
      setAvailableModels(models);
      setModel("");
    }
  }, [manufacturer]);

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
        <select value={segment} onChange={(e) => setSegment(e.target.value)} style={inputStyle}>
          <option value="">-- Select Vehicle Segment --</option>
          {Object.keys(vehicleData).map((seg) => (
            <option key={seg} value={seg}>{seg}</option>
          ))}
        </select>

        <select
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
          disabled={!segment}
          style={inputStyle}
        >
          <option value="">-- Select Manufacturer --</option>
          {availableManufacturers.map((mfr) => (
            <option key={mfr} value={mfr}>{mfr}</option>
          ))}
        </select>

        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={!manufacturer}
          style={inputStyle}
        >
          <option value="">-- Select Model --</option>
          {availableModels.map((mdl) => (
            <option key={mdl} value={mdl}>{mdl}</option>
          ))}
        </select>

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder={`Minimum Quantity: ${minQty}`}
          style={inputStyle}
          min={minQty}
        />

        <button
          onClick={() => {
            if (quantity < minQty) {
              alert(`Minimum quantity for ${segment} is ${minQty}`);
              return;
            }

            navigate("/configuration", {
              state: {
                segment,
                manufacturer,
                model,
                quantity
              }
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