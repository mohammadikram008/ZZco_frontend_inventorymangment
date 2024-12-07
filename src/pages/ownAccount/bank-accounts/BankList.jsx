import React, { useState, useMemo, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import ConfirmDeleteModal from "../../../components/Models/ConfirmDeleteModal";
import EditBankModal from "../../../components/Models/EditBankModal";
import CustomTable from "../../../components/CustomTable/OwnAccount";
import { useSelector } from "react-redux";
import { selectCanDelete } from "../../../redux/features/auth/authSlice";
import TransactionHistoryModal from "../../../components/Models/TransactionModal"; // Import the new modal component

const BankList = ({ banks, refreshBanks, cash }) => {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [entryType, setEntryType] = useState("bank");
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const canDelete = useSelector((state) => selectCanDelete(state));

  useEffect(() => {
    console.log("Banks data:", banks);
  }, [banks]);

  const openEditModal = (entry, type) => {
    setSelectedEntry(entry);
    setEntryType(type);
    setEditModalOpen(true);
  };
  const opentransectiopnModal = (entry, type) => {
   
    setSelectedEntry(entry);
    setEntryType(type);
    setOpenModal(true);
  };
  const openDeleteModal = (entry, type) => {
    if (!canDelete) {
      alert("You do not have permission to delete this entry.");
      return;
    }
    setSelectedEntry(entry);
    setEntryType(type);
    setDeleteModalOpen(true);
  };

  const closeModals = () => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedEntry(null);
  };
  const closeTransectionModals = () => {
    setEditModalOpen(false);
    setOpenModal(false);
    setSelectedEntry(null);
  };

  const totalBankAmount = useMemo(() => {
    return banks?.reduce((total, bank) => total + (bank.balance || 0), 0) || 0;
  }, [banks]);

  const totalCashAmount = useMemo(() => {
    return cash?.allEntries?.reduce((total, entry) => {
      const balance = entry.type === "deduct" ? -Math.abs(entry.balance || 0) : Math.abs(entry.balance || 0);
      return total + balance;
    }, 0) || 0;
  }, [cash]);

  const bankColumns = [
    { field: "bankName", headerName: "Bank Name" },
    { field: "balance", headerName: "Balance", align: "right" },
  ];

  const cashColumns = [
    {
      field: "createdAt",
      headerName: "Date",
      valueGetter: (params) => {
        const date = new Date(params.row.createdAt);
        return date.toISOString().slice(0, 10);
      },
    },
    { field: "balance", headerName: "Balance", align: "right" },
    { field: "type", headerName: "Type" },
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
        data={banks || []}
        onEdit={(bank) => openEditModal(bank, "bank")}
        onDelete={(bank) => openDeleteModal(bank, "bank")}
        onView={(bank) => opentransectiopnModal(bank,"bank")}
        cashtrue={"false"}
      />

      <Box display={"flex"} justifyContent={"center"} alignContent={"center"} mt={3}>
        <Typography variant="h3">Cash List</Typography>
      </Box>

      <CustomTable
        columns={cashColumns}
        data={cash?.allEntries || []}
        onEdit={(cashEntry) => openEditModal(cashEntry, "cash")}
        onDelete={(cashEntry) => openDeleteModal(cashEntry, "cash")}
        sx={{ marginTop: 3 }}
        cashtrue={"true"}
      />

      {/* Display total amounts with color styling */}
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ mt: 2 }}>
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="h5" sx={{ color: "#388E3C", fontWeight: "bold" }}>
            Total Cash Amount: {totalCashAmount}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h5" sx={{ color: "#1976D2", fontWeight: "bold" }}>
            Total Bank Amount: {totalBankAmount}
          </Typography>
        </Box>
      </Box>

      {/* Edit Bank/Cash Modal */}
      <EditBankModal
        open={isEditModalOpen}
        onClose={closeModals}
        entry={selectedEntry}
        entryType={entryType}
        onSuccess={refreshBanks}
        totalCashAmount={totalCashAmount}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onClose={closeModals}
        entry={selectedEntry}
        entryType={entryType}
        onSuccess={refreshBanks}
      />
        <TransactionHistoryModal 
        open={openModal} 
        onClose={closeTransectionModals} 
        transactions={selectedEntry} 
      />
    </Box>
  );
};

export default BankList;
