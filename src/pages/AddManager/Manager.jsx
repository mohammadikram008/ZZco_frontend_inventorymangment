import React, { useEffect, useState } from "react";
import ManagerList from "./ManagerList";
import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Customer = () => {
  const [openModal, setOpenModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [customers, setCustomers] = useState([]);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/manager/allmanager");
      setCustomers(response.data);
      console.log("response", response);
    } catch (error) {
      console.error("There was an error fetching the customer data!", error);
    }
  };
  useEffect(() => {


    fetchCustomers();
  }, []);
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

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/manager/managerRegister", {
        username,
        email,
        password,
        phone,
      }, { withCredentials: true });

      if (res) {
        toast.success("Customer Add Successfully!")
      }
      handleCloseModal();
      fetchCustomers();
    } catch (error) {
      console.error("There was an error creating the customer!", error);
    }
  };

  return (
    <Box sx={{ m: 0, p: 3, width: "100%" }}>
      <Grid container justifyContent={"flex-end"}>
        <Button 
          variant="outlined" 
          sx={{ borderColor: "dark", color: "dark" }}
          onClick={handleOpenModal}
        >
          Add Manager
        </Button>
      </Grid>
      <ManagerList customers={customers}/>
      
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
          <Typography variant="h6" id="modal-title">Add Customer</Typography>
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

export default Customer;
