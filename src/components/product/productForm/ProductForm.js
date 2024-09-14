import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";

const ImagePreview = styled("img")({
  width: "100%",
  maxHeight: "300px",
  objectFit: "cover",
  marginTop: "16px",
});

const ProductForm = ({
  banks,
  selectedBank,
  handleBankChange,
  product,
  imagePreview,
  handleInputChange,
  handleImageChange,
  handlePaymentMethodChange,
  paymentMethod,
  chequeDate,
  setChequeDate,
  saveProduct,
  warehouses,
  selectedWarehouse,
  handleWarehouseChange,
}) => {
  // State to track selected bank

  const handleFormSubmit = (event) => {
    event.preventDefault();
    saveProduct();
  };
  console.log("banksbanks", banks);
  return (
    <div>
      <Card>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Product Name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Product Category"
              name="category"
              value={product.category}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="warehouse-label">Select Warehouse</InputLabel>
              <Select
                labelId="warehouse-label"
                id="warehouse"
                value={selectedWarehouse}
                onChange={handleWarehouseChange}
                label="Warehouse"
              >
                <MenuItem value="">
                  <em>Select Warehouse</em>
                </MenuItem>
                {warehouses && warehouses.length > 0 ? (
                  warehouses.map((warehouse) => (
                    <MenuItem key={warehouse._id} value={warehouse._id}>
                      {warehouse.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No warehouses available</MenuItem>
                )}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                label="Payment Method"
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="cheque">Cheque</MenuItem>
                <MenuItem value="credit">Credit</MenuItem>
              </Select>
            </FormControl>

            {/* Bank Dropdown for Cash Payment */}
            {paymentMethod === "online" && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="bankID-label">Select Bank</InputLabel>
                <Select
                  labelId="bankID-label"
                  id="bankID"
                  value={selectedBank}
                  onChange={handleBankChange}
                  label="Bank Name"
                >
                  <MenuItem value="">
                    <em>Select Bank</em>
                  </MenuItem>
                  {Array.isArray(banks) && banks.length > 0 ? (
                    banks.map((bank) => (
                      <MenuItem key={bank._id} value={bank._id}>
                        {bank.bankName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No banks available</MenuItem>
                  )}
                </Select>
              </FormControl>
            )}

            {paymentMethod === "cheque" && (
              <TextField
                fullWidth
                label="Cheque Date"
                type="date"
                value={chequeDate}
                onChange={(e) => setChequeDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            )}

            {(paymentMethod === "cheque" ||
              // sale.paymentMethod === "credit" ||
              paymentMethod === "online") && (
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
                  {imagePreview && <ImagePreview src={imagePreview} alt="Preview" />}
                </Grid>
              )}

            {/* {imagePreview && <ImagePreview src={imagePreview} alt="Preview" />} */}

            <TextField
              type="number"
              label="Product Price"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            <TextField
              type="number"
              label="Product Quantity"
              name="quantity"
              value={product.quantity}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Save Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
