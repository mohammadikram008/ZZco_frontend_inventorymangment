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
  Grid 
} from "@mui/material";
import { styled } from "@mui/system";

const ImagePreview = styled('img')({
  width: '100%',
  maxHeight: '300px',
  objectFit: 'cover',
  marginTop: '16px',
});

const ProductForm = ({
  product,
  imagePreview,
  description,
  setDescription,
  handleInputChange,
  handleImageChange,
  handlePaymentMethodChange,
  paymentMethod,
  saveProduct,
}) => {
  const [chequeDate, setChequeDate] = useState("");

  const handleChequeDateChange = (event) => {
    setChequeDate(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    saveProduct({ chequeDate });
  };

  return (
    <div>
      <Card>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Product Name"
              name="name"
              value={product?.name || ''}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Product Category"
              name="category"
              value={product?.category || ''}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            <TextField
              type="number"
              label="Product Price"
              name="price"
              value={product?.price || ''}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            <TextField
              type="number"
              label="Product Quantity"
              name="quantity"
              value={product?.quantity || ''}
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
                <MenuItem value="Cheque">Credit</MenuItem>
              </Select>
            </FormControl>

            {paymentMethod === "Cheque" && (
              <TextField
                fullWidth
                label="Cheque Date"
                type="date"
                value={chequeDate}
                onChange={handleChequeDateChange}
                // InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            )}

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
