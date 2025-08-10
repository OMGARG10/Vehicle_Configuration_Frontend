import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function DefaultConfigurationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { modelId, quantity } = location.state || {};

  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    if (!modelId) return;

    fetch(`http://localhost:8080/models/default/${modelId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setModelInfo(data);
      })
      .catch((err) => {
        console.error("Failed to fetch default configuration:", err);
        setModelInfo(null);
      });
  }, [modelId]);

  const handleConfirm = async () => {
    if (!modelInfo) return;

    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        alert("User not logged in.");
        return;
      }

      const quantityToUse = quantity ?? modelInfo.minQty;

      // Prepare default components list (without alternates)
      const details = modelInfo.defaultComponents.map((comp) => ({
        compId: comp.component.compId,
        isAlternate: "N",
      }));

      const payload = {
        modelId: modelInfo.modelId,
        quantity: quantityToUse,
        userId: parseInt(userId),
        details: details,
      };

      const response = await fetch("http://localhost:8080/invoices/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create invoice");
      }

      const invoiceData = await response.json();

      navigate("/invoice", {
        state: {
          invoice: invoiceData,
          modelId: modelInfo.modelId,
          modelName: modelInfo.modelName,
          totalPrice: modelInfo.price * quantityToUse,
          basePrice: modelInfo.price,
          quantity: quantityToUse,
          userId: userId,
          defaultComponents: modelInfo.defaultComponents,
        },
      });
    } catch (error) {
      console.error("Invoice creation failed:", error);
      alert("Failed to create invoice.");
    }
  };


  const handleConfigure = () =>
    navigate("/configure", {
      state: {
        modelId: modelInfo.modelId,
        quantity: quantity ?? modelInfo.minQty,
      },
    });

  const handleModify = () => navigate("/welcome");

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: "1rem" }}>Default Configuration</h1>

      <div style={cardStyle}>
        {modelInfo && modelInfo.imagePath && (
          <img
            src={`http://localhost:8080${modelInfo.imagePath}`}
            alt={modelInfo.modelName}
            style={imageStyle}
          />
        )}

        {modelInfo ? (
          <>
            <div><strong>Segment:</strong> {modelInfo.segment?.segName}</div>
            <div><strong>Manufacturer:</strong> {modelInfo.manufacturer?.mfgName}</div>
            <div><strong>Model:</strong> {modelInfo.modelName}</div>
            <div><strong>Quantity:</strong> {quantity ?? modelInfo.minQty}</div>
            <div><strong>Price per Unit:</strong> ₹{modelInfo.price}</div>
            <div><strong>Total Price:</strong> ₹{(quantity ?? modelInfo.minQty) * modelInfo.price}</div>

            <hr style={{ borderColor: "#fff", margin: "1rem 0" }} />

            <h3>Default Components</h3>
            {modelInfo.defaultComponents?.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Component Name</th>
                    <th style={tableHeaderStyle}>Component Type</th>
                    <th style={tableHeaderStyle}>Is Configurable</th>
                  </tr>
                </thead>
                <tbody>
                  {modelInfo.defaultComponents.map((comp) => (
                    <tr key={comp.configId}>
                      <td style={tableCellStyle}>{comp.component?.compName || "Unknown"}</td>
                      <td style={tableCellStyle}>{comp.compType}</td>
                      <td style={tableCellStyle}>{comp.isConfigurable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No default components found for this model.</p>
            )}
          </>
        ) : (
          <p>Loading or no data found.</p>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.5rem" }}>
          <button onClick={handleConfirm} style={buttonStyle}>Confirm Order</button>
          <button onClick={handleConfigure} style={buttonStyle}>Configure</button>
          <button onClick={handleModify} style={buttonStyle}>Modify Selection</button>
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "linear-gradient(to right, #1e3c72, #2a5298)",
  color: "#fff",
  fontFamily: "Arial, sans-serif",
  padding: "2rem",
  overflowY: "auto",
  position: "relative",
};

const cardStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  padding: "2rem",
  borderRadius: "8px",
  width: "100%",
  maxWidth: "800px",
  position: "relative",
};

const imageStyle = {
  width: "150px",
  borderRadius: "8px",
  position: "absolute",
  top: "2rem",
  right: "2rem",
  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
  backgroundColor: "#fff",
};

const tableHeaderStyle = {
  borderBottom: "1px solid #fff",
  padding: "0.5rem",
  textAlign: "left",
};

const tableCellStyle = {
  padding: "0.5rem",
  borderBottom: "1px solid rgba(255,255,255,0.3)",
};

const buttonStyle = {
  padding: "0.8rem 1.2rem",
  borderRadius: "4px",
  border: "none",
  fontWeight: "bold",
  backgroundColor: "#fff",
  color: "#2a5298",
  cursor: "pointer",
};

export default DefaultConfigurationPage;
