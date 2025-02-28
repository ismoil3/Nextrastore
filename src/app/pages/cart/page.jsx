"use client";
import { useCartStore } from "@/app/store/cart/cart";
import { imgUrl } from "@/config/config";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  IconButton,
  Button,
  Badge,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowBack,
  ShoppingBag,
} from "@mui/icons-material";
import { mainColor } from "@/theme/main";

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

  const getTotalWithDelivery = () => {
    return (productsFromCart?.totalPrice || 0).toFixed(2);
  };

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
            Ваша Корзина
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
            Вернуться в Магазин
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
              Ваша корзина пуста
            </Typography>
            <Typography color="text.secondary" mb={4}>
              Похоже, вы еще не добавили товары
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
              Найти Товары
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
                        <ShoppingBag sx={{ mr: 1 }} /> Корзина
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
                    Очистить Все
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
                                label={item.product.brand || "Бренд"}
                                sx={{
                                  backgroundColor: "rgba(93, 63, 211, 0.1)",
                                  color: mainColor,
                                  fontWeight: "medium",
                                }}
                              />
                              <Chip
                                size="small"
                                label={item.product.categoryName}
                                sx={{
                                  backgroundColor: item.product.color,
                                  color: mainColor,
                                  fontWeight: "medium",
                                  px:"5px"
                                }}
                              />
                            </Box>
                          </Box>

                          {/* Price and Remove Button */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                              justifyContent: "center",
                              ml: 2,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              sx={{
                                background: `linear-gradient(45deg, ${mainColor} 30%, ${mainColor} 90%)`,
                                backgroundClip: "text",
                                textFillColor: "transparent",
                              }}
                            >
                              ${item.product.price}
                            </Typography>

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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Paper
                sx={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  position: { md: "sticky" },
                  top: { md: 20 },
                  background: "white",
                  boxShadow: "0px 10px 30px rgba(93, 63, 211, 0.1)",
                }}
              >
                {/* Summary Header */}
                <Box
                  sx={{
                    p: 3,
                    background: `linear-gradient(45deg, ${mainColor} 30%, ${mainColor} 90%)`,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" color="white">
                    Итог Заказа
                  </Typography>
                </Box>

                {/* Summary Content */}
                <Box sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      Промежуточный итог ({productsFromCart?.totalProducts}{" "}
                      товаров)
                    </Typography>
                    <Typography
                      variant="body1"
                      color="black"
                      fontWeight="medium"
                    >
                      ${productsFromCart?.totalPrice}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      Скидка
                    </Typography>
                    <Typography
                      variant="body1"
                      color="#00a870"
                      fontWeight="medium"
                    >
                      -$
                      {(
                        productsFromCart?.totalDiscountPrice -
                        productsFromCart?.totalPrice
                      ).toFixed(2)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      Итого
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        background: `linear-gradient(45deg, ${mainColor} 30%, ${mainColor} 90%)`,
                        backgroundClip: "text",
                        textFillColor: "transparent",
                      }}
                    >
                      ${getTotalWithDelivery()}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      borderRadius: "50px",
                      py: 1.5,
                      background: `linear-gradient(45deg, ${mainColor} 30%, ${mainColor} 90%)`,
                      boxShadow: "0px 4px 20px rgba(93, 63, 211, 0.25)",
                    }}
                  >
                    Перейти к Оплате
                  </Button>

                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: "#f8f6ff",
                      border: "1px dashed #d1c4ff",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      Продолжая, вы соглашаетесь с нашими Условиями обслуживания
                      и Политикой конфиденциальности
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;