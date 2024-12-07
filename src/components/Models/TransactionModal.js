import React from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';

const TransactionHistoryModal = ({ open, onClose, transactions }) => {
    return (
        <Modal open={open} onClose={onClose}>
          <Box sx={{ width: 600, p: 3, mx: "auto", mt: 5, bgcolor: "background.paper", boxShadow: 24, borderRadius: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Transaction History</Typography>
                    <Button onClick={onClose} variant="outlined" sx={{ mb: 2 }}>
                        Close
                    </Button>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions && transactions.transactions && transactions.transactions.length > 0 ? (
                                transactions.transactions.map((transaction) => (
                                    <TableRow key={transaction._id}>
                                        <TableCell>{transaction.type}</TableCell>
                                        <TableCell>{transaction.amount}</TableCell>
                                        <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3}>No transactions available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
    </Modal>
    );
};

export default TransactionHistoryModal;