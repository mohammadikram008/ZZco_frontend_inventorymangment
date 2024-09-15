import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import axios from 'axios';

const EditBankModal = ({ open, onClose, entry, entryType, onSuccess }) => {
  const [bankName, setBankName] = useState(""); // Only used for banks
  const [amount, setAmount] = useState(""); // Used for banks
  const [balance, setBalance] = useState(""); // Used for cash entries
  const [type, setType] = useState("add"); // Only used for cash

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Set the API URL based on whether editing a bank or cash
  const API_URL = entryType === "bank"
    ? `${BACKEND_URL}/api/banks`
    : `${BACKEND_URL}/api/cash`;

  // Update the form fields when the `entry` changes
  useEffect(() => {
    if (entry) {
      if (entryType === "bank") {
        setBankName(entry.bankName || "");  // Initialize with the bank name if it's a bank
        setAmount(entry.balance || "");     // Set the balance as amount for bank
      } else if (entryType === "cash") {
        setBalance(entry.balance || "");    // Set balance for cash
        setType(entry.type || "add");       // Initialize cash type (add or deduct)
      }
    }
  }, [entry, entryType]);

  const handleSubmit = async () => {
    let formData = {};

    // Include bankName and amount if editing a bank
    if (entryType === "bank") {
      formData = {
        bankName,
        amount: parseFloat(amount), // Use 'amount' for banks
      };
    }

    // Include balance and type if editing cash
    if (entryType === "cash") {
      formData = {
        balance: parseFloat(balance), // Use 'balance' for cash
        type,
      };
    }

    console.log("Form Data Submitted to API:", formData);  // Log the form data to debug

    try {
      const response = await axios.put(`${API_URL}/update/${entry._id}`, formData);
      console.log("Response from API:", response.data);
      onSuccess();  // Callback to refresh the list after success
    } catch (error) {
      console.error(`Error updating ${entryType} details:`, error.response?.data || error);
    }
    onClose();  // Close the modal after submission
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {entryType === "bank" ? "Edit Bank Details" : "Edit Cash Entry"}
        </Typography>
        {entryType === "bank" && (
          <TextField
            label="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            fullWidth
            margin="normal"
          />
        )}
        {entryType === "bank" && (
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
          />
        )}
        {entryType === "cash" && (
          <TextField
            label="Balance"
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            fullWidth
            margin="normal"
          />
        )}
        {entryType === "cash" && (
          <Box mt={2}>
            <Typography variant="subtitle1">Transaction Type</Typography>
            <Select
              value={type} // This must be the value passed for "add" or "deduct"
              onChange={(e) => setType(e.target.value)} // Ensure this sets the correct type
              fullWidth
            >
              <MenuItem value="add">Add</MenuItem>
              <MenuItem value="deduct">Deduct</MenuItem>
            </Select>
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
};

export default EditBankModal;
