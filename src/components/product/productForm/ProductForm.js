import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel 
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
  handleImageChange, // This is the prop function, keep as is
  handlePaymentMethodChange,
  paymentMethod,
  saveProduct,
}) => {
  const [chequeDate, setChequeDate] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Function to handle cheque date change
  const handleChequeDateChange = (event) => {
    setChequeDate(event.target.value); // Update chequeDate state
  };

  const onImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    // Update image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      handleImageChange(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      handleImageChange(null);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Create a FormData object to handle file uploads
    const formData = new FormData();
    formData.append("name", product?.name || '');
    formData.append("category", product?.category || '');
    formData.append("price", product?.price || '');
    formData.append("quantity", product?.quantity || '');
    formData.append("paymentMethod", paymentMethod);
    if (paymentMethod === "Cheque") {
      formData.append("chequeDate", chequeDate);
    }
    if (selectedImage) {
      formData.append("image", selectedImage); // Add image file to FormData
    }

    saveProduct(formData); // Pass the FormData object to saveProduct
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
                <MenuItem value="Credit">Credit</MenuItem>
              </Select>
            </FormControl>

            {(paymentMethod === "Cheque" || paymentMethod === "Credit" || paymentMethod === "Online") && (
              <>
                {paymentMethod === "Cheque" && (
                  <TextField
                    fullWidth
                    label="Cheque Date"
                    type="date"
                    value={chequeDate}
                    onChange={handleChequeDateChange} // Use the defined function
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                  />
                )}
                <TextField
                  type="file"
                  label="Upload Image"
                  name="image"
                  onChange={onImageChange} // Use the renamed function here
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                {imagePreview && <ImagePreview src={imagePreview} alt="Preview" />}
              </>
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
