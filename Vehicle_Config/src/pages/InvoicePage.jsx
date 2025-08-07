import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function InvoicePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Support both invoiceId or full invoice object passed via location.state
  const { invoice, invoiceId } = location.state || {};
  const id = invoiceId || invoice?.invId;

  const [invoiceData, setInvoiceData] = useState(invoice || null);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    // Fetch invoice header if not already present
    if (id && !invoiceData) {
      fetch(`http://localhost:8080/invoices/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch invoice header");
          return res.json();
        })
        .then((data) => setInvoiceData(data))
        .catch((err) => console.error("Error fetching invoice header:", err));
    }

    // Fetch invoice details (line items)
    if (id) {
      fetch(`http://localhost:8080/invoice-details/by-invoice/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch invoice details");
          return res.json();
        })
        .then((data) => setDetails(data))
        .catch((err) => console.error("Error fetching invoice details:", err));
    }
  }, [id, invoiceData]);

  if (!id) {
    return <div>Error: Invoice ID not found.</div>;
  }

  return (
    <div style={pageStyle}>
      <h1>Invoice</h1>
      <div id="invoice-content" style={invoiceStyle}>
        {invoiceData ? (
          <>
            <p><strong>Customer:</strong> {invoiceData.custDetails}</p>
            <p><strong>Date:</strong> {new Date(invoiceData.invDate).toLocaleString()}</p>
            <p><strong>Quantity:</strong> {invoiceData.quantity}</p>
            <ul>
              {details.length === 0 ? (
                <li>No components found in invoice.</li>
              ) : (
                details.map((item) => (
                  <li key={item.invDtlId}>
                    {item.component?.compName ?? "Unknown Component"} 
                    {item.isAlternate === "Y" ? "(Alternate)" : ""}
                  </li>
                ))
              )}
            </ul>
            <hr />
            <p>Subtotal: ₹{invoiceData.finalAmount?.toLocaleString()}</p>
            <p>GST: ₹{invoiceData.tax?.toLocaleString()}</p>
            <h3>Total: ₹{invoiceData.totalAmount?.toLocaleString()}</h3>
          </>
        ) : (
          <p>Loading invoice...</p>
        )}
      </div>

      <div style={buttonContainer}>
        <button
          onClick={() => navigate("/configure")}
          style={buttonStyle}
        >
          Cancel
        </button>
        <button
          onClick={() => alert("Order confirmed! Invoice and PO sent to customer and vendor.")}
          style={{ ...buttonStyle, backgroundColor: "#28a745", color: "#fff" }}
        >
          Confirm
        </button>
        <button
          onClick={() => window.print()}
          style={{ ...buttonStyle, backgroundColor: "#007bff", color: "#fff" }}
        >
          Print
        </button>
      </div>
    </div>
  );
}

const pageStyle = {
  padding: "2rem",
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#f4f4f4",
  minHeight: "100vh",
};

const invoiceStyle = {
  backgroundColor: "#fff",
  padding: "1rem",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};

const buttonContainer = {
  marginTop: "1rem",
  display: "flex",
  gap: "1rem",
};

const buttonStyle = {
  padding: "0.8rem 1.5rem",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
};

export default InvoicePage;
