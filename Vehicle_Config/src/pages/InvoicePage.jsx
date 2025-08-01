import React from "react";
import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

function InvoicePage({ selectedOptions }) {
  const navigate = useNavigate();

  const prices = {
    Sunroof: 25000,
    "Cruise Control": 18000,
    "Wireless Charger": 12000,
    "Leather Seats": 30000,
    "Ambient Lighting": 10000,
    "Wood Finish Dashboard": 15000,
    "Alloy Wheels": 20000,
    "Chrome Grille": 8000,
    "Roof Rails": 12000
  };

  const selectedItems = Object.values(selectedOptions).filter(Boolean);
  const subtotal = selectedItems.reduce((sum, item) => sum + (prices[item] || 0), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleCancel = () => navigate("/configure");

  const handleConfirm = () => {
    generatePDF("invoice");
    generatePDF("po");
    // Call backend API to send email with PDFs
    alert("Order confirmed! Invoice and PO sent to customer and vendor.");
  };

  const handlePrint = () => window.print();

  const generatePDF = async (type) => {
    const element = document.getElementById("invoice-content");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save(`${type}.pdf`);
  };

  return (
    <div style={pageStyle}>
      <h1>Invoice</h1>
      <div id="invoice-content" style={invoiceStyle}>
        <ul>
          {selectedItems.map((item) => (
            <li key={item}>{item} - ₹{prices[item].toLocaleString()}</li>
          ))}
        </ul>
        <hr />
        <p>Subtotal: ₹{subtotal.toLocaleString()}</p>
        <p>GST (18%): ₹{gst.toLocaleString()}</p>
        <h3>Total: ₹{total.toLocaleString()}</h3>
      </div>

      <div style={buttonContainer}>
        <button onClick={handleCancel}>Cancel</button>
        <button onClick={handleConfirm}>Confirm</button>
        <button onClick={handlePrint}>Print</button>
      </div>
    </div>
  );
}

const pageStyle = {
  padding: "2rem",
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#f4f4f4",
  minHeight: "100vh"
};

const invoiceStyle = {
  backgroundColor: "#fff",
  padding: "1rem",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)"
};

const buttonContainer = {
  marginTop: "1rem",
  display: "flex",
  gap: "1rem"
};

export default InvoicePage;