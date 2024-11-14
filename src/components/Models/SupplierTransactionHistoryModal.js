import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import axios from 'axios';
import CustomTable from "../CustomTable/CustomTable";

const SupplierTransactionHistoryModal = ({ open, onClose, supplier }) => {
  const [transactions, setTransactions] = useState([]); 
  const [totalBalance, setTotalBalance] = useState(0); // State to store total balance
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); 

  const BACKEND_URL = "http://localhost:5001";
  const API_URL = `${BACKEND_URL}/api/suppliers`;
  const [runningBalance, setRunningBalance] = useState(0); // State to store running balance

  useEffect(() => {
    if (open && supplier) {
      const fetchTransactions = async () => {
        try {
          const response = await axios.get(`${API_URL}/${supplier._id}/transaction-history`);
          const transactionHistory = response.data.transactionHistory || [];
          
          let balance = 0;
          const ledger = transactionHistory.map(transaction => {
            const isDebit = transaction.type.toLowerCase() === 'debit';
            const debit = isDebit ? transaction.amount : 0;
            const credit = isDebit ? 0 : transaction.amount;
            balance += credit - debit;

            // Update running balance after each transaction
            setRunningBalance(prevBalance => prevBalance + credit - debit);

            return {
              ...transaction,
              debit,
              credit,
              runningBalance: balance, // Add running balance to each transaction
            };
          });

          setTransactions(ledger);
          setTotalBalance(balance); // Set the total balance after all calculations
          setRunningBalance(0); // Reset running balance for new transactions
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
      field: 'productName', 
      headerName: 'Product Name' 
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
      field: 'chequeDate', 
      headerName: 'Cheque Date', 
      renderCell: (row) => row.chequeDate ? new Date(row.chequeDate).toLocaleDateString() : '-'
    },
    { 
      field: 'runningBalance', 
      headerName: 'Running Balance', 
      renderCell: (row) => (
        <span>
          {row.runningBalance.toFixed(2)}
        </span>
      ) 
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

        {/* Footer section with total balance and pagination controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ fontWeight: 'bold', color: totalBalance >= 0 ? 'green' : 'red' }}
          >
            Total Balance: {totalBalance.toFixed(2)}
          </Typography>
          
          <Button variant="contained" color="primary" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SupplierTransactionHistoryModal;
