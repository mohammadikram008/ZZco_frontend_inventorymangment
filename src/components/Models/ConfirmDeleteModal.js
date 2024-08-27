import React from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
} from "@mui/material";
import axios from 'axios'
const ConfirmDeleteModal = ({ open, onClose, customer ,onSuccess}) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const API_URL = `${BACKEND_URL}/api/customers`;
  const handleDelete = async() => {
    // Perform the API call to delete the customer's account
    console.log("Deleting customer:", customer._id);
    try {
        const response = await axios.delete(`${API_URL}/Delete-customers/${customer._id}`);
        console.log(response.data);
        onSuccess();
      } catch (error) {
        console.error('Error Delete Customer:', error);
      }
    // Perform the API call here to delete the customer
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
          Are you sure you want to delete {customer?.username}'s account?
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          fullWidth
        >
          Delete Account
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfirmDeleteModal;
