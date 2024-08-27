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
} from "@mui/material";

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API_URL = `${BACKEND_URL}/api`;

  // Fetch expenses data
  useEffect(() => {
    fetch(`${API_URL}/expenses/allexpenses`)
      .then((response) => response.json())
      .then((data) => {
        setExpenses(data); // Set fetched data to state
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container>
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
                      <TableCell>{expense.expenseDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ViewExpenses;
