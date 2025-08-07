import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const typeMap = {
  S: "Standard",
  I: "Interior",
  E: "Exterior",
};

function ConfigurePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Expect modelId and userId in location.state; fallback to sessionStorage for userId
  const { modelId, userId: stateUserId } = location.state || {};
  const userId = stateUserId || sessionStorage.getItem("userId");

  const [defaultComponents, setDefaultComponents] = useState([]);
  const [alternateMap, setAlternateMap] = useState({});
  const [basePrice, setBasePrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedAlternates, setSelectedAlternates] = useState({});
  const [pendingAlternateSelection, setPendingAlternateSelection] = useState({});
  const [selectedType, setSelectedType] = useState("S");
  const [minQuantity, setMinQuantity] = useState(1); // store model min quantity
  const [quantity, setQuantity] = useState(1); // quantity user selects

  useEffect(() => {
    if (!modelId) return;

    fetch(`http://localhost:8080/models/configurable/${modelId}`)
      .then((res) => res.json())
      .then((data) => {
        setDefaultComponents(data);
      })
      .catch((err) => console.error("Error fetching default components:", err));

    fetch(`http://localhost:8080/models/alternate-components/${modelId}`)
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        for (const typeKey in data) {
          const compGroups = data[typeKey];
          for (const compId in compGroups) {
            if (!map[compId]) map[compId] = [];
            map[compId].push(...compGroups[compId]);
          }
        }
        setAlternateMap(map);
      })
      .catch((err) => console.error("Error fetching alternates:", err));

    fetch(`http://localhost:8080/models/price/${modelId}`)
      .then((res) => res.json())
      .then((price) => {
        setBasePrice(price);
        setTotalPrice(price);
        setSelectedAlternates({});
        setPendingAlternateSelection({});
      })
      .catch((err) => console.error("Error fetching base price:", err));

    // Fetch model min quantity
    fetch(`http://localhost:8080/models/${modelId}`)
      .then((res) => res.json())
      .then((model) => {
        setMinQuantity(model.minQty || 1);
        setQuantity(model.minQty || 1);
      })
      .catch((err) => console.error("Error fetching model details:", err));
  }, [modelId]);

  const recalcTotalPrice = (newSelectedAlternates) => {
    let newTotal = basePrice;
    for (const [compId, altId] of Object.entries(newSelectedAlternates)) {
      if (!altId) continue;
      const altList = alternateMap[compId] || [];
      const altObj = altList.find((alt) => alt.altId === altId);
      if (altObj) newTotal += altObj.deltaPrice;
    }
    setTotalPrice(newTotal);
  };

  const handlePendingChange = (compId, altId) => {
    setPendingAlternateSelection((prev) => ({
      ...prev,
      [compId]: altId,
    }));
  };

  const handleAddAlternate = (compId) => {
    const altId = pendingAlternateSelection[compId];
    if (!altId) {
      alert("Please select an alternate to add");
      return;
    }
    if (selectedAlternates[compId] === altId) {
      alert("This alternate is already added.");
      return;
    }
    const newSelected = {
      ...selectedAlternates,
      [compId]: altId,
    };
    setSelectedAlternates(newSelected);
    recalcTotalPrice(newSelected);

    setPendingAlternateSelection((prev) => ({
      ...prev,
      [compId]: "",
    }));
  };

  const handleRemoveAlternate = (compId) => {
    if (!(compId in selectedAlternates)) return;
    const newSelected = { ...selectedAlternates };
    delete newSelected[compId];
    setSelectedAlternates(newSelected);
    recalcTotalPrice(newSelected);
  };

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < minQuantity) {
      setQuantity(minQuantity);
    } else {
      setQuantity(val);
    }
  };

  // If no userId or modelId, show error or redirect
  if (!userId) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        User not logged in. Please login first.
      </div>
    );
  }

  if (!modelId) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        No model selected. Please select a model first.
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(to right, #1e3c72, #2a5298)",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>Configure Your Car</h1>
      <h3 style={{ marginBottom: "0.5rem" }}>
        Base Price: ₹{basePrice} | Total Price: ₹{totalPrice}
      </h3>

      <label style={{ marginBottom: "1rem", fontWeight: "bold" }}>
        Quantity (Min: {minQuantity}):
        <input
          type="number"
          min={minQuantity}
          value={quantity}
          onChange={handleQuantityChange}
          style={{
            marginLeft: "0.5rem",
            padding: "0.3rem",
            borderRadius: "4px",
            border: "none",
            width: "60px",
            fontWeight: "bold",
          }}
        />
      </label>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        {["S", "I", "E"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "4px",
              border: "none",
              backgroundColor: selectedType === type ? "#fff" : "#2a5298",
              color: selectedType === type ? "#2a5298" : "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {typeMap[type]}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: "2rem",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3>Configurable Components</h3>
          {defaultComponents
            .filter(
              (comp) => comp.compType === selectedType && comp.isConfigurable === "Y"
            )
            .map((comp) => {
              const compId = comp.component.compId.toString();
              const compName = comp.component.compName || `Component #${compId}`;
              const selectedAltId = selectedAlternates[compId];

              return (
                <div
                  key={comp.configId}
                  style={{
                    marginBottom: "1rem",
                    padding: "1rem",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "6px",
                  }}
                >
                  <h4>
                    {compName}
                    {selectedAltId &&
                      (() => {
                        const altObj = (alternateMap[compId] || []).find(
                          (alt) => alt.altId === selectedAltId
                        );
                        return altObj
                          ? ` (Replaced with ${altObj.alternateComponent?.compName})`
                          : "";
                      })()}
                  </h4>
                </div>
              );
            })}
        </div>

        <div style={{ flex: 2 }}>
          <h3>Available Alternates</h3>
          {defaultComponents
            .filter(
              (comp) => comp.compType === selectedType && comp.isConfigurable === "Y"
            )
            .map((comp) => {
              const compId = comp.component.compId.toString();
              const compName = comp.component.compName || `Component #${compId}`;
              const alternatesForComp = alternateMap[compId] || [];
              const selectedAltId = selectedAlternates[compId];
              const pendingAltId = pendingAlternateSelection[compId] || "";

              return (
                <div
                  key={comp.configId}
                  style={{
                    marginBottom: "2rem",
                    padding: "1rem",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "6px",
                  }}
                >
                  <h4>{compName}</h4>
                  {alternatesForComp.length === 0 ? (
                    <p>No alternates available</p>
                  ) : (
                    <>
                      <select
                        id={`alternate-select-${compId}`}
                        value={pendingAltId}
                        onChange={(e) =>
                          handlePendingChange(
                            compId,
                            e.target.value ? parseInt(e.target.value) : ""
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          borderRadius: "4px",
                          border: "none",
                          fontSize: "1rem",
                          fontWeight: "bold",
                          color: "#2a5298",
                          outline: "none",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <option value="">-- Select Alternate --</option>
                        {alternatesForComp.map((alt) => (
                          <option key={alt.altId} value={alt.altId}>
                            {alt.alternateComponent?.compName} | ₹{alt.deltaPrice}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAddAlternate(compId)}
                        disabled={!pendingAltId}
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "4px",
                          border: "none",
                          backgroundColor: "#2a5298",
                          color: "#fff",
                          fontWeight: "bold",
                          cursor: pendingAltId ? "pointer" : "not-allowed",
                          marginRight: "0.5rem",
                        }}
                      >
                        Add Alternate
                      </button>
                      {selectedAltId && (
                        <button
                          onClick={() => handleRemoveAlternate(compId)}
                          style={{
                            padding: "0.5rem 1rem",
                            borderRadius: "4px",
                            border: "none",
                            backgroundColor: "#b33",
                            color: "#fff",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          Remove Alternate
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* ✅ Confirm & Cancel Buttons */}
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button
          onClick={async () => {
            try {
              // Prepare the details array for invoice
              const details = Object.entries(selectedAlternates).map(
                ([compId, altId]) => ({
                  compId: parseInt(compId),
                  isAlternate: "Y", // user selected alternate
                })
              );

              // Add base components that were not replaced by alternates
              const baseCompIds = defaultComponents
                .filter((comp) => comp.isConfigurable === "Y")
                .map((comp) => comp.component.compId);

              baseCompIds.forEach((compId) => {
                if (!selectedAlternates[compId]) {
                  details.push({
                    compId: compId,
                    isAlternate: "N",
                  });
                }
              });

              if (!userId) {
                alert("User not logged in properly.");
                return;
              }

              // Prepare payload with userId (instead of customer)
              const payload = {
                modelId: modelId,
                quantity: quantity,
                userId: userId,
                details: details,
              };

              const response = await fetch(
                "http://localhost:8080/invoices/create",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payload),
                }
              );

              if (!response.ok)
                throw new Error("Failed to create invoice");

              const createdInvoice = await response.json();

              navigate("/invoice", {
                state: {
                  invoice: createdInvoice,
                  modelId,
                  selectedAlternates,
                  totalPrice,
                  basePrice,
                  quantity,
                  userId,
                },
              });
            } catch (err) {
              console.error("Error creating invoice:", err);
              alert("Failed to create invoice. Please try again.");
            }
          }}
          style={{
            padding: "0.8rem 1.5rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#28a745",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Confirm Order
        </button>

        <button
          onClick={() => {
            navigate("/configuration", {
              state: { modelId, userId },
            });
          }}
          style={{
            padding: "0.8rem 1.5rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#dc3545",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ConfigurePage;
