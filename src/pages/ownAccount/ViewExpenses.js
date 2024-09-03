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
} from "@mui/material";

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expense, setExpense] = useState({
    expenseName: "",
    amount: "",
    description: "",
  });

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API_URL = `${BACKEND_URL}/api`;

  // Fetch expenses data
  useEffect(() => {
    fetch(`${API_URL}/expenses/all`)
      .then((response) => response.json())
      .then((data) => {
        setExpenses(data); // Set fetched data to state
      })
      .catch((err) => console.log(err));
  }, []);

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const addExpense = () => {
    fetch(`${API_URL}/expenses/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    })
      .then((response) => response.json())
      .then(() => {
        alert("Expense Added");
        setShowExpenseModal(false); // Close the modal after adding
        // Optionally, fetch expenses again to refresh the list
        fetch(`${API_URL}/expenses/all`)
          .then((response) => response.json())
          .then((data) => setExpenses(data))
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to add expense. Please try again.");
      });
  };

  // Function to toggle the modal visibility
  const toggleExpenseModal = () => {
    setShowExpenseModal(!showExpenseModal);
  };

  return (
    <Container>
      <Box display="flex" justifyContent="flex-end" mt={2} mb={2}>
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
            View Expenses
          </Typography>

          {expenses.length === 0 ? (
            <Typography variant="body1">No expenses found.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Expense Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Expense Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense._id}>
                      <TableCell>{expense.expenseName}</TableCell>
                      <TableCell>{expense.amount}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Single dialog for adding expense */}
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
