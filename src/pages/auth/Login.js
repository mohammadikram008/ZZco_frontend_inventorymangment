import React, { useState } from "react";
import styles from "./auth.module.scss";
import { BiLogIn } from "react-icons/bi";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button, TextField, Checkbox, FormControlLabel, Typography, Grid, Paper, MenuItem } from "@mui/material";

import { loginAdmin, loginCustomer, loginManager, loginUser, validateEmail } from "../../services/authService";
import { SET_LOGIN, SET_NAME, SET_USER } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import SignupImage from "../../assets/signup.jpg"; // Update paths as necessary
// import LogoImage from "../assets/logo.png";
const initialState = {
  email: "",
  password: "",
  role: "" // Default role
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const { email, password, role } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("All fields are required");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    const userData = { email, password };

    setIsLoading(true);
    try {
      let data;
      switch (role) {
        case 'Admin':
          data = await loginUser(userData);
          console.log("dTt", data);
          await dispatch(SET_LOGIN(true));
          await dispatch(SET_NAME(data.UserRole));
          // await dispatch(SET_USER(data.UserRole));
          navigate("/dashboard");
          setIsLoading(false);
          break;
        case 'Customer':
          data = await loginCustomer(userData);
          await dispatch(SET_LOGIN(true));
          console.log("Cdata", data);

          await dispatch(SET_NAME(data.UserRole));
          // await dispatch(SET_USER(data.UserRole));
          navigate("/");
          setIsLoading(false);
          break;
        case 'Manager':
          data = await loginManager(userData);
          console.log("Mdata", data);
          await dispatch(SET_LOGIN(true));
          await dispatch(SET_NAME(data.UserRole));
          // await dispatch(SET_USER(data.UserRole));
          navigate("/dashboard");
          setIsLoading(false);
          break;
        default:
          throw new Error("Invalid role selected");
      }


    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className={`container ${styles.auth}`}>
    //   {isLoading && <Loader />}
    //   <Card>
    //     <div className={styles.form}>
    //       <div className="--flex-center">
    //         <BiLogIn size={35} color="#999" />
    //       </div>
    //       <h2>Login</h2>

    //       <form onSubmit={login}>
    //         <input
    //           type="email"
    //           placeholder="Email"
    //           required
    //           name="email"
    //           value={email}
    //           onChange={handleInputChange}
    //         />
    //         <input
    //           type="password"
    //           placeholder="Password"
    //           required
    //           name="password"
    //           value={password}
    //           onChange={handleInputChange}
    //         />
    //         <div>
    //           <label htmlFor="role">Role:</label>
    //           <select name="role" value={role} onChange={handleRoleChange}>
    //             <option value="Admin">Admin</option>
    //             <option value="Customer">Customer</option>
    //             <option value="Manager">Manager</option>
    //           </select>
    //         </div>
    //         <button type="submit" className="--btn --btn-primary --btn-block">
    //           Login
    //         </button>
    //       </form>

    //       <Link to="/forgot">Forgot Password</Link>
    //       <span className={styles.register}>
    //         <Link to="/">Home</Link>
    //         <p> &nbsp; Don't have an account? &nbsp;</p>
    //         <Link to="/register">Register</Link>
    //       </span>
    //     </div>
    //   </Card>
    // </div>
    <Grid container component={Paper} sx={{ height: "100vh" }}>
      {isLoading && <Loader />}
      {/* <Grid item xs={false} sm={4} md={6} sx={{ backgroundImage: `url(${SignupImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} /> */}
      <Grid item xs={false} sm={4} md={6} display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <img src={SignupImage} style={{ width: "60rem" }} />
      </Grid>
      <Grid item xs={12} sm={8} md={6} display={"flex"} justifyContent={"center"} alignItems={"center"}  >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* <img src={LogoImage} alt="Your Company" style={{ height: '48px', marginBottom: '16px' }} /> */}
            <Typography variant="h5">Sign in to your Account</Typography>

          </div>
          <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
          <TextField
              select
              fullWidth
              labelId="role-select-label"
              id="role-select"
              name="role"
              value={role}
              sx={{mt:2}}
              onChange={handleRoleChange}
              label="Role"
            >
              <MenuItem value="Admin">Admin</MenuItem>
              {/* <MenuItem value="Customer">Customer</MenuItem> */}
              <MenuItem value="Manager">Manager</MenuItem>
            </TextField>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
            />
           
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <Link to="/forgot" >
              Forgot your password?
            </Link>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={loginUser}
              style={{ marginTop: '16px' }}
            >
              Sign In
            </Button>
          </div> */}
            {/* <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: '16px' }}>
            Or{" "}
            <Link to="/register" style={{ color: theme.palette.primary.main }}>
              Don't have an account? Register now
            </Link>
          </Typography> */}
              <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={loginUser}
              style={{ marginTop: '16px' }}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;
