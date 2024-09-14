import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Pagination,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/features/product/productSlice";
import axios from "axios";
import CustomTable from "../../components/CustomTable/CustomTable"; // Import the CustomTable component

const ITEMS_PER_PAGE = 10;

const ViewExpenses = () => {
  const dispatch = useDispatch();
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expense, setExpense] = useState({
    expenseName: "",
    amount: "",
    description: "",
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const [totalPages, setTotalPages] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [runningBalance, setRunningBalance] = useState(0);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API_URL = `${BACKEND_URL}/api`;
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
    fetchSales();
    fetchExpenses();
  }, [dispatch]);

  useEffect(() => {
    filterEntriesByDate();
  }, [selectedDate, ledgerEntries]);

  const fetchSales = async () => {
    try {
      const response = await axios.get(`${API_URL}/sales/allsales`, { withCredentials: true });
      const salesData = response.data.map(sale => ({
        ...sale,
        type: 'Sale',
        amount: sale.totalSaleAmount, // Positive amount for sales (debit)
        date: new Date(sale.saleDate),
        description: `Sale of ${sale.stockSold} units of product ${sale.productID}`,
      }));
      updateLedger(salesData);
    } catch (err) {
      console.error("Error fetching sales:", err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/all`);
      const expensesData = response.data.map(expense => ({
        ...expense,
        type: 'Expense',
        amount: -expense.amount, // Negative amount for expenses (credit)
        date: new Date(expense.createdAt),
        description: expense.description || expense.expenseName,
      }));
      updateLedger(expensesData);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const updateLedger = (newEntries) => {
    setLedgerEntries(prevEntries => {
      const updatedEntries = [...prevEntries, ...newEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
      return updatedEntries;
    });
  };

  useEffect(() => {
    if (products.length > 0) {
      const purchaseEntries = products.map(product => ({
        type: 'Purchase',
        amount: -product.price * product.quantity, // Negative amount for purchases (credit)
        date: new Date(product.createdAt),
        description: `Purchase of ${product.quantity} ${product.name} at ${product.price} each`,
        paymentMethod: product.paymentMethod,
        category: product.category,
      }));
      updateLedger(purchaseEntries);
    }
  }, [products]);





  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpense(prevExpense => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  const addExpense = async () => {
    try {
      const response = await axios.post(`${API_URL}/expenses/add`, expense);
      alert("Expense Added");
      setShowExpenseModal(false);
      const newExpense = {
        ...response.data,
        type: 'Expense',
        amount: -response.data.amount, // Negative amount for expenses (credit)
        date: new Date(response.data.createdAt),
        description: response.data.description || response.data.expenseName,
      };
      updateLedger([newExpense]);
      setExpense({ expenseName: "", amount: "", description: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  const toggleExpenseModal = () => {
    setShowExpenseModal(!showExpenseModal);
  };



  const paginatedEntries = filteredEntries.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const calculateRunningBalance = (entries) => {
    let balance = 0;
    const entriesWithBalance = entries.map(entry => {
      balance += entry.amount;
      return { ...entry, balance };
    });
    setRunningBalance(balance);
    return entriesWithBalance;
  };

  const filterEntriesByDate = () => {
    let filtered = ledgerEntries;
    if (selectedDate) {
      filtered = ledgerEntries.filter(entry =>
        new Date(entry.date).toDateString() === new Date(selectedDate).toDateString()
      );
    }
    const entriesWithBalance = calculateRunningBalance(filtered);
    setFilteredEntries(entriesWithBalance);
    setTotalPages(Math.ceil(entriesWithBalance.length / ITEMS_PER_PAGE));
    setPage(1);
  };



  const columns = [
    { field: 'date', headerName: 'Date', renderCell: (row) => new Date(row.date).toLocaleDateString() },
    { field: 'type', headerName: 'Type' },
    { field: 'description', headerName: 'Description' },
    { field: 'debit', headerName: 'Debit', renderCell: (row) => row.amount > 0 ? row.amount.toFixed(2) : '' },
    { field: 'credit', headerName: 'Credit', renderCell: (row) => row.amount < 0 ? Math.abs(row.amount).toFixed(2) : '' },
    { field: 'paymentMethod', headerName: 'Payment Method' },
    { field: 'balance', headerName: 'Total Amount', renderCell: (row) => row.balance.toFixed(2) },
  ];

  const rows = paginatedEntries.map(entry => ({
    ...entry,
    debit: entry.amount,
    credit: entry.amount,
  }));
  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
        <TextField
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={toggleExpenseModal}
        >
          Add Expense
        </Button>
      </Box>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Ledger
          </Typography>
          {selectedDate && (
            <Typography variant="h6" gutterBottom>
              Balance for {new Date(selectedDate).toDateString()}: ${runningBalance.toFixed(2)}
            </Typography>
          )}
          {!selectedDate && (
            <Typography variant="h6" gutterBottom>
              Overall Balance: ${runningBalance.toFixed(2)}
            </Typography>
          )}

          {filteredEntries.length === 0 ? (
            <Typography variant="body1">No entries found for the selected date.</Typography>
          ) : (
            <>
              <CustomTable
                columns={columns}
                data={filteredEntries}
                page={page - 1}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={showExpenseModal}
        onClose={toggleExpenseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Expense Name"
                  name="expenseName"
                  value={expense.expenseName}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  name="amount"
                  value={expense.amount}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={expense.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={addExpense}>
            Add Expense
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={toggleExpenseModal}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewExpenses;