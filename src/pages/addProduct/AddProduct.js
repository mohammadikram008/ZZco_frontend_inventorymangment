import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Loader from "../../components/loader/Loader";
import { getProducts } from "../../redux/features/product/productSlice"; // Import getProducts

import ProductForm from "../../components/product/productForm/ProductForm";
import {
  createProduct,
  selectIsLoading,
} from "../../redux/features/product/productSlice";
import Modal from "@mui/material/Modal"; // Import the Modal component
import Supplier from "../Supplier/Supplier"; // Import the Supplier component
import { getWarehouses } from "../../redux/features/WareHouse/warehouseSlice";
import { getBanks } from "../../redux/features/Bank/bankSlice";
import { getSuppliers } from '../../redux/features/supplier/supplierSlice';
import { toast, ToastContainer } from "react-toastify";
import {
  Grid,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table, // Add this import
  TableHead, // Add this import
  TableBody, // Add this import
  TableRow, // Add this import
  TableCell,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddSupplierModal from "../../components/Models/addSupplierModel";
import AddWareHouseModal from "../../components/Models/AddWareHouse";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const BACKEND_URL = "https://zzcoinventorymanagmentbackend.up.railway.app";
const API_URL = `${BACKEND_URL}api/suppliers`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(3, 0),
  backgroundColor: theme.palette.background.default,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const steps = ['Product Details', 'Shipping & Payment', 'Review'];

const initialState = {
  name: "",
  category: "",
  quantity: "",
  price: "",
  description: "",
  status: false,
};

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.product.products); // Fetch existing products
  const [showStepper, setShowStepper] = useState(false); // State to control stepper visibility
  const [openModal, setOpenModal] = useState(false); // State to control the modal visibility

  useEffect(() => {
    dispatch(getProducts()); // Fetch products on component mount
  }, [dispatch]);
  const handleAddProductClick = () => {
    setOpenModal(true); // Show the modal when button is clicked
    setActiveStep(0); // Reset to the first step
  };
  const [product, setProduct] = useState(initialState);
  const [productImage, setProductImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [shippingType, setShippingType] = useState("local");
  const [supplier, setSupplier] = useState({ id: "", name: "" });
  const [activeStep, setActiveStep] = useState(0);
  const [openSupplierModal, setOpenSupplierModal] = useState(false); // State to control the supplier modal
  const [openWareHouseModal, setOpenWareHosueModal] = useState(false); // State to control the supplier modal
  const handleOpenModal = () => setOpenSupplierModal(true);
  const handleCloseModal = () => setOpenSupplierModal(false);
  const handleOpenModalwarehouse = () => setOpenWareHosueModal(true);
  const handleCloseModalwarehouse = () => setOpenWareHosueModal(false);
  const isLoading = useSelector(selectIsLoading);
  const banks = useSelector((state) => state.bank.banks);
  const warehouses = useSelector((state) => state.warehouse.warehouses);
  const suppliers = useSelector((state) => state.supplier.suppliers);
  const [openImageModal, setOpenImageModal] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {
    dispatch(getBanks());
    dispatch(getWarehouses());
    dispatch(getSuppliers());
  }, [dispatch]);
  const handleOpenSupplierModal = () => setOpenSupplierModal(true); // Function to open the supplier modal
  const handleCloseSupplierModal = () => setOpenSupplierModal(false); // Function to close the supplier modal

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenImageModal(true);
  };
  

  const handleSupplierChange = (event) => {
    const selectedSupplier = suppliers.find(s => s._id === event.target.value);
    if (selectedSupplier) {
      setSupplier({ id: selectedSupplier._id, name: selectedSupplier.name });
    }
  };

  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const recordSupplierTransaction = async () => {
    if (!supplier.id || !product.price) return;

    const transactionData = {
      name: product.name,
      amount: product.price * product.quantity,
      paymentMethod: paymentMethod,
      chequeDate: paymentMethod === "cheque" ? chequeDate : null,
      type: "debit",
    };

    try {
      await axios.post(`${API_URL}/${supplier.id}/transaction`, transactionData);
      toast.success("Transaction recorded in supplier history.");
    } catch (error) {
      console.error("Failed to record transaction:", error);
      toast.error("Failed to record transaction in supplier history.");
    }
  };

  const saveProduct = async () => {
    const formData = new FormData();
    Object.keys(product).forEach(key => formData.append(key, product[key]));
    formData.append("shippingType", shippingType);
    formData.append("warehouse", selectedWarehouse || "Not Required");
    formData.append("paymentMethod", paymentMethod);
    formData.append("chequeDate", chequeDate);
    formData.append("bank", selectedBank);
    formData.append("supplier", supplier.id);

    if (productImage) {
      formData.append("image", productImage);
    }

    const res = await dispatch(createProduct(formData));
    if (res.payload && !res.error) {
      toast.success("Product added successfully");
      navigate("/dashboard");
    }
  };

  const handleSubmit = async () => {
    if (product.quantity <= 0 || product.price <= 0) {
      toast.error("Quantity and Price must be greater than 0.");
      return; // Exit the function if validation fails
    }
    await saveProduct();
    await recordSupplierTransaction();
    handleNext();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <StyledCard>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Category"
                    name="category"
                    value={product.category}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={product.quantity}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                     name="description"
                    type="string"
                    label="Description"
                    value={product.description}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
  <input
    accept="image/*"
    style={{ display: 'none' }}
    id="raised-button-file"
    type="file"
    onChange={handleImageChange}
  />
  <label htmlFor="raised-button-file">
    <Button variant="contained" component="span">
      Upload Product Image
    </Button>
  </label>
  
  {imagePreview && (
    <img 
      src={imagePreview} 
      alt="Preview" 
      style={{ marginTop: 10, maxWidth: '100%', maxHeight: 200 }} 
    />
  )}
</Grid>

              </Grid>
            </CardContent>
          </StyledCard>
        );
      case 1:
        return (
          <StyledCard>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Shipping Type</InputLabel>
                    <Select
                      value={shippingType}
                      onChange={(e) => setShippingType(e.target.value)}
                    >
                      <MenuItem value="local">Local</MenuItem>
                      <MenuItem value="international">International</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {shippingType === "local" && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Warehouse</InputLabel>
                      <Select
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                      >
                        {warehouses.map((warehouse) => (
                          <MenuItem key={warehouse._id} value={warehouse._id}>
                            {warehouse.name}
                          </MenuItem>
                        ))}
                        <MenuItem value="addNew" onClick={handleOpenModalwarehouse} style={{ backgroundColor: 'silver' }}>
                          Add New WareHouse
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="cheque">Cheque</MenuItem>
                      <MenuItem value="online">Online</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {paymentMethod === "cheque" && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Cheque Date"
                      type="date"
                      value={chequeDate}
                      onChange={(e) => setChequeDate(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                )}
                {paymentMethod === "cheque" && (
                  <Grid item xs={12}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="raised-button-file"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="raised-button-file">
                      <Button variant="contained" component="span">
                        Upload Cheque Image
                      </Button>
                    </label>
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" style={{ marginTop: 10, maxWidth: '100%', maxHeight: 200 }} />
                    )}
                  </Grid>
                )}
                {(paymentMethod === "online" || paymentMethod === "cheque") && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Bank</InputLabel>
                      <Select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                      >
                        {banks.map((bank) => (
                          <MenuItem key={bank._id} value={bank._id}>
                            {bank.bankName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                <Grid item xs={12} sm={6} display="flex" flexDirection="row" justifyContent="space-between">
                  <FormControl fullWidth>
                    <InputLabel>Supplier</InputLabel>
                    <Select
                      value={supplier.id}
                      onChange={handleSupplierChange}
                      label="Supplier"
                    >
                      {suppliers.map((s) => (
                        <MenuItem key={s._id} value={s._id}>
                          {s.username}
                        </MenuItem>
                      ))}
                      <MenuItem value="addNew" onClick={handleOpenModal} style={{ backgroundColor: 'silver' }}>
                        Add New Supplier
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

              </Grid>
            </CardContent>
          </StyledCard>
        );
      case 2:
        return (
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>Review your product details</Typography>
              <Typography>Name: {product.name}</Typography>
              <Typography>Category: {product.category}</Typography>
              <Typography>Price: ${product.price}</Typography>
              <Typography>Description: {product.description}</Typography>
              <Typography>Quantity: {product.quantity}</Typography>
              <Typography>Shipping Type: {shippingType}</Typography>
              <Typography>Payment Method: {paymentMethod}</Typography>
            </CardContent>
          </StyledCard>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">

      <StyledPaper elevation={3}>
        <Button variant="contained" color="primary" onClick={handleAddProductClick}>
          Add Product
        </Button>
        <Typography variant="h4" gutterBottom align="center">
          Existing Products        </Typography>
        {/* <Typography variant="h6" gutterBottom>
          Existing Products
        </Typography> */}
       <Table>
  <TableHead>
    <TableRow>
      <TableCell>Name</TableCell>
      <TableCell>Category</TableCell>
      <TableCell>Price</TableCell>
      <TableCell>Description</TableCell>
      <TableCell>Quantity</TableCell>
    
      <TableCell>Created Date</TableCell>  
    </TableRow>
  </TableHead>
  <TableBody>
    {products.map((product) => (
      <TableRow key={product._id}>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.category}</TableCell>
        <TableCell>{product.price}</TableCell>
        <TableCell>{product.description}</TableCell>
        <TableCell>{product.quantity}</TableCell>
       


        <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell> {/* Format Date */}
      </TableRow>
    ))}
  </TableBody>
</Table>

      </StyledPaper>

      <Modal open={openModal} onClose={() => setOpenModal(false)} style={{ width: '50%', margin: 'auto' }}>
        <StyledPaper elevation={2}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box mt={4}>
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              >
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
              <Button
                onClick={() => setOpenModal(false)}
                sx={{ ml: 1 }}
              >
                Close
              </Button>
            </Box>
          </Box>
        </StyledPaper>
      </Modal>
      {/* {showStepper && (
          
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
        <Box mt={4}>
          {activeStep === steps.length ? (
            <Box>
              <Typography>All steps completed - you're finished</Typography>
              <Button onClick={() => navigate("/dashboard")} sx={{ mt: 2 }}>
                Go to Dashboard
              </Button>
            </Box>
          ) : (
            <Box>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                >
                  {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </StyledPaper> */}
      {isLoading && <Loader />}
      <AddSupplierModal
        open={openSupplierModal}
        handleClose={handleCloseModal}

      />
      <AddWareHouseModal
        open={openWareHouseModal}
        onClose={handleCloseModalwarehouse}

      />
      <ToastContainer />

    </Container>
  );
};

export default AddProduct;
