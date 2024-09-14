import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import ProductForm from "../../components/product/productForm/ProductForm";
import {
  createProduct,
  selectIsLoading,
} from "../../redux/features/product/productSlice";
import { Grid } from "@mui/material";
import { getWarehouses } from "../../redux/features/WareHouse/warehouseSlice"; // Add this import
import { getBanks } from "../../redux/features/Bank/bankSlice"; // Add this import
import { toast, ToastContainer } from "react-toastify";

const initialState = {
  name: "",
  category: "",
  quantity: "",
  price: "",
  status: false,
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
  const [selectedBank, setSelectedBank] = useState(""); // Add this state
  const banks = useSelector((state) => state.bank.banks); // Add this selector
  const { name, category, price, quantity } = product;
  const [selectedWarehouse, setSelectedWarehouse] = useState(""); // Add this state
  const warehouses = useSelector((state) => state.warehouse.warehouses); // Add this selector

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };
  useEffect(() => {
    dispatch(getBanks()); // Fetch banks when component mounts
    dispatch(getWarehouses()); // Fetch warehouses when component mounts

  }, [dispatch]);

  const handleWarehouseChange = (event) => {
    setSelectedWarehouse(event.target.value);
  };
  const handleBankChange = (event) => {
    console.log("event",event.target.value);
    setSelectedBank(event.target.value);
  };
  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };


  const saveProduct = async () => {

    console.log("CLCIK", name, category, quantity, price, selectedWarehouse, paymentMethod, chequeDate,"SLE", selectedBank);
    const formData = new FormData();
    if (!name) {
      toast.error("Please enter a product name");
      return;
    }
    formData.append("name", name);
    if (!category) {
      toast.error("Please enter a product category");
      return;
    }
    formData.append("category", category);
    if (!quantity) {
      toast.error("Please enter a product quantity");
      return;
    }
    formData.append("quantity", quantity);
    if (!price) {
      toast.error("Please enter a product price");
      return;
    }
    formData.append("price", price);
    if (!selectedWarehouse) {
      toast.error("Please select a warehouse");
      return;
    }
    formData.append("warehouse", selectedWarehouse);
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    formData.append("paymentMethod", paymentMethod);
    if (paymentMethod === "cheque") {
      if (!chequeDate) {
        toast.error("Please enter a cheque date");
        return;
      }
      formData.append("chequeDate", chequeDate);
    }
    if (paymentMethod === "online") {
      if (!selectedBank) {
        toast.error("Please select a bank");
        return;
      }
      console.log("selectedBank", selectedBank);
      formData.append("bank", selectedBank);
    }
    if (productImage) {
      formData.append("image", productImage);
    }
    formData.append("status", false);
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
            banks={banks}
            selectedBank={selectedBank}
            product={product}
            productImage={productImage}
            imagePreview={imagePreview}
            description={description}
            paymentMethod={paymentMethod}
            setDescription={setDescription}
            handleInputChange={handleInputChange}
            handleImageChange={handleImageChange}
            handleBankChange={handleBankChange}
            handlePaymentMethodChange={handlePaymentMethodChange}
            chequeDate={chequeDate}
            setChequeDate={setChequeDate}
            saveProduct={saveProduct}
            warehouses={warehouses} // Add this prop
            selectedWarehouse={selectedWarehouse} // Add this prop
            handleWarehouseChange={handleWarehouseChange} // Add this prop
          />
        </Grid>
      </Grid>
      <ToastContainer />
    </Fragment>
  );
};

export default AddProduct;
