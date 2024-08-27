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
  const [chequeDate, setChequeDate] = useState("");
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
  const generateKSKU = (category) => {
    const letter = category.slice(0, 3).toUpperCase();
    const number = Date.now();
    const sku = letter + "-" + number;
    return sku;
  };
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const saveProduct = async ({ chequeDate }) => {
    const sku = generateKSKU(category);
    const formData = {
      name,
      sku,
      category,
      quantity: Number(quantity),
      price,
      paymentMethod,
      chequeDate: paymentMethod === "Cheque" ? chequeDate : null,
    };

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
            saveProduct={saveProduct}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default AddProduct;
