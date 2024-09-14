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
  Container,
  TablePagination

} from "@mui/material";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [customer, setAllCustomer] = useState([]);
  const [banks, setBanks] = useState([]); // State to store bank data
  const [updatePage, setUpdatePage] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API_URL = `${BACKEND_URL}/api`;

  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { products, isLoading, isError, message } = useSelector(
    (state) => state.product
  );

  console.log("products:", products);

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
      fetchBankData(); // Fetch bank data on page load
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

  const fetchBankData = () => {
    fetch(`${API_URL}/banks/allbanks`, {
      credentials: "include", // Include credentials to send cookies
    })
      .then((response) => response.json())
      .then((data) => {
        setBanks(data);
      })
      .catch((err) => console.log(err));
  };

  const addSaleModalSetting = () => {
    setShowSaleModal(!showSaleModal);
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  console.log("sales:", sales);

  // Helper function to get product name by ID
  const getProductName = (id) => {
    const product = products.find((product) => product._id === id);
    return product ? product.name : "Unknown Product";
  };

  // Helper function to get customer name by ID
  const getCustomerName = (id) => {
    const cust = customer.find((cust) => cust._id === id);
    return cust ? cust.username : "Unknown Customer";
  };

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
              banks={banks} // Pass bank data to AddSale component
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
                  <TableCell>Total Sale Amount (Rs)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((element) => (
                  <TableRow key={element._id}>
                    <TableCell>{getProductName(element.productID)}</TableCell>
                    <TableCell>{getCustomerName(element.customerID)}</TableCell>
                    <TableCell>{element.stockSold}</TableCell>
                    <TableCell>{new Date(element.saleDate).toLocaleDateString()}</TableCell>
                    <TableCell>{element.totalSaleAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sales.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Container>
  );
}

export default Sales;
