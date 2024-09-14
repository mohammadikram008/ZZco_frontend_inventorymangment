import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser";
import { selectIsLoggedIn } from "../../../redux/features/auth/authSlice";
import { getProduct } from "../../../redux/features/product/productSlice";
import DOMPurify from "dompurify";
import { 
  Card, CardContent, CardMedia, Typography, Grid, Chip, Box, 
  Divider, Container, Paper, Tabs, Tab, Button, IconButton, Tooltip
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { SpinnerImg } from "../../loader/Loader";
import InfoIcon from '@mui/icons-material/Info';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DescriptionIcon from '@mui/icons-material/Description';
import InventoryIcon from '@mui/icons-material/Inventory';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 1200,
  margin: "auto",
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  height: 400,
  [theme.breakpoints.down("md")]: {
    height: 300,
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: "100%",
  objectFit: "cover",
}));

const OverlayBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  color: theme.palette.common.white,
  padding: theme.spacing(2),
}));

const ProductDetail = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const { id } = useParams();
  const [tabValue, setTabValue] = useState(0);

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { product, isLoading, isError, message } = useSelector(
    (state) => state.product
  );

  const stockStatus = (quantity) => {
    if (quantity > 0) {
      return <Chip label="In Stock" color="success" size="small" />;
    }
    return <Chip label="Out Of Stock" color="error" size="small" />;
  };

  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getProduct(id));
    }

    if (isError) {
      console.log(message);
    }
  }, [isLoggedIn, isError, message, dispatch, id]);

  if (isLoading) {
    return <SpinnerImg />;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1" align="center" sx={{ mb: 4 }}>
        Product Detail
      </Typography>
      {product && (
        <StyledCard>
          <Grid container>
            <Grid item xs={12} md={6}>
              <ImageWrapper>
                <StyledCardMedia
                  component="img"
                  image={product?.image ? `${process.env.REACT_APP_BACKEND_URL}/${product.image.filePath}` : 'path/to/fallback/image.jpg'}
                  alt={product.name}
                />
                <OverlayBox>
                  <Typography variant="h5" gutterBottom>Product Name : {product.name}</Typography>
                  {/* <Typography variant="subtitle1">SKU: {product.sku}</Typography> */}
                </OverlayBox>
              </ImageWrapper>
            </Grid>
            <Grid item xs={12} md={6}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="product details tabs">
                    <Tab icon={<InfoIcon />} label="Details" />
                    <Tab icon={<DescriptionIcon />} label="Description" />
                    <Tab icon={<LocalShippingIcon />} label="Shipping" />
                  </Tabs>
                </Box>
                {tabValue === 0 && (
                  <Box>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Price : {product.price}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {stockStatus(product.quantity)}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({product.quantity} available)
                      </Typography>
                    </Box>
                    <Typography variant="body1" paragraph>
                      Category: {product.category}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Store Name : {product.warehouseName}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Total Value: {product.price * product.quantity}
                    </Typography>
                  </Box>
                )}
                {tabValue === 1 && (
                  <Typography variant="body2" 
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(product.description),
                    }}
                  />
                )}
                {tabValue === 2 && (
                  <Typography variant="body2">
                    Shipping information not available.
                  </Typography>
                )}
                <Box sx={{ mt: 'auto' }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="caption" display="block" gutterBottom>
                    Created: {new Date(product.createdAt).toLocaleString("en-US")}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    Updated: {new Date(product.updatedAt).toLocaleString("en-US")}
                  </Typography>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </StyledCard>
      )}
    </Container>
  );
};

export default ProductDetail;