"use client";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Snackbar,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import HeroCarousel from "./components/ui/home/hero-carousel";
import ProductsGrid from "./components/ui/home/products-grid";
import ServicesSection from "./components/ui/home/services-section";

// Optimized components
// Store hooks (assuming these exist)
import { useCartStore } from "@/app/store/cart/cart";
import { imgUrl } from "@/config/config";
import { mainColor } from "@/theme/main";
import { useHomeStore } from "./store/home/useHomeStore";

const Home = () => {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  // store hooks
  const { products, getProducts, setPageSize, setProducts } = useHomeStore();
  const { addProductToCart } = useCartStore();

  // Memoized data
  const promos = useMemo(
    () => [
      {
        id: 1,
        title: "New laptops 2025",
        subtitle: "The most powerful and stylish laptops for work and gaming",
        image:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80",
        cta: "Buy now",
        color: "#ff6b6b",
      },
      {
        id: 2,
        title: "Next generation smartphones",
        subtitle: "Update your devices to the latest models",
        image:
          "https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=1600&q=80",
        cta: "View",
        color: "#4dabf7",
      },

      {
        id: 4,
        title: "Gaming devices",
        subtitle: "Gaming laptops, accessories and peripherals",
        image: "/gamer-work-space-concept-top-260nw-2553721483.jpg",
        cta: "Buy now",
        color: "#f783ac",
      },
    ],

    []
  );

  const handleLoadMore = async () => {
    setLoadingMore(true);
    setPageSize();
    await getProducts();
    setLoadingMore(false);
  };
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
    setNotification({
      open: true,
      message: "Product added to cart",
      type: "success",
    });
  }

  const handlePrevPromo = useCallback(() => {
    setCurrentPromoIndex((prevIndex) =>
      prevIndex === 0 ? promos.length - 1 : prevIndex - 1
    );
  }, [promos.length]);

  const handleNextPromo = useCallback(() => {
    setCurrentPromoIndex((prevIndex) => (prevIndex + 1) % promos.length);
  }, [promos.length]);

  const handlePromoSelect = useCallback((index: number) => {
    setCurrentPromoIndex(index);
  }, []);

  const handleCloseNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  useEffect(() => {
    setIsLoading(true);
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
  }, [getProducts, promos.length]);

  return (
    <Box
      sx={{
        bgcolor: "#f8f9fa",
        minHeight: "100vh",
        pb: 8,
      }}
    >
      {/* Header with Category Tabs */}
      {/* <CategoryTabs
        categories={categories}
        currentTab={currentTab}
        onTabChange={handleTabChange}
        mainColor={mainColor}
      /> */}

      <Container sx={{ mt: 3 }}>
        {/* Hero Promo Section */}
        <HeroCarousel
          promos={promos}
          currentPromoIndex={currentPromoIndex}
          onPrevPromo={handlePrevPromo}
          onNextPromo={handleNextPromo}
          onPromoSelect={handlePromoSelect}
          mainColor={mainColor}
        />

        {/* Services Section */}
        <ServicesSection mainColor={mainColor} />

        {/* Products Grid */}
        <ProductsGrid
          products={products}
          isLoading={isLoading}
          imgUrl={imgUrl}
          mainColor={mainColor}
          onAddToCart={handleAddToCart}
        />

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
            {loadingMore ? "Loading..." : "Show more"}
          </Button>
        </Box>
      </Container>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleCloseNotification} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
