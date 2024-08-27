import React, { useState, useEffect, useContext } from "react";
import AddSale from "../../components/SaleProduct/AddSale";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/features/product/productSlice";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { selectIsLoggedIn } from "../../redux/features/auth/authSlice";
// import AuthContext from "../../../AuthContext";
import { Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container } from "@mui/material";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [product, setAllProducts] = useState([]);
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
  console.log("productsproducts",products);
  
  // const authContext = useContext(AuthContext);
  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getProducts());
    }

    if (isError) {
      console.log(message);
    }
  }, [isLoggedIn, isError, message, dispatch]);
  useEffect(() => {
    fetchSalesData();
    fetchCustomerData();
    // fetchProductsData();
    // fetchStoresData();
  }, [updatePage]);

 // Fetching Data of All Sales
  const fetchCustomerData = () => {
    fetch(`${API_URL}/customers/allcustomer`)
      .then((response) => response.json())
      .then((data) => {
        setAllCustomer(data);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Data of All Sales
  const fetchSalesData = () => {
    fetch(`${API_URL}/sales/allsales`)
      .then((response) => response.json())
      .then((data) => {
        setAllSalesData(data);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Data of All Products
  // const fetchProductsData = () => {
  //   fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setAllProducts(data);
  //     })
  //     .catch((err) => console.log(err));
  // };

  // Fetching Data of All Stores
  // const fetchStoresData = () => {
  //   fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setAllStores(data);
  //     });
  // };

  // Modal for Sale Add
  const addSaleModalSetting = () => {
    setShowSaleModal(!showSaleModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };
console.log("sales",sales);

  return (
    <Container>
      <Card sx={{mt:3}}>
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
              // authContext={authContext}
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
