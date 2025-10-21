"use client";
import { useCartStore } from "@/app/store/cart/cart";
import { imgUrl } from "@/config/config";
import { mainColor } from "@/theme/main";
import axiosRequest from "@/utils/axiosRequest";
import {
  Add as AddIcon,
  ArrowBack,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
  ShoppingBag,
} from "@mui/icons-material";
import {
  Alert,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Cart = () => {
  const {
    productsFromCart,
    getProductsFromCart,
    removeProductFromCart,
    increaseProductInCart,
    decreaseProductInCart,
    clearCart,
  } = useCartStore();

  const [loading, setLoading] = useState(true);

  const [checkoutDialog, setCheckoutDialog] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Telegram bot configuration
  const TELEGRAM_BOT_TOKEN = "8201434964:AAHlNtR9CZCi0jbKIf_Ds1L7b-NTMUdYR8A";
  const TELEGRAM_CHAT_ID = "-1003146801591";

  const getProfile = async () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.log("Token not found!");
        return;
      }

      try {
        const decoded = jwtDecode(token);

        if (!decoded?.sid) {
          console.log("User ID not found in token");
          return;
        }

        setLoading(true);
        const { data } = await axiosRequest.get(
          `UserProfile/get-user-profile-by-id?id=${decoded.sid}`
        );

        if (data.data) {
          setUserInfo({
            name:
              data.userName || data.data.fullName || data.data.userName || "",
            phone: data.data.phone || data.data.phoneNumber || "",
            address: data.data.address || data.data.deliveryAddress || "",
          });
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("Token decoding error:", error);
      }
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      await getProductsFromCart();
      setLoading(false);
    };

    fetchCart();
  }, [getProductsFromCart]);

  const handleRemoveItem = async (id) => {
    await removeProductFromCart(id);
  };

  const handleIncreaseQuantity = async (id) => {
    await increaseProductInCart(id);
  };

  const handleDecreaseQuantity = async (id, currentQty) => {
    if (currentQty <= 1) {
      await removeProductFromCart(id);
    } else {
      await decreaseProductInCart(id);
    }
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  // Function to send order to Telegram
  const sendOrderToTelegram = async () => {
    // Validate required user info
    if (!userInfo.name || !userInfo.phone) {
      setNotification({
        open: true,
        message: "Please fill in your name and phone number in your profile",
        severity: "error",
      });
      return;
    }

    try {
      const orderDetails = generateOrderMessage();

      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: orderDetails,
            parse_mode: "HTML",
          }),
        }
      );

      const result = await response.json();

      if (result.ok) {
        setNotification({
          open: true,
          message: "Order successfully sent! We will contact you soon.",
          severity: "success",
        });
        setCheckoutDialog(false);
        await clearCart();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending to Telegram:", error);
      setNotification({
        open: true,
        message: "Error sending order. Please try again.",
        severity: "error",
      });
    }
  };

  // Generate formatted order message for Telegram
  const generateOrderMessage = () => {
    let message = `🛍️ <b>NEW ORDER</b>\n\n`;
    message += `👤 <b>Client:</b> ${userInfo.name}\n`;
    message += `📞 <b>Phone:</b> ${userInfo.phone}\n`;

    if (userInfo.address) {
      message += `🏠 <b>Address:</b> ${userInfo.address}\n`;
    }

    message += `\n📦 <b>Products:</b>\n`;

    productsFromCart?.productsInCart?.forEach((item, index) => {
      message += `\n${index + 1}. ${item.product.productName}\n`;
      message += `   • Brand: ${item.product.brand || "Not specified"}\n`;
      message += `   • Quantity: ${item.quantity}\n`;
    });

    message += `\n⏰ <b>Order time:</b> ${new Date().toLocaleString()}`;

    return message;
  };

  const handleCheckout = () => {
    // Check if we have required user info
    if (!userInfo.name || !userInfo.phone) {
      setNotification({
        open: true,
        message:
          "Please update your profile with name and phone number before placing an order",
        severity: "warning",
      });
      return;
    }
    setCheckoutDialog(true);
  };

  const handleCloseDialog = () => {
    setCheckoutDialog(false);
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Check if user info is complete
  const isUserInfoComplete = userInfo.name && userInfo.phone;

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5, minHeight: "100vh" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              background: `linear-gradient(45deg, ${mainColor} 30%, ${mainColor} 90%)`,
              backgroundClip: "text",
              textFillColor: "transparent",
            }}
          >
            Your Cart
          </Typography>

          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBack />}
            variant="text"
            sx={{
              borderRadius: 10,
              fontWeight: 500,
              px: 2,
              border: "1px solid #e0e0e0",
              "&:hover": {
                backgroundColor: "#f9f9f9",
              },
            }}
          >
            Back to Store
          </Button>
        </Box>
      </motion.div>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress sx={{ color: mainColor }} />
        </Box>
      ) : !productsFromCart?.productsInCart?.length ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: "24px",
              background: "linear-gradient(180deg, #ffffff 0%, #f8f6ff 100%)",
              boxShadow: "0px 10px 30px rgba(93, 63, 211, 0.1)",
            }}
          >
            <ShoppingBag
              sx={{ fontSize: 80, color: mainColor, opacity: 0.6, mb: 2 }}
            />
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Your cart is empty
            </Typography>
            <Typography color="text.secondary" mb={4}>
              It looks like you haven't added any products yet
            </Typography>
            <Button
              component={Link}
              href="/"
              variant="contained"
              size="large"
              sx={{
                borderRadius: "50px",
                px: 4,
                py: 1.5,
                background: `linear-gradient(45deg, ${mainColor} 30%, ${mainColor} 90%)`,
                boxShadow: "0px 4px 20px rgba(93, 63, 211, 0.25)",
              }}
            >
              Find Products
            </Button>
          </Paper>
        </motion.div>
      ) : (
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Paper
                sx={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  mb: { xs: 4, md: 0 },
                  background: "white",
                  boxShadow: "0px 10px 30px rgba(93, 63, 211, 0.1)",
                }}
              >
                {/* Cart Header */}
                <Box
                  sx={{
                    p: 3,
                    background: `linear-gradient(45deg, ${mainColor} 30%, ${mainColor} 90%)`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" color="white" fontWeight="medium">
                    <Badge
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "white",
                          color: mainColor,
                          fontWeight: "bold",
                        },
                      }}
                    >
                      <Box
                        component="span"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <ShoppingBag sx={{ mr: 1 }} /> Cart
                      </Box>
                    </Badge>
                  </Typography>

                  <Button
                    startIcon={<DeleteIcon />}
                    variant="outlined"
                    onClick={handleClearCart}
                    sx={{
                      borderRadius: 10,
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        borderColor: "white",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    Clear All
                  </Button>
                </Box>

                {/* Cart Items */}
                <Box sx={{ p: 2, maxHeight: "460px", overflow: "auto" }}>
                  <AnimatePresence>
                    {productsFromCart?.productsInCart?.map((item) => (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        exit="exit"
                        layout
                      >
                        <Paper
                          sx={{
                            height: "120px",
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            boxShadow: "0px 4px 12px rgba(93, 63, 211, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: "0px 8px 24px rgba(93, 63, 211, 0.2)",
                              borderColor: mainColor,
                            },
                            mb: "20px",
                          }}
                        >
                          {/* Product Image */}
                          <Box
                            sx={{
                              width: "80px",
                              height: "80px",
                              borderRadius: "8px",
                              overflow: "hidden",
                              flexShrink: 0,
                              mr: 2,
                              position: "relative",
                              border: "1px solid rgba(93, 63, 211, 0.1)",
                              "&:hover": {
                                borderColor: mainColor,
                              },
                            }}
                          >
                            <Image
                              src={imgUrl + item.product.image}
                              fill
                              style={{ objectFit: "cover" }}
                              alt={item.product.productName}
                            />
                          </Box>

                          {/* Product Info */}
                          <Box
                            sx={{
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              overflow: "hidden",
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              noWrap
                              sx={{
                                mb: 0.5,
                                background: `linear-gradient(45deg, ${mainColor} 30%, ${mainColor} 90%)`,
                                backgroundClip: "text",
                                textFillColor: "transparent",
                              }}
                            >
                              {item.product.productName}
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Chip
                                size="small"
                                label={item.product.categoryName}
                                sx={{
                                  backgroundColor: item.product.color,
                                  color: mainColor,
                                  fontWeight: "medium",
                                  px: "5px",
                                }}
                              />
                            </Box>
                          </Box>

                          {/*  Remove Button */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                              justifyContent: "center",
                              ml: 2,
                            }}
                          >
                            {/* Quantity Controls */}
                            <Grid sx={{ mr: "30px" }} item xs={6} sm={2}>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: 10,
                                    border: "1px solid #e0e0e0",
                                    overflow: "hidden",
                                    mb: 1,
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleDecreaseQuantity(
                                        item.id,
                                        item.quantity
                                      )
                                    }
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </IconButton>

                                  <Typography
                                    sx={{
                                      px: 2,
                                      fontWeight: "bold",
                                      color: mainColor,
                                    }}
                                  >
                                    {item.quantity}
                                  </Typography>

                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleIncreaseQuantity(item.id)
                                    }
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Grid>
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveItem(item.id)}
                              sx={{
                                color: "#ff3d71",
                                "&:hover": {
                                  backgroundColor: "rgba(255, 61, 113, 0.1)",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Paper>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: "24px",
                  background: "white",
                  boxShadow: "0px 10px 30px rgba(93, 63, 211, 0.1)",
                  position: "sticky",
                  top: 20,
                }}
              >
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Order Summary
                </Typography>

                {/* User Info Preview */}
                <Box
                  sx={{
                    mb: 2,
                    p: 2,
                    backgroundColor: "grey.50",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                    Data to complete:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: userInfo.name ? "text.primary" : "error.main",
                    }}
                  >
                    <strong>Name:</strong> {userInfo.name || "Not specified"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: userInfo.phone ? "text.primary" : "error.main",
                    }}
                  >
                    <strong>Phone:</strong> {userInfo.phone || "Not specified"}
                  </Typography>

                  {!isUserInfoComplete && (
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1 }}
                      component={Link}
                      href="/profile" // Adjust this route to your profile page
                    >
                      Update Profile
                    </Button>
                  )}
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleCheckout}
                  disabled={!isUserInfoComplete}
                  sx={{
                    borderRadius: "50px",
                    py: 1.5,
                    background: `linear-gradient(45deg, ${mainColor} 30%, ${mainColor} 90%)`,
                    boxShadow: "0px 4px 20px rgba(93, 63, 211, 0.25)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0px 6px 25px rgba(93, 63, 211, 0.35)",
                    },
                    "&:disabled": {
                      background: "grey.400",
                      transform: "none",
                      boxShadow: "none",
                    },
                  }}
                >
                  {isUserInfoComplete ? "Place Order" : "Fill Profile"}
                </Button>

                {!isUserInfoComplete && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ mt: 1, textAlign: "center", color: "text.primary" }}
                  >
                    Fill in name and phone in profile to place order
                  </Typography>
                )}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      )}

      {/* Checkout Confirmation Dialog */}
      <Dialog
        open={checkoutDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Order Confirmation
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "text.primary" }} variant="body1" mb={2}>
            Are you sure you want to place this order?
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{ color: "text.primary" }}
              variant="subtitle2"
              fontWeight="bold"
              mb={1}
            >
              Data to complete:
            </Typography>
            <Typography sx={{ color: "text.primary" }} variant="body2">
              <strong>Name:</strong> {userInfo.name}
            </Typography>
            <Typography sx={{ color: "text.primary" }} variant="body2">
              <strong>Phone:</strong> {userInfo.phone}
            </Typography>
            {userInfo.address && (
              <Typography sx={{ color: "text.primary" }} variant="body2">
                <strong>Address:</strong> {userInfo.address}
              </Typography>
            )}
          </Box>

          <Box
            sx={{ mt: 2, p: 2, backgroundColor: "grey.50", borderRadius: 1 }}
          >
            <Typography variant="body2" color="text.secondary">
              After confirmation, the order will be sent to Telegram and we will
              contact you to clarify details
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={sendOrderToTelegram}
            sx={{
              background: `linear-gradient(45deg, ${mainColor} 30%, ${mainColor} 90%)`,
            }}
          >
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart;
