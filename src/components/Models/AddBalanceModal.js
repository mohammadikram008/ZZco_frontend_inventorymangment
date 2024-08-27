import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import axios from 'axios'

const AddBalanceModal = ({ open, onClose, customer,onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API_URL = `${BACKEND_URL}/api/customers`;
  const handleSubmit =async () => {
    // Perform the API call to add the balance to the customer's account
    const formData = {
      amount: parseFloat(amount),
      paymentMethod,
      chequeDate: paymentMethod === "Cheque" ? chequeDate : null,
    };

    console.log("Adding balance:", formData);
    try {
        const response = await axios.post(`${API_URL}/add-customer-balance/${customer._id}`, formData,);
        console.log(response.data);
        onSuccess();
      } catch (error) {
        console.error('Error adding balance:', error);
      }
    // Perform the API call here to update the balance
    // You can use customer._id to identify the user
    onClose();
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
          Add Balance to {customer?.username}
        </Typography>
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Payment Method"
          select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="Online">Online</MenuItem>
          <MenuItem value="Cheque">Cheque</MenuItem>
        </TextField>
        {paymentMethod === "Cheque" && (
          <TextField
            label="Cheque Date"
            type="date"
            value={chequeDate}
            onChange={(e) => setChequeDate(e.target.value)}
            fullWidth
            margin="normal"
          />
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Add Balance
        </Button>
      </Box>
    </Modal>
  );
};

export default AddBalanceModal;
