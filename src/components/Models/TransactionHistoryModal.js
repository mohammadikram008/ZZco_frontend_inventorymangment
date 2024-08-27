import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import axios from 'axios';

const TransactionHistoryModal = ({ open, onClose, customer }) => {
  const [transactions, setTransactions] = useState([]);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API_URL = `${BACKEND_URL}/api/customers`;

  useEffect(() => {
    if (open && customer) {
      // Fetch transaction history for the selected customer
      const fetchTransactions = async () => {
        try {
          const response = await axios.get(`${API_URL}/transactionHistory/${customer._id}`);
          console.log("response", response.data.transactionHistory);
          
          // Assuming the response has a property `transactionHistory` with the list of transactions
          setTransactions(response.data.transactionHistory || []);
        } catch (error) {
          console.error("Error fetching transaction history:", error);
        }
      };
      
      fetchTransactions();
    }
  }, [open, customer]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 600,
          p: 3,
          mx: "auto",
          mt: 5,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 1,
          overflow: "auto",
        }}
      >
        <Typography variant="h6">Transaction History for {customer?.username}</Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Cheque Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                  <TableCell>
                    {transaction.paymentMethod === 'Cheque' && transaction.chequeDate 
                      ? new Date(transaction.chequeDate).toLocaleDateString() 
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" color="primary" onClick={onClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default TransactionHistoryModal;
