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

const ProductSummary = ({ products }) => {
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
    return cash.totalBalance || 0;
  }, [cash]);

  const totalBankAmount = useMemo(() => {
    return Array.isArray(banks) ? banks.reduce((total, bank) => total + (bank.balance || 0), 0) : 0;
  }, [banks]);
  

  const fetchCashAndBanks = async () => {
    try {
      const [cashResponse, bankResponse] = await Promise.all([
        axios.get("https://zzcoinventorymanagmentbackend.up.railway.app"),
        axios.get("https://zzcoinventorymanagmentbackend.up.railway.app"),
      ]);
  
      setCash(Array.isArray(cashResponse.data) ? cashResponse.data : []);
      setBanks(Array.isArray(bankResponse.data) ? bankResponse.data : []);
      console.log("Fetched cash:", cashResponse.data);
      console.log("Fetched banks:", bankResponse.data);
    } catch (error) {
      console.error("There was an error fetching the cash or bank data!", error);
    }
  };
  

  useEffect(() => {
    fetchCashAndBanks();
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
              count={`${formatNumbers(totalBankAmount.toFixed(2))}`}
              bgColor="card1"
            />
            <InfoBox
              icon={cashIcon}
              title={"Cash"}
              count={`${formatNumbers(totalCashAmount.toFixed(2))}`}
              bgColor="card4"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductSummary;
