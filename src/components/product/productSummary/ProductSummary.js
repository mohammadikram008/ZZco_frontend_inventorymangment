import React, { useEffect, useMemo, useState } from "react";
import "./ProductSummary.scss";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCart4, BsCartX, BsBank2 } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";
import { FaMoneyBillWave } from "react-icons/fa";

import InfoBox from "../../infoBox/InfoBox";
import { useDispatch, useSelector } from "react-redux";
import {
  CALC_CATEGORY,
  CALC_OUTOFSTOCK,
  CALC_STORE_VALUE,
  selectCategory,
  selectOutOfStock,
  selectTotalStoreValue,
} from "../../../redux/features/product/productSlice";
import axios from "axios";

// Icons
const earningIcon = <AiFillDollarCircle size={40} color="#fff" />;
const productIcon = <BsCart4 size={40} color="#fff" />;
const categoryIcon = <BiCategory size={40} color="#fff" />;
const outOfStockIcon = <BsCartX size={40} color="#fff" />;
const bankIcon = <BsBank2 size={40} color="#fff" />;
const cashIcon = <FaMoneyBillWave size={40} color="#fff" />;

// Format Amount
export const formatNumbers = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ProductSummary = ({ products, bank }) => {
  const dispatch = useDispatch();
  const totalStoreValue = useSelector(selectTotalStoreValue);
  const outOfStock = useSelector(selectOutOfStock);
  const category = useSelector(selectCategory);

  const isManager = useMemo(() => localStorage.getItem("userRole") === "Manager", []);

  useEffect(() => {
    dispatch(CALC_STORE_VALUE(products));
    dispatch(CALC_OUTOFSTOCK(products));
    dispatch(CALC_CATEGORY(products));
  }, [dispatch, products]);

  const [banks, setBanks] = useState([]);
  const [cash, setCash] = useState([]);
  const totalCashAmount = useMemo(() => {
    return cash.totalBalance;
  }, [cash]);
  const totalBankAmount = useMemo(() => {
    return bank.reduce((total, bank) => total + (bank.balance || 0), 0);
  }, [banks]);

  const fetchCash = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cash/all");
      setCash(response.data);
      console.log("Fetched cash:", response.data);
    } catch (error) {
      console.error("There was an error fetching the Cash data!", error);
    }
  };

  useEffect(() => {
    fetchCash();
  }, []);

  return (
    <div className="product-summary">
      <h3 className="--mt">Inventory Stats</h3>
      <div className="info-summary">
        <InfoBox
          icon={productIcon}
          title={"Total Products"}
          count={products.length} 
          bgColor="card1"
        />
        <InfoBox
          icon={outOfStockIcon}
          title={"Out of Stock"}
          count={outOfStock}
          bgColor="card3"
        />
        <InfoBox
          icon={categoryIcon}
          title={"All Categories"}
          count={category.length}
          bgColor="card4"
        />
        {!isManager && (
          <>
            <InfoBox
              icon={earningIcon}
              title={"Store Value"}
              count={`${formatNumbers(totalStoreValue.toFixed(2))}`}
              bgColor="card2"
            />
            <InfoBox
              icon={bankIcon}
              title={"Bank Amount"}
              count={totalBankAmount}
              bgColor="card1"
            />
            <InfoBox
              icon={cashIcon}
              title={"Cash"}
              count={totalCashAmount}
              bgColor="card4"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductSummary;
