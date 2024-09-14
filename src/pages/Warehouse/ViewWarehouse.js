import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  createWarehouse,
  getWarehouses,
  updateWarehouse,
  deleteWarehouse,
  selectWarehouses,
  selectIsLoading
} from '../../redux/features/WareHouse/warehouseSlice';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  TablePagination,
  IconButton,
  Modal,
  Typography
} from '@mui/material';
import CustomTable from '../../components/CustomTable/CustomTable';
import axios from 'axios';
import { toast } from 'react-toastify';

const WarehouseManager = () => {
  const dispatch = useDispatch();
  const warehouses = useSelector(selectWarehouses);
  const isLoading = useSelector(selectIsLoading);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [open, setOpen] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState({ name: '', location: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [productsModalOpen, setProductsModalOpen] = useState(false);
  const [warehouseProducts, setWarehouseProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const API_URL = `${BACKEND_URL}/api/warehouses`;

  useEffect(() => {
    dispatch(getWarehouses());
  }, [dispatch]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewWarehouse({ name: '', location: '' });
    setEditingWarehouse(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWarehouse(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (warehouse) => {
    console.log("warehouseEDIT", warehouse);
    setEditingWarehouse(warehouse);
    setNewWarehouse({ name: warehouse.name, location: warehouse.location });
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      dispatch(deleteWarehouse(id));
    }
  };

  const handleSubmit = () => {
    if (editingWarehouse) {
      dispatch(updateWarehouse({ id: editingWarehouse._id, formData: newWarehouse }));
    } else {
      dispatch(createWarehouse(newWarehouse));
    }
    handleClose();
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewProducts = async (warehouseId) => {
    console.log("warehouseId", warehouseId);
    setLoadingProducts(true);
    try {
      const response = await axios.get(`${API_URL}/allproducts/${warehouseId}`,{withCredentials:true});
      console.log("responseRR", response.data);
      setWarehouseProducts(response.data);
      setProductsModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch warehouse products");
    }
    setLoadingProducts(false);
  };

  const columns = [
    { field: 'name', headerName: 'Name' },
    { field: 'location', headerName: 'Location' },
    { field: 'createdAt', headerName: 'Created At', renderCell: (params) => new Date(params.value).toLocaleString() },
    { field: 'updatedAt', headerName: 'Updated At', renderCell: (params) => new Date(params.value).toLocaleString() },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleViewProducts(params._id)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => handleEdit(params)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const productColumns = [
    { field: 'name', headerName: 'Product Name' },
    { field: 'category', headerName: 'Category' },
    { field: 'quantity', headerName: 'Quantity', align: 'right' },
    { field: 'price', headerName: 'Price', align: 'right' },
    // { field: 'status', headerName: 'Status' },
  ];

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add Warehouse
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="warehouse-modal-title"
        aria-describedby="warehouse-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="warehouse-modal-title" variant="h6" component="h2">
            {editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Warehouse Name"
            type="text"
            fullWidth
            variant="standard"
            value={newWarehouse.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            variant="standard"
            value={newWarehouse.location}
            onChange={handleInputChange}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingWarehouse ? 'Update' : 'Add'}
            </Button>
          </Box>
        </Box>
      </Modal>

      <CustomTable
        columns={columns}
        data={warehouses}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Modal
        open={productsModalOpen}
        onClose={() => setProductsModalOpen(false)}
        aria-labelledby="warehouse-products-modal"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="warehouse-products-modal" variant="h6" component="h2">
            Warehouse Products
          </Typography>
          <Box sx={{ mt: 2 }}>
            {warehouseProducts ? (
              <CustomTable
                columns={productColumns}
                data={warehouseProducts}
                page={0}
                rowsPerPage={5}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
              />
            ) : (
              <CircularProgress />
            )}
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setProductsModalOpen(false)}>Close</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default WarehouseManager;