import React, { useState, useMemo, useEffect } from "react";
import { Box, Typography, Grid, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import ConfirmDeleteModal from "../../../components/Models/ConfirmDeleteModal";
import EditBankModal from "../../../components/Models/EditBankModal";

const BankList = ({ banks, refreshBanks,cash }) => {
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

  // Calculate total amount
  // Calculate total amounts
  const totalBankAmount = useMemo(() => {
    return banks.reduce((total, bank) => total + (bank.amount || 0), 0);
  }, [banks]);

  const totalCashAmount = useMemo(() => {
    return cash.reduce((total, cashEntry) => total + (cashEntry.amount || 0), 0);
  }, [cash]);
  const totalAmount = totalBankAmount + totalCashAmount;
  const columns = [
    { field: "bankName", headerName: "Bank Name", width: 200 },
    { field: "amount", headerName: "Amount", width: 150, type: 'number' },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Grid container spacing={1}>
          <Grid item>
            <IconButton
              color="primary"
              onClick={() => openEditModal(params.row)}
            >
              <Edit />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              color="error"
              onClick={() => openDeleteModal(params.row)}
            >
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
  ];
  const Cashcolumns = [
    { field: "date", headerName: "Date", width: 200 },
    { field: "amount", headerName: "Amount", width: 150, type: 'number' },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Grid container spacing={1}>
          <Grid item>
            <IconButton
              color="primary"
              onClick={() => openEditModal(params.row)}
            >
              <Edit />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              color="error"
              onClick={() => openDeleteModal(params.row)}
            >
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
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
      <DataGrid
        sx={{
          borderLeft: 0,
          borderRight: 0,
          borderRadius: 0,
        }}
        rows={banks}
        columns={columns}
        getRowId={(row) => row._id}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20, 30]}
        rowSelection={false}
      />
      <Box display={"flex"} justifyContent={"center"} alignContent={"center"}>

      <Typography variant="h3">Cash List</Typography>
      </Box>


      <DataGrid
        sx={{
          borderLeft: 0,
          borderRight: 0,
          borderRadius: 0,
          marginTop: 10
        }}
        rows={cash}
        columns={Cashcolumns}
        getRowId={(row) => row._id}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20, 30]}
        rowSelection={false}
      />
      {/* Display total amount */}
      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Typography variant="h6">Total Amount: {totalAmount}</Typography>
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
