import React from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import axios from 'axios';

const ConfirmDeleteModal = ({ open, onClose, entry, entryType, onSuccess }) => {
  const BACKEND_URL = "http://localhost:5001";

  // Determine API URL based on entry type
  const API_URL = entryType === "supplier"
    ? `${BACKEND_URL}/api/suppliers`
    : entryType === "bank"
    ? `${BACKEND_URL}/api/banks`
    : entryType === "cash"
    ? `${BACKEND_URL}/api/cash`
    : '';

  const handleDelete = async () => {
    if (!entry || !entry._id) return; // Ensure valid entry is selected
    console.log(`Deleting ${entryType}:`, entry._id); // Log to confirm

    try {
      const response = await axios.delete(`${API_URL}/delete/${entry._id}`);
      console.log(response.data);
      onSuccess();
    } catch (error) {
      console.error(`Error deleting ${entryType}:`, error.response?.data || error);
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
          Are you sure you want to delete this {entryType} entry?
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          fullWidth
        >
          Delete {entryType}
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfirmDeleteModal;
