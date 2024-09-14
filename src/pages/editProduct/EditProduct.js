import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import ProductForm from "../../components/product/productForm/ProductForm";
import {
  getProduct,
  getProducts,
  selectIsLoading,
  selectProduct,
  updateProduct,
} from "../../redux/features/product/productSlice";
import { getWarehouses } from "../../redux/features/WareHouse/warehouseSlice"; // Add this import
import { getBanks } from "../../redux/features/Bank/bankSlice"; // Add this import
import { toast } from "react-toastify";
const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);

  const productEdit = useSelector(selectProduct);

  const [product, setProduct] = useState(productEdit);
  const [productImage, setProductImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const [selectedBank, setSelectedBank] = useState(""); // Add this state
  const banks = useSelector((state) => state.bank.banks); // Add this selector
  const [selectedWarehouse, setSelectedWarehouse] = useState(""); // Add this state
  const warehouses = useSelector((state) => state.warehouse.warehouses); // Add this selector
  useEffect(() => {
    dispatch(getProduct(id));
    dispatch(getBanks()); // Fetch banks when component mounts
    dispatch(getWarehouses());
  }, [dispatch, id]);
  // const name = "";
  const { name,category, price, quantity } = product;
  console.log("pro", product);

  useEffect(() => {
    setProduct(productEdit);

    setImagePreview(
      productEdit && productEdit.image ? `${productEdit.image.filePath}` : null
    );

    setDescription(
      productEdit && productEdit.description ? productEdit.description : ""
    );
  }, [productEdit]);
  const handleWarehouseChange = (event) => {
    setSelectedWarehouse(event.target.value);
  };
  const handleBankChange = (event) => {
    console.log("event", event.target.value);
    setSelectedBank(event.target.value);
  };
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
  // const saveProduct = async () => {

  //   const sku = generateKSKU(category);
  //   const formData = {
  //     name,
  //     sku,
  //     category,
  //     quantity: Number(quantity),
  //     price,
  //     paymentMethod,
  //     chequeDate: paymentMethod === "Cheque" ? chequeDate : null,
  //   };

  //   await dispatch(updateProduct({ id, formData }));
  //   await dispatch(getProducts());
  //   navigate("/dashboard");
  // };
  const saveProduct = async () => {
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
    if (paymentMethod === "Cheque") {
      if (!chequeDate) {
        toast.error("Please enter a cheque date");
        return;
      }
      formData.append("chequeDate", chequeDate);
    }
    if (paymentMethod === "Online") {
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
    await dispatch(updateProduct({ id, formData }));
    await dispatch(getProducts());
    navigate("/dashboard");
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };
  return (
    <div>
      {isLoading && <Loader />}
      <h3 className="--mt">Edit Product</h3>
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
        banks={banks}
        selectedBank={selectedBank}
        handleBankChange={handleBankChange}
        chequeDate={chequeDate}
        setChequeDate={setChequeDate}
        warehouses={warehouses} // Add this prop
        selectedWarehouse={selectedWarehouse} // Add this prop
        handleWarehouseChange={handleWarehouseChange} // Add this prop
      />
    </div>
  );
};

export default EditProduct;
