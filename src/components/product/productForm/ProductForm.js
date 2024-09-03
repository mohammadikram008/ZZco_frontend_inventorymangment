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
} from "@mui/material";
import { styled } from "@mui/system";

const ImagePreview = styled("img")({
  width: "100%",
  maxHeight: "300px",
  objectFit: "cover",
  marginTop: "16px",
});

const ProductForm = ({
  product,
  imagePreview,
  handleInputChange,
  handleImageChange,
  handlePaymentMethodChange,
  paymentMethod,
  chequeDate,
  setChequeDate,
  saveProduct,
}) => {
  // State to track selected bank
  const [selectedBank, setSelectedBank] = useState("");

  // List of Pakistani Banks
  const banks = [
    { _id: "1", name: "Habib Bank Limited (HBL)" },
    { _id: "2", name: "United Bank Limited (UBL)" },
    { _id: "3", name: "National Bank of Pakistan (NBP)" },
    { _id: "4", name: "MCB Bank Limited" },
    { _id: "5", name: "Allied Bank Limited (ABL)" },
    { _id: "6", name: "Bank Alfalah" },
    { _id: "7", name: "Standard Chartered Bank" },
    { _id: "8", name: "Meezan Bank" },
    { _id: "9", name: "Faysal Bank" },
    { _id: "10", name: "Askari Bank" },
    { _id: "11", name: "Bank of Punjab (BOP)" },
    { _id: "12", name: "Soneri Bank" },
    { _id: "13", name: "JS Bank" },
    { _id: "14", name: "Summit Bank" },
    { _id: "15", name: "Silkbank" },
    { _id: "16", name: "Dubai Islamic Bank" },
    { _id: "17", name: "Al Baraka Bank" },
    { _id: "18", name: "Habib Metropolitan Bank" },
    { _id: "19", name: "Samba Bank" },
    { _id: "20", name: "Bank Islami Pakistan" },
    { _id: "21", name: "FINCA Microfinance Bank" },
    { _id: "22", name: "Mobilink Microfinance Bank" },
    { _id: "23", name: "Khushhali Microfinance Bank" },
  ];

  const handleFormSubmit = (event) => {
    event.preventDefault();
    saveProduct();
  };

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
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                label="Payment Method"
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Online">Online</MenuItem>
                <MenuItem value="Cheque">Cheque</MenuItem>
                <MenuItem value="Credit">Credit</MenuItem>
              </Select>
            </FormControl>

            {/* Bank Dropdown for Cash Payment */}
            {paymentMethod === "Cash" && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="bankID-label">Select Bank</InputLabel>
                <Select
                  labelId="bankID-label"
                  id="bankID"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  label="Bank Name"
                >
                  <MenuItem value="">
                    <em>Select Bank</em>
                  </MenuItem>
                  {banks.map((bank) => (
                    <MenuItem key={bank._id} value={bank._id}>
                      {bank.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {paymentMethod === "Cheque" && (
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
