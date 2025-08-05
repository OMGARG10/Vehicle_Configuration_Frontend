import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const typeMap = {
  S: "Standard",
  I: "Interior",
  E: "Exterior",
};

function ConfigurePage() {
  const location = useLocation();
  const { modelId } = location.state || {};

  const [defaultComponents, setDefaultComponents] = useState([]);
  const [alternateMap, setAlternateMap] = useState({}); // compId -> [alternateComponents]
  const [basePrice, setBasePrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedAlternates, setSelectedAlternates] = useState({}); // compId -> altId
  const [pendingAlternateSelection, setPendingAlternateSelection] = useState({}); // compId -> altId

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
  }, [modelId]);

  // Calculate total price from base price + all selected alternates' deltaPrices
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

    // Clear pending selection for this component after adding
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
      <h1 style={{ marginBottom: "2rem" }}>Configure Your Car</h1>
      <h3 style={{ marginBottom: "1rem" }}>
        Base Price: ₹{basePrice} | Total Price: ₹{totalPrice}
      </h3>

      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: "2rem",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        {defaultComponents.length === 0 ? (
          <p>No configurable components found for this model.</p>
        ) : (
          defaultComponents.map((comp) => {
            const compId = comp.component.compId.toString();
            const compName = comp.component.compName || `Component #${compId}`;
            const compTypeLabel = typeMap[comp.compType] || comp.compType;
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
                <h4>
                  {compName} ({compTypeLabel})
                </h4>
                <p>
                  <strong>
                    Default Component Selected
                    {selectedAltId && (
                      <> (Replaced by: {alternatesForComp.find(a => a.altId === selectedAltId)?.alternateComponent.compName})</>
                    )}
                  </strong>
                </p>

                {alternatesForComp.length === 0 ? (
                  <p>No alternates available</p>
                ) : (
                  <>
                    <label
                      htmlFor={`alternate-select-${compId}`}
                      style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}
                    >
                      Select Alternate:
                    </label>
                    <select
                      id={`alternate-select-${compId}`}
                      value={pendingAltId}
                      onChange={(e) =>
                        handlePendingChange(compId, e.target.value ? parseInt(e.target.value) : "")
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
                          {alt.alternateComponent?.compName} | Δ ₹{alt.deltaPrice}
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
                        marginBottom: "0.5rem",
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
          })
        )}
      </div>
    </div>
  );
}

export default ConfigurePage;
