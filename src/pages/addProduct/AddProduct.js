import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import ProductForm from "../../components/product/productForm/ProductForm";
import {
  createProduct,
  selectIsLoading,
} from "../../redux/features/product/productSlice";
import { Grid } from "@mui/material";

const initialState = {
  name: "",
  category: "",
  quantity: "",
  price: "",
};

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(initialState);
  const [productImage, setProductImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [chequeDate, setChequeDate] = useState(""); // Define chequeDate state
  const isLoading = useSelector(selectIsLoading);

  const { name, category, price, quantity } = product;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleChequeDateChange = (event) => {
    setChequeDate(event.target.value);
  };

  const saveProduct = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("paymentMethod", paymentMethod);
    if (paymentMethod === "Cheque") {
      formData.append("chequeDate", chequeDate); // Use chequeDate from state
    }
    if (productImage) {
      formData.append("image", productImage);
    }

    // Dispatching the createProduct action
    await dispatch(createProduct(formData));
    navigate("/dashboard");
  };

  return (
    <Fragment>
      <Grid container flexDirection={"column"}>
        {isLoading && <Loader />}
        <h3 className="--mt">Add New Product</h3>
        <Grid item display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <ProductForm
            product={product}
            productImage={productImage}
            imagePreview={imagePreview}
            description={description}
            paymentMethod={paymentMethod}
            setDescription={setDescription}
            handleInputChange={handleInputChange}
            handleImageChange={handleImageChange}
            handlePaymentMethodChange={handlePaymentMethodChange}
            chequeDate={chequeDate}
            setChequeDate={setChequeDate}
            saveProduct={saveProduct}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default AddProduct;
