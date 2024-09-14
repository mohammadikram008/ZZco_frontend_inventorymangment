import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SupplierList from "./SupplierList";
import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSuppliers, createSupplier, reset } from "../../redux/features/supplier/supplierSlice";

const Supplier = () => {
  const dispatch = useDispatch();
  const { suppliers, isLoading, isError, message } = useSelector((state) => state.supplier);

  const [openModal, setOpenModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "phone":
        setPhone(value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(getSuppliers());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleSubmit = () => {
    const supplierData = {
      username,
      email,
      password,
      phone,
    };
    dispatch(createSupplier(supplierData));
    handleCloseModal();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if (isError) {
  //   return <div>Error: {message}</div>;
  // }

  return (
    <Box sx={{ m: 0, p: 3, width: "100%" }}>
      <Grid container justifyContent={"flex-end"}>
        <Button 
          variant="outlined" 
          sx={{ borderColor: "dark", color: "dark" }}
          onClick={handleOpenModal}
        >
          Add Supplier
        </Button>
      </Grid>
      {/* <SupplierList suppliers={suppliers} /> */}
      
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ 
          width: 400, 
          p: 3, 
          mx: "auto", 
          mt: 5, 
          bgcolor: "background.paper", 
          boxShadow: 24, 
          borderRadius: 1 
        }}>
          <Typography variant="h6" id="modal-title">Add Supplier</Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={username}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            name="phone"
            value={phone}
            onChange={handleInputChange}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Modal>
      <ToastContainer />
    </Box>
  );
};

export default Supplier;