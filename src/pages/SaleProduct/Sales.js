import React, { useState, useEffect } from "react";
import AddSale from "../../components/SaleProduct/AddSale";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/features/product/productSlice";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { selectIsLoggedIn } from "../../redux/features/auth/authSlice";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container
} from "@mui/material";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [customer, setAllCustomer] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API_URL = `${BACKEND_URL}/api`;

  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { products, isLoading, isError, message } = useSelector(
    (state) => state.product
  );

  console.log("productsproducts", products);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getProducts());
    }

    if (isError) {
      console.log(message);
    }
  }, [isLoggedIn, isError, message, dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSalesData();
      fetchCustomerData();
    }
  }, [isLoggedIn, updatePage]);

  // Fetching Data of All Sales
  const fetchCustomerData = () => {
    fetch(`${API_URL}/customers/allcustomer`, {
      credentials: "include", // Include credentials to send cookies
    })
      .then((response) => response.json())
      .then((data) => {
        setAllCustomer(data);
      })
      .catch((err) => console.log(err));
  };

  const fetchSalesData = () => {
    fetch(`${API_URL}/sales/allsales`, {
      credentials: "include", // Include credentials to send cookies
    })
      .then((response) => response.json())
      .then((data) => {
        setAllSalesData(data);
      })
      .catch((err) => console.log(err));
  };

  const addSaleModalSetting = () => {
    setShowSaleModal(!showSaleModal);
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  console.log("sales", sales);

  return (
    <Container>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Sales
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={addSaleModalSetting}
            sx={{ mb: 2 }}
          >
            Add Sale
          </Button>

          {showSaleModal && (
            <AddSale
              addSaleModalSetting={addSaleModalSetting}
              products={products}
              stores={customer}
              handlePageUpdate={handlePageUpdate}
            />
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Product Sold</TableCell>
                  <TableCell>Sales Date</TableCell>
                  <TableCell>Total Sale Amount(Rs)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.map((element) => (
                  <TableRow key={element._id}>
                    <TableCell>{element.productID}</TableCell>
                    <TableCell>{element.customerID}</TableCell>
                    <TableCell>{element.stockSold}</TableCell>
                    <TableCell>{element.saleDate}</TableCell>
                    <TableCell>{element.totalSaleAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Sales;
