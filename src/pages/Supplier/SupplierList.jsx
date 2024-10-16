import React, { useState } from "react";
import { Avatar, Box, Grid, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Delete, History, Remove } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { selectCanDelete } from "../../redux/features/auth/authSlice"; // Import the privilege selector
import AddSupplierBalanceModal from "../../components/Models/AddSupplierBalanceModal";
import MinusSupplierBalanceModal from "../../components/Models/MinusSupplierBalanceModal";
import ConfirmDeleteModal from "../../components/Models/ConfirmDeleteModal";
import SupplierTransactionHistoryModal from "../../components/Models/SupplierTransactionHistoryModal";

const SupplierList = ({ suppliers, refreshSuppliers }) => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isMinusModalOpen, setMinusModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
  const [supplierList, setSupplierList] = useState(suppliers);

  // Check if the user is admin from local storage
  const isAdmin = localStorage.getItem("userRole") === "Admin";
  const canDeleteSupplier = useSelector((state) => selectCanDelete(state, "deleteSupplier"));

  // Open respective modals
  const openAddModal = (supplier) => {
    setSelectedSupplier(supplier);
    setAddModalOpen(true);
  };

  const openMinusModal = (supplier) => {
    setSelectedSupplier(supplier);
    setMinusModalOpen(true);
  };

  const openDeleteModal = (supplier) => {
    if (!isAdmin && !canDeleteSupplier) {
      alert("You do not have permission to delete this supplier.");
      return;
    }
    setSelectedSupplier(supplier);
    setDeleteModalOpen(true);
  };

  const openHistoryModal = (supplier) => {
    setSelectedSupplier(supplier);
    setHistoryModalOpen(true);
  };

  const closeModals = () => {
    setAddModalOpen(false);
    setMinusModalOpen(false);
    setDeleteModalOpen(false);
    setHistoryModalOpen(false);
    setSelectedSupplier(null);
  };

  // Handle successful deletion
  const handleDeleteSuccess = (deletedSupplierId) => {
    setSupplierList(supplierList.filter(supplier => supplier._id !== deletedSupplierId));
    closeModals();
  };

  const columns = [
    {
      field: "avatar",
      headerName: "Avatar",
      width: 100,
      renderCell: (params) => (
        <Avatar src={params.value || "/default-avatar.png"} alt={params.row.username} />
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
            <IconButton color="primary" onClick={() => openAddModal(params.row)}>
              <Add />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton color="secondary" onClick={() => openMinusModal(params.row)}>
              <Remove />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              color="error"
              onClick={() => openDeleteModal(params.row)}
              disabled={!isAdmin && !canDeleteSupplier} // Enable delete button if isAdmin is true
            >
              <Delete />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton color="info" onClick={() => openHistoryModal(params.row)}>
              <History />
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
  ];

  if (!supplierList || supplierList.length === 0) {
    return <div>No suppliers available</div>;
  }

  return (
    <Box sx={{ margin: 3, bgcolor: "white", borderRadius: 2, padding: 3, width: "auto" }}>
      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
        rows={supplierList}
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
      {isAddModalOpen && (
        <AddSupplierBalanceModal
          open={isAddModalOpen}
          onClose={closeModals}
          supplier={selectedSupplier}
          onSuccess={refreshSuppliers}
        />
      )}

      {/* Minus Balance Modal */}
      {isMinusModalOpen && (
        <MinusSupplierBalanceModal
          open={isMinusModalOpen}
          onClose={closeModals}
          supplier={selectedSupplier}
          onSuccess={refreshSuppliers}
        />
      )}

      {/* Confirm Delete Modal */}
      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          open={isDeleteModalOpen}
          onClose={closeModals}
          entry={selectedSupplier}
          entryType="supplier"
          onSuccess={() => handleDeleteSuccess(selectedSupplier._id)}
        />
      )}

      {/* Transaction History Modal */}
      {isHistoryModalOpen && (
        <SupplierTransactionHistoryModal
          open={isHistoryModalOpen}
          onClose={closeModals}
          supplier={selectedSupplier}
        />
      )}
    </Box>
  );
};

export default SupplierList;
