import React, { useState } from "react";
import { Avatar, Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Remove, Delete, History } from "@mui/icons-material";
import AddBalanceModal from "../../components/Models/AddBalanceModal";
import MinusBalanceModal from "../../components/Models/MinusBalanceModal";
import ConfirmDeleteModal from "../../components/Models/ConfirmDeleteModal";
import TransactionHistoryModal from "../../components/Models/TransactionHistoryModal";

const CustomerList = ({ customers, refreshCustomers }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isMinusModalOpen, setMinusModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);

  const openAddModal = (customer) => {
    setSelectedCustomer(customer);
    setAddModalOpen(true);
  };

  const openMinusModal = (customer) => {
    setSelectedCustomer(customer);
    setMinusModalOpen(true);
  };

  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  const openHistoryModal = (customer) => {
    setSelectedCustomer(customer);
    setHistoryModalOpen(true);
  };

  const closeModals = () => {
    setAddModalOpen(false);
    setMinusModalOpen(false);
    setDeleteModalOpen(false);
    setHistoryModalOpen(false);
    setSelectedCustomer(null);
  };

  const columns = [
    {
      field: "avatar",
      headerName: "Avatar",
      width: 100,
      renderCell: (params) => (
        <Avatar src={params.value} alt={params.row.username} />
      ),
    },
    { field: "_id", headerName: "ID", width: 220 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 120 },
    { field: "balance", headerName: "Balance", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => (
        <Grid container spacing={1}>
          <Grid item>
            <IconButton
              color="primary"
              onClick={() => openAddModal(params.row)}
            >
              <Add />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              color="secondary"
              onClick={() => openMinusModal(params.row)}
            >
              <Remove />
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
          <Grid item>
            <IconButton
              color="info"
              onClick={() => openHistoryModal(params.row)}
            >
              <History />
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
        rows={customers}
        columns={columns}
        getRowId={(row) => row._id}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[15, 20, 30]}
        rowSelection={false}
      />

      {/* Add Balance Modal */}
      <AddBalanceModal
        open={isAddModalOpen}
        onClose={closeModals}
        customer={selectedCustomer}
        onSuccess={refreshCustomers} 
      />

      {/* Minus Balance Modal */}
      <MinusBalanceModal
        open={isMinusModalOpen}
        onClose={closeModals}
        customer={selectedCustomer}
        onSuccess={refreshCustomers} 
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onClose={closeModals}
        customer={selectedCustomer}
        onSuccess={refreshCustomers} 
      />

      {/* Transaction History Modal */}
      <TransactionHistoryModal
        open={isHistoryModalOpen}
        onClose={closeModals}
        customer={selectedCustomer}
      />
    </Box>
  );
};

export default CustomerList;
