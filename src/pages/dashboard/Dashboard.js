import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductList from "../../components/product/productList/ProductList";
import ProductSummary from "../../components/product/productSummary/ProductSummary";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { selectIsLoggedIn } from "../../redux/features/auth/authSlice";
import { getProducts } from "../../redux/features/product/productSlice";
import { getBanks, selectBanks, selectIsLoading } from "../../redux/features/Bank/bankSlice";  // Import selectors and actions

const Dashboard = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { products, isLoading: isLoading, isError, message } = useSelector((state) => state.product);
  const banks = useSelector(selectBanks);
  const banksLoading = useSelector(selectIsLoading);

console.log("banks",banks);
console.log("banksLoading",banksLoading);

  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getProducts());
      dispatch(getBanks());
    }

    if (isError) {
      console.log(message);
    }
  }, [isLoggedIn, isError, message, dispatch]);

  return (
    <div>
      <ProductSummary products={products} />
      <ProductList products={products} isLoading={isLoading} />
    </div>
  );
};

export default Dashboard;
