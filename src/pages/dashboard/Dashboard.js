import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductList from "../../components/product/productList/ProductList";
import ProductSummary from "../../components/product/productSummary/ProductSummary";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { selectIsLoggedIn } from "../../redux/features/auth/authSlice";
import { getProducts } from "../../redux/features/product/productSlice";
import { getBanks, selectBanks, selectIsLoading } from "../../redux/features/Bank/bankSlice";
import axios from "axios";

const Dashboard = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const [cash, setCash] = useState([]); // {{ edit_2 }}

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { products, isLoading, isError, message } = useSelector((state) => state.product);
  const bank = useSelector(selectBanks);

  const banksLoading = useSelector(selectIsLoading);

  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getProducts());
      dispatch(getBanks());
    }

    if (isError) {
      console.log(message);
    }
  }, [isLoggedIn, isError, message, dispatch]);
  useEffect(() => {
    const fetchCashData = async () => { // {{ edit_3 }}
      try {
        const response = await axios.get('http://localhost:5001/api/cash/all',{withCredentials:true}); // Replace with your API endpoint
        console.log("Response", response.data);
        setCash(response.data); // Store the fetched cash data
      } catch (error) {
        console.error('Error fetching cash data:', error);
      }
    };

    if (isLoggedIn === true) {
      fetchCashData(); // Call the fetch function
      // ... existing code for fetching products and banks ...
    }

    // ... existing code ...
  }, [isLoggedIn, isError, message]);

  
  return (
    <div>
      <ProductSummary products={products}  bank={bank} cashs={cash} />
      <ProductList products={products} isLoading={isLoading} />
    </div>
  );
};

export default Dashboard;
