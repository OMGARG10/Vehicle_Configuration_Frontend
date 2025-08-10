import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function InvoicePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { invoice, invoiceId } = location.state || {};
  const id = invoiceId || invoice?.invId;

  const [invoiceData, setInvoiceData] = useState(invoice || null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id && !invoiceData) {
          const headerRes = await fetch(`http://localhost:8080/invoices/${id}`);
          if (!headerRes.ok) throw new Error("Failed to fetch invoice header");
          const headerData = await headerRes.json();
          setInvoiceData(headerData);
        }

        if (id) {
          const detailRes = await fetch(`http://localhost:8080/invoice-details/by-invoice/${id}`);
          if (!detailRes.ok) throw new Error("Failed to fetch invoice details");
          const detailData = await detailRes.json();
          setDetails(detailData);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEmailSend = () => {
    if (!invoiceData || details.length === 0) {
      alert("Invoice data or details missing.");
      return;
    }

    // Extract modelId safely from invoiceData or nested model object
    const modelId = invoiceData.modelId || (invoiceData.model && invoiceData.model.modelId) || 0;
    const userId = invoiceData.userId || 0; // Set userId if available

    fetch(`http://localhost:8080/invoice-details/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoiceHeader: invoiceData,
        invoiceDetails: details,    // IMPORTANT: backend expects this exact name
        modelId: modelId,
        userId: userId,
        quantity: invoiceData.quantity || 1,
        details: [], // optional, include if backend expects or remove if not needed
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Email sending failed");
        return res.text();
      })
      .then((msg) => alert(msg))
      .catch((err) => {
        console.error("Error:", err);
        alert("Error sending invoice email.");
      });
  };

  if (!id) return <div>Error: Invoice ID not found.</div>;
  if (loading) return <div>Loading invoice...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div style={pageStyle}>
      <h1>Invoice</h1>
      <div id="invoice-content" style={invoiceStyle}>
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
                {item.isAlternate === "Y" ? " (Alternate)" : ""}
              </li>
            ))
          )}
        </ul>

        <hr />
        <p>Subtotal: ₹{invoiceData.finalAmount?.toLocaleString()}</p>
        <p>GST: ₹{invoiceData.tax?.toLocaleString()}</p>
        <h3>Total: ₹{invoiceData.totalAmount?.toLocaleString()}</h3>
      </div>

      <div style={buttonContainer}>
        <button onClick={() => navigate("/configure")} style={buttonStyle}>
          Cancel
        </button>
        <button
          onClick={handleEmailSend}
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
