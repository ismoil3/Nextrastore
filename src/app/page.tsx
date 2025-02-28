"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHomeStore } from "./store/home/useHomeStore";
import { useCartStore } from "@/app/store/cart/cart";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { imgUrl } from "@/config/config";

// Custom components
import {
  Box,
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  IconButton,
  Drawer,
  Grid,
  Chip,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";

// Icons

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StarIcon from "@mui/icons-material/Star";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { mainColor } from "@/theme/main";

const Home = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { products, getProducts, setPageSize, setProducts } = useHomeStore();
  const { addProductToCart } = useCartStore();

  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  // Promos data
  const promos = [
    {
      id: 1,
      title: "Summer Collection 2025",
      subtitle: "Discover fresh trends for the season",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1488&q=80",
      cta: "Shop Now",
      color: "#ff6b6b",
    },
    {
      id: 2,
      title: "Tech Essentials",
      subtitle: "Upgrade your devices with the latest tech",
      image:
        "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
      cta: "Explore Tech",
      color: "#4dabf7",
    },
    {
      id: 3,
      title: "Special Deals",
      subtitle: "Limited time offers on select products",
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      cta: "View Deals",
      color: "#51cf66",
    },
  ];

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      await getProducts();
      setIsLoading(false);
    };
    fetchProducts();

    // Auto-rotate promos
    const timer = setInterval(() => {
      setCurrentPromoIndex((prevIndex) => (prevIndex + 1) % promos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [getProducts]);

  // Tabs categories
  const categories = [
    "Recommended",
    "New Arrivals",
    "Best Sellers",
    "Special Offers",
    "Trending",
  ];

  // Handle tab change
  const handleTabChange = (newValue: number) => {
    setCurrentTab(newValue);
    // In a real app, this would fetch different products based on the category
  };

  // Handle load more
  const handleLoadMore = async () => {
    setLoadingMore(true);
    setPageSize();
    await getProducts();
    setLoadingMore(false);
  };

  // Handle add to cart
  function handleAddToCart(id: string | null | number) {
    addProductToCart(id);
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          product.productInMyCart = !product.productInMyCart;
        }
        return product;
      })
    );
    setNotification({ open: true, message: "Product added to cart", type: "success" });
  }

  // Navigation to previous promo
  const prevPromo = () => {
    setCurrentPromoIndex((prevIndex) =>
      prevIndex === 0 ? promos.length - 1 : prevIndex - 1
    );
  };

  // Navigation to next promo
  const nextPromo = () => {
    setCurrentPromoIndex((prevIndex) => (prevIndex + 1) % promos.length);
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Grid card variants for animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box
      sx={{
        bgcolor: "#f8f9fa",
        minHeight: "100vh",
        pb: 8,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#ffffff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 99,
        }}
      >
        {/* Categories tabs */}
        <Box sx={{ borderTop: "1px solid #eeeeee" }}>
          <Container>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Tabs
                value={currentTab}
                onChange={(e, i) => handleTabChange(i)}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
                sx={{
                  "& .MuiTab-root": {
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    fontWeight: 500,
                    color: "#666",
                    py: 1.5,
                    textTransform: "none",
                    minWidth: { xs: "auto", sm: 120 },
                  },
                  "& .Mui-selected": {
                    color: `${mainColor} !important`,
                    fontWeight: 600,
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: mainColor,
                    height: 3,
                  },
                }}
              >
                {categories.map((category, index) => (
                  <Tab key={index} label={category} />
                ))}
              </Tabs>
            </Box>
          </Container>
        </Box>
      </Box>
      <Container sx={{ mt: 3 }}>
        {/* Hero Promo Section */}
        <Box sx={{ mb: 4, position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPromoIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ position: "relative" }}
            >
              <Box
                sx={{
                  height: { xs: "220px", sm: "300px", md: "400px" },
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${promos[currentPromoIndex].image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(0.85)",
                    zIndex: 1,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)`,
                    zIndex: 2,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    p: { xs: 3, md: 5 },
                    zIndex: 3,
                    width: { xs: "100%", md: "50%" },
                    color: "white",
                  }}
                >
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                      mb: 1,
                    }}
                  >
                    {promos[currentPromoIndex].title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 2,
                      opacity: 0.9,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    }}
                  >
                    {promos[currentPromoIndex].subtitle}
                  </Typography>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: promos[currentPromoIndex].color,
                      "&:hover": {
                        bgcolor: promos[currentPromoIndex].color,
                        filter: "brightness(0.9)",
                      },
                      textTransform: "none",
                      borderRadius: "50px",
                      px: 3,
                      py: { xs: 1, md: 1.5 },
                    }}
                  >
                    {promos[currentPromoIndex].cta}
                  </Button>
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>

          {/* Promo navigation buttons */}
          <Box
            sx={{ position: "absolute", bottom: "50%", left: 16, zIndex: 10 }}
          >
            <IconButton
              onClick={prevPromo}
              sx={{
                bgcolor: "rgba(255,255,255,0.7)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>
          <Box
            sx={{ position: "absolute", bottom: "50%", right: 16, zIndex: 10 }}
          >
            <IconButton
              onClick={nextPromo}
              sx={{
                bgcolor: "rgba(255,255,255,0.7)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>

          {/* Promo indicator dots */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
              gap: 1,
            }}
          >
            {promos.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentPromoIndex(index)}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: index === currentPromoIndex ? mainColor : "#dee2e6",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Services Section */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr 1fr",
            },
            gap: 2,
            mb: 5,
          }}
        >
          {[
            {
              icon: <LocalShippingIcon />,
              title: "Free Delivery",
              desc: "For all orders over 5000₽",
            },
            {
              icon: <StarIcon />,
              title: "Quality Promise",
              desc: "Verified quality products",
            },
            {
              icon: <ShoppingBagIcon />,
              title: "Easy Returns",
              desc: "30-day return policy",
            },
            {
              icon: <LocalOfferIcon />,
              title: "Special Offers",
              desc: "New deals every week",
            },
          ].map((service, idx) => (
            <Box
              key={idx}
              sx={{
                bgcolor: "#fff",
                p: 2,
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Box sx={{ color: mainColor, fontSize: "2rem" }}>
                {service.icon}
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6c757d" }}>
                  {service.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Section Title */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              position: "relative",
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: 0,
                width: 40,
                height: 4,
                bgcolor: mainColor,
                borderRadius: 2,
              },
            }}
          >
            {categories[currentTab]}
          </Typography>

          <Button
            endIcon={<ExpandMoreIcon />}
            sx={{
              textTransform: "none",
              color: mainColor,
              fontWeight: 500,
            }}
          >
            View All
          </Button>
        </Box>

        {/* Products Grid */}
        <AnimatePresence>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress sx={{ color: mainColor }} />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {products.map((product, index) => (
                <Grid item xs={6} sm={4} md={3} key={product.id}>
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#fff",
                        borderRadius: "16px",
                        overflow: "hidden",
                        transition: "all 0.3s",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                        "&:hover": {
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                          transform: "translateY(-5px)",
                        },
                        cursor: "pointer",
                        position: "relative",
                      }}
                      onClick={() =>
                        router.push("/pages/product/" + product.id)
                      }
                    >
                      {/* Product image with hover overlay */}
                      <Box
                        sx={{
                          position: "relative",
                          paddingTop: "100%",
                          bgcolor: "#f8f9fa",
                        }}
                      >
                        <Image
                          src={`${imgUrl}/${product.image}`}
                          alt={product.productName}
                          fill
                          style={{
                            objectFit: "contain",
                            padding: "10px",
                          }}
                        />
                        {/* Product badges */}
                        <Box sx={{ position: "absolute", top: 10, left: 10 }}>
                          {product.hasDiscount && (
                            <Chip
                              label={`${Math.round(
                                (1 - product.discountPrice / product.price) *
                                  100
                              )}% Off`}
                              size="small"
                              sx={{
                                bgcolor: "#ff6b6b",
                                color: "white",
                                fontWeight: 600,
                                fontSize: "0.7rem",
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      {/* Product info */}
                      <Box
                        sx={{
                          p: 2,
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              bgcolor: "#f1f3f5",
                              borderRadius: "100px",
                              px: 1,
                              py: 0.2,
                            }}
                          >
                            <StarIcon
                              sx={{ color: "#fcc419", fontSize: "0.8rem" }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ ml: 0.5, fontWeight: 500 }}
                            >
                              4.8 (26)
                            </Typography>
                          </Box>
                        </Box>

                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 400,
                            color: "#868e96",
                            fontSize: "0.75rem",
                            mb: 0.5,
                          }}
                        >
                          {product.categoryName || "Category"}
                        </Typography>

                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            height: "2.5rem",
                          }}
                        >
                          {product.productName}
                        </Typography>

                        <Box sx={{ mt: "auto", pt: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box>
                              {product.hasDiscount ? (
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 700,
                                      color: "#e03131",
                                      fontSize: { xs: "1rem", sm: "1.1rem" },
                                    }}
                                  >
                                    {product.discountPrice} ₽
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      ml: 1,
                                      textDecoration: "line-through",
                                      color: "#adb5bd",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {product.price} ₽
                                  </Typography>
                                </Box>
                              ) : (
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: "1rem", sm: "1.1rem" },
                                  }}
                                >
                                  {product.price} ₽
                                </Typography>
                              )}
                            </Box>

                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation(),
                                  handleAddToCart(product.id);
                              }}
                              sx={{
                                bgcolor: product.productInMyCart
                                  ? "#e9ecef"
                                  : mainColor,
                                color: product.productInMyCart
                                  ? "#adb5bd"
                                  : "white",
                                "&:hover": {
                                  bgcolor: product.productInMyCart
                                    ? "#e9ecef"
                                    : "#6741d9",
                                },
                                width: 36,
                                height: 36,
                              }}
                              disabled={product.productInMyCart}
                            >
                              {product.productInMyCart ? (
                                <RemoveIcon />
                              ) : (
                                <AddIcon />
                              )}
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </AnimatePresence>

        {/* Load More */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={loadingMore}
            sx={{
              borderColor: mainColor,
              color: mainColor,
              "&:hover": {
                borderColor: "#6741d9",
                bgcolor: "rgba(121, 80, 242, 0.05)",
              },
              textTransform: "none",
              borderRadius: "50px",
              px: 4,
              py: 1.2,
              fontWeight: 500,
            }}
            startIcon={
              loadingMore && <CircularProgress size={16} color="inherit" />
            }
          >
            {loadingMore ? "Loading..." : "Load More Products"}
          </Button>
        </Box>
      </Container>
      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
      >
        <Box sx={{ width: 280, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters
            </Typography>
            <IconButton onClick={() => setFilterOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Filter components would go here */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Price Range
          </Typography>
        </Box>
        <Divider />
      </Drawer>
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseNotification}
          // severity={notification.type}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
