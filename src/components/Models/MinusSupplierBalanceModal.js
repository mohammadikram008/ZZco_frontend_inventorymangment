import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid
} from "@mui/material";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { getBanks } from "../../redux/features/Bank/bankSlice";

// Function to capitalize the first letter
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const MinusSupplierBalanceModal = ({ open, onClose, supplier, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [image, setImage] = useState(null); // State for the image
  const [imagePreview, setImagePreview] = useState(""); // State for image preview

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const dispatch = useDispatch();
  const banks = useSelector((state) => state.bank.banks);

  useEffect(() => {
    dispatch(getBanks());
  }, [dispatch]);

  const API_URL = `${BACKEND_URL}/api/suppliers`;  // Use suppliers endpoint

  const handleSubmit = async () => {
    // Convert paymentMethod to capital case using capitalizeFirstLetter
    const formData = new FormData();
    formData.append("amount", parseFloat(amount));
    formData.append("paymentMethod", capitalizeFirstLetter(paymentMethod));
    formData.append("description", description);

    if (paymentMethod === "online") {
      formData.append("bankId", selectedBank);
      formData.append("image", image); // Add image if selected
    }

    if (paymentMethod === "cheque") {
      formData.append("chequeDate", chequeDate);
      formData.append("image", image); // Add image if selected
    }

    try {
      const response = await axios.post(`${API_URL}/${supplier._id}/transaction`, formData);
      console.log(response.data);
      onSuccess();
    } catch (error) {
      console.error('Error subtracting balance:', error);
    }
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Set image preview for display
    }
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
          Subtract Balance from {supplier?.username}
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
          <MenuItem value="cash">Cash</MenuItem>
          <MenuItem value="online">Online</MenuItem>
          <MenuItem value="cheque">Cheque</MenuItem>
        </TextField>

        {paymentMethod === "online" && (
          <TextField
            label="Select Bank"
            select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            fullWidth
            margin="normal"
          >
            {banks.map((bank) => (
              <MenuItem key={bank._id} value={bank._id}>
                {bank.bankName}
              </MenuItem>
            ))}
          </TextField>
        )}

        {paymentMethod === "cheque" && (
          <TextField
            label="Cheque Date"
            type="date"
            value={chequeDate}
            onChange={(e) => setChequeDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}

        {(paymentMethod === "online" || paymentMethod === "cheque") && (
          <Grid item xs={12}>
            <TextField
              type="file"
              label="Upload Image"
              name="image"
              onChange={handleImageChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px' }} />
            )}
          </Grid>
        )}

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={2}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Subtract Balance
        </Button>
      </Box>
    </Modal>
  );
};

export default MinusSupplierBalanceModal;
