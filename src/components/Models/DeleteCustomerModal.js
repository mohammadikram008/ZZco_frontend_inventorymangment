import React from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteCustomerModal = ({ open, onClose, customer, onSuccess }) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  

  const handleDelete = async () => {
    if (!customer || !customer._id) return; // Ensure a valid customer is selected
    try {
        const response = await axios.delete(`${BACKEND_URL}/api/customers/delete-customer/${customer._id}`);

      toast.success(response.data.message || "Customer deleted successfully");
      onSuccess(); // Callback to refresh the customer list
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer. Please try again.");
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
          Are you sure you want to delete {customer?.username}?
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          fullWidth
        >
          Delete Customer
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={onClose}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default DeleteCustomerModal;
