import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import axios from 'axios';
import CustomTable from "../CustomTable/CustomTable";

const SupplierTransactionHistoryModal = ({ open, onClose, supplier }) => {
  const [transactions, setTransactions] = useState([]); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); 

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API_URL = `${BACKEND_URL}/api/suppliers`;

  useEffect(() => {
    if (open && supplier) {
      const fetchTransactions = async () => {
        try {
          const response = await axios.get(`${API_URL}/${supplier._id}/transaction-history`);
          const transactionHistory = response.data.transactionHistory || [];
          
          // Calculate running balance
          let balance = 0;
          const ledger = transactionHistory.map(transaction => {
            const debit = transaction.type.toLowerCase() === 'debit' ? transaction.amount : 0;
            const credit = transaction.type.toLowerCase() === 'credit' ? transaction.amount : 0;
            balance += credit - debit;
            return {
              ...transaction,
              debit,
              credit,
              balance
            };
          });
          
          setTransactions(ledger);
        } catch (error) {
          console.error("Error fetching transaction history:", error);
        }
      };
      
      fetchTransactions();
    }
  }, [open, supplier, API_URL]);

  // Column definitions with color styling for debit and credit
  const columns = [
    { 
      field: 'date', 
      headerName: 'Date', 
      renderCell: (row) => new Date(row.date).toLocaleDateString() 
    },
    { 
      field: 'paymentMethod', 
      headerName: 'Payment Type' 
    },
    { 
      field: 'debit', 
      headerName: 'Debit', 
      renderCell: (row) => (
        <span style={{ color: 'red' }}>
          {row.debit.toFixed(2)}
        </span>
      ) 
    },
    { 
      field: 'credit', 
      headerName: 'Credit', 
      renderCell: (row) => (
        <span style={{ color: 'green' }}>
          {row.credit.toFixed(2)}
        </span>
      ) 
    },
    { 
      field: 'balance', 
      headerName: 'Balance', 
      renderCell: (row) => row.balance.toFixed(2) 
    },
    { 
      field: 'chequeDate', 
      headerName: 'Cheque Date', 
      renderCell: (row) => row.chequeDate ? new Date(row.chequeDate).toLocaleDateString() : '-'
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 900,
          p: 3,
          mx: "auto",
          mt: 5,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 1,
          overflow: "auto",
        }}
      >
        <Typography variant="h6">Ledger for {supplier?.username}</Typography>
        <CustomTable
          columns={columns}
          data={transactions}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Button variant="contained" color="primary" onClick={onClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default SupplierTransactionHistoryModal;
