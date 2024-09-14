import React, { useState, useMemo, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import ConfirmDeleteModal from "../../../components/Models/ConfirmDeleteModal";
import EditBankModal from "../../../components/Models/EditBankModal";
import CustomTable from "../../../components/CustomTable/OwnAccount";

const BankList = ({ banks, refreshBanks, cash }) => {
  console.log("cash",cash);
  const [selectedBank, setSelectedBank] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    console.log("Banks data:", banks); // Check the data being passed
  }, [banks]);

  const openEditModal = (bank) => {
    setSelectedBank(bank);
    setEditModalOpen(true);
  };

  const openDeleteModal = (bank) => {
    setSelectedBank(bank);
    setDeleteModalOpen(true);
  };

  const closeModals = () => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedBank(null);
  };

  // Calculate total amounts
  const totalBankAmount = useMemo(() => {
    return banks.reduce((total, bank) => total + (bank.amount || 0), 0);
  }, [banks]);

  // const totalCashAmount = useMemo(() => {
  //   return cash.reduce((total, cashEntry) => total + (cashEntry.amount || 0), 0);
  // }, [cash]);
  const totalCashAmount = useMemo(() => {
    return cash.totalBalance
  }, [cash]);

  // const totalAmount = totalBankAmount + totalCashAmount;
  const totalAmount = totalBankAmount ;

  const bankColumns = [
    { field: "bankName", headerName: "Bank Name" },
    { field: "balance", headerName: "Balance", align: "right" },
  ];

 
  const cashColumns = [
    { field: "createdAt", headerName: "Date", 
      valueGetter: (params) => {
        const date = new Date(params.row.createdAt);
        return date.toISOString().slice(0, 10);
      },
    },
    { field: "balance", headerName: "Balance", align: "right" },
    { field: "type", headerName: "Type" },
    { field: "totalBalance", headerName: "Total Balance", align: "right" },
  ];

  return (
    <Box
      sx={{
        margin: 3,
        bgcolor: "white",
        borderRadius: 2,
        padding: 3,
        width: "auto",
      }}
    >
       <Box display={"flex"} justifyContent={"center"} alignContent={"center"} mt={3}>
        <Typography variant="h3">Banks List</Typography>
      </Box>
      <CustomTable
        columns={bankColumns}
        data={banks}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      <Box display={"flex"} justifyContent={"center"} alignContent={"center"} mt={3}>
        <Typography variant="h3">Cash List</Typography>
      </Box>

      <CustomTable
        columns={cashColumns}
        data={cash.allEntries && cash.allEntries}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        sx={{ marginTop: 3 }}
      />

      {/* Display total amount */}
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>

      <Box sx={{ mt: 2, textAlign: 'left' }}>
        <Typography variant="h5">Total Cash Amount: {cash.totalBalance}</Typography>
      </Box>
      <Box sx={{ mt:2, textAlign: 'right' }}>
        <Typography variant="h5">Total Bank Amount: {totalAmount}</Typography>
      </Box>
      </Box>

      {/* Edit Bank Modal */}
      <EditBankModal
        open={isEditModalOpen}
        onClose={closeModals}
        bank={selectedBank}
        onSuccess={refreshBanks}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onClose={closeModals}
        bank={selectedBank}
        onSuccess={refreshBanks}
      />
    </Box>
  );
};

export default BankList;