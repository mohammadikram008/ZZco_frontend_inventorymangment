import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import axios from 'axios';

const EditBankModal = ({ open, onClose, bank, onSuccess }) => {
  const [bankName, setBankName] = useState(bank?.bankName || "");
  const [amount, setAmount] = useState(bank?.amount || "");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const API_URL = `${BACKEND_URL}/api/banks`;

  const handleSubmit = async () => {
    // Perform the API call to update the bank details
    const formData = {
      bankName,
      amount: parseFloat(amount),
    };

    console.log("Editing bank:", formData);
    try {
      const response = await axios.put(`${API_URL}/update-bank/${bank._id}`, formData);
      console.log(response.data);
      onSuccess(); // Callback to refresh the list after success
    } catch (error) {
      console.error('Error updating bank details:', error);
    }
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
          Edit Bank Details
        </Typography>
        <TextField
          label="Bank Name"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
        />
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
