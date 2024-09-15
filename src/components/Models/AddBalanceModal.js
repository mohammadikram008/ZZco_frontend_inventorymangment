import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,  
  Button,
  MenuItem,
  Typography, 
  Grid,
} from "@mui/material";
import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios'
import { getBanks } from "../../redux/features/Bank/bankSlice";
import { toast } from "react-toastify";

const AddBalanceModal = ({ open, onClose, customer, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [image, setImage] = useState(null);
  const [ImagePreview, setImagePreview] = useState("");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API_URL = `${BACKEND_URL}/api/customers`;
  const dispatch = useDispatch();
  const banks = useSelector((state) => state.bank.banks);

  useEffect(() => {
    dispatch(getBanks());
  }, [dispatch]);
  
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };
  
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("paymentMethod", capitalizeFirstLetter(paymentMethod));  // Capitalize the first letter
    formData.append("description", description);
    
    if (paymentMethod === "online") {
      formData.append("bankId", selectedBank);
      formData.append("image", image);
    }
    
    if (paymentMethod === "cheque") {
      formData.append("chequeDate", chequeDate);
    }
  
    try {
      const response = await axios.post(
        `${API_URL}/add-customer-balance/${customer._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || 'Balance added successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to add balance. Please try again.');
    }
  };
  
  
  
  
  
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box
      component="form"
      onSubmit={handleSubmit}
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
          onChange={(e) => setPaymentMethod(e.target.value.toLowerCase())}
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
        {(paymentMethod === "cheque" ||
          // sale.paymentMethod === "credit" ||
          paymentMethod === "online") && (
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
              {ImagePreview && <ImagePreview src={ImagePreview} alt="Preview" />}
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
           type="submit"
          // onClick={handleSubmit}
          fullWidth
        >
          Add Balance
        </Button>
      </Box>
    </Modal>
  );
};

export default AddBalanceModal;