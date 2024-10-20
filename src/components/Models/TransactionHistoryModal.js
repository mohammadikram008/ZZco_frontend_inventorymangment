import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import axios from "axios";
import CustomTable from "../CustomTable/CustomTable";

const TransactionHistoryModal = ({ open, onClose, customer }) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalBalance, setTotalBalance] = useState(0);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API_URL = `${BACKEND_URL}/api/customers`;

  useEffect(() => {
    if (open && customer) {
      const fetchTransactions = async () => {
        try {
          const response = await axios.get(`${API_URL}/transactionHistory/${customer._id}`);
          const transactionHistory = response.data.transactionHistory || [];

          let balance = 0;
          const ledger = transactionHistory.map((transaction) => {
            const debit = transaction.type.toLowerCase() === "debit" ? transaction.amount : 0;
            const credit = transaction.type.toLowerCase() === "credit" ? transaction.amount : 0;

            // Correct balance calculation: if debit is negative, subtract it
            balance += credit - (debit < 0 ? -debit : debit); // Ensure correct subtraction of debit

            return {
              ...transaction,
              debit,
              credit,
            };
          });

          setTransactions(ledger);
          setTotalBalance(balance); // Set total balance to be displayed below
        } catch (error) {
          console.error("Error fetching transaction history:", error);
        }
      };

      fetchTransactions();
    }
  }, [open, customer, API_URL]);

  // Column definitions without the balance column
  const columns = [
    {
      field: "date",
      headerName: "Date",
      renderCell: (row) => new Date(row.date).toLocaleDateString(),
    },
    {
      field: "paymentMethod",
      headerName: "Payment Type",
    },
    {
      field: "debit",
      headerName: "Debit",
      renderCell: (row) => <span style={{ color: "red" }}>{row.debit.toFixed(2)}</span>,
    },
    {
      field: "credit",
      headerName: "Credit",
      renderCell: (row) => <span style={{ color: "green" }}>{row.credit.toFixed(2)}</span>,
    },
    {
      field: "chequeDate",
      headerName: "Cheque Date",
      renderCell: (row) => (row.chequeDate ? new Date(row.chequeDate).toLocaleDateString() : "-"),
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
        <Typography variant="h6">Ledger for {customer?.username}</Typography>
        <CustomTable
          columns={columns}
          data={transactions}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {/* Footer with Total Balance */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Typography variant="h6">
            Total Balance:
            <span style={{ marginLeft: "10px", color: totalBalance >= 0 ? "green" : "red" }}>
              {totalBalance.toFixed(2)}
            </span>
          </Typography>
          <Button variant="contained" color="primary" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TransactionHistoryModal;
