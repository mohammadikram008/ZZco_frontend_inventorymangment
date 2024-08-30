import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Box
} from "@mui/material";

export default function AddSale({
  addSaleModalSetting,
  products,
  stores,
  handlePageUpdate,
}) {
  const [sale, setSale] = useState({
    productID: "",
    customerID: "",
    stockSold: "",
    saleDate: "",
    totalSaleAmount: "",
    paymentMethod: "",
    chequeDate: "",
  });
  const [open, setOpen] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const cancelButtonRef = useRef(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API_URL = `${BACKEND_URL}/api`;

  // Handling Input Change for input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSale((prevSale) => ({
      ...prevSale,
      [name]: value,
    }));
  };

  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // POST Data
  const addSale = () => {
    const formData = new FormData();
    formData.append("productID", sale.productID);
    formData.append("customerID", sale.customerID);
    formData.append("stockSold", sale.stockSold);
    formData.append("saleDate", sale.saleDate);
    formData.append("totalSaleAmount", sale.totalSaleAmount);
    formData.append("paymentMethod", sale.paymentMethod);
    if (sale.paymentMethod === "cheque") {
      formData.append("chequeDate", sale.chequeDate);
    }
    if (image) {
      formData.append("image", image);
    }

    fetch(`${API_URL}/sales/`, {
      method: "POST",
      body: formData,
      credentials: "include", // Include credentials to send cookies
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || "Failed to add sale");
          });
        }
        return response.json();
      })
      .then(() => {
        alert("Sale ADDED");
        handlePageUpdate();
        addSaleModalSetting();
        setOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to add sale. Please try again.");
      });
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="sm"
      ref={cancelButtonRef}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Box ml={1}>Add Sale</Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <form>
          <Grid container spacing={2}>
            {/* Product Selection */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="productID-label">Product Name</InputLabel>
                <Select
                  labelId="productID-label"
                  id="productID"
                  name="productID"
                  value={sale.productID}
                  onChange={handleInputChange}
                  label="Product Name"
                >
                  <MenuItem value="">
                    <em>Select Product</em>
                  </MenuItem>
                  {products.map((product) => (
                    <MenuItem key={product._id} value={product._id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Stock Sold */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Sold"
                type="number"
                name="stockSold"
                value={sale.stockSold}
                onChange={handleInputChange}
                placeholder="0 - 999"
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* Store Selection */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="storeID-label">Store Name</InputLabel>
                <Select
                  labelId="storeID-label"
                  id="storeID"
                  name="customerID"
                  value={sale.customerID}
                  onChange={handleInputChange}
                  label="Customer"
                >
                  <MenuItem value="">
                    <em>Select Store</em>
                  </MenuItem>
                  {stores.map((store) => (
                    <MenuItem key={store._id} value={store._id}>
                      {store.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Total Sale Amount */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Sale Amount"
                type="number"
                name="totalSaleAmount"
                value={sale.totalSaleAmount}
                onChange={handleInputChange}
                placeholder="$299"
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* Payment Method Selection */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="paymentMethod-label">Payment Method</InputLabel>
                <Select
                  labelId="paymentMethod-label"
                  id="paymentMethod"
                  name="paymentMethod"
                  value={sale.paymentMethod}
                  onChange={handleInputChange}
                  label="Payment Method"
                >
                  <MenuItem value="">
                    <em>Select Payment Method</em>
                  </MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="cheque">Cheque</MenuItem>
                  <MenuItem value="credit">Credit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Cheque Date */}
            {sale.paymentMethod === "cheque" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cheque Date"
                  type="date"
                  name="chequeDate"
                  value={sale.chequeDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                />
              </Grid>
            )}
            {/* Image Upload */}
            {(sale.paymentMethod === "cheque" || sale.paymentMethod === "credit" || sale.paymentMethod === "online") && (
              <Grid item xs={12}>
                <TextField
                  type="file"
                  label="Upload Image"
                  name="image"
                  onChange={handleImageChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" style={{ width: "100%", maxHeight: "300px", marginTop: "16px", objectFit: "cover" }} />
                )}
              </Grid>
            )}
            {/* Sales Date */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sales Date"
                type="date"
                id="saleDate"
                name="saleDate"
                value={sale.saleDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={addSale}
        >
          Add Sale
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            addSaleModalSetting();
            setOpen(false);
          }}
          ref={cancelButtonRef}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
