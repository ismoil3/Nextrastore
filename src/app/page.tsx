"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Drawer,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HeroCarousel from "./components/ui/home/hero-carousel";
import ServicesSection from "./components/ui/home/services-section";
import ProductsGrid from "./components/ui/home/products-grid";


// Optimized components
// Store hooks (assuming these exist)
import { useHomeStore } from "./store/home/useHomeStore";
import { useCartStore } from "@/app/store/cart/cart";
import { imgUrl } from "@/config/config";
import { mainColor } from "@/theme/main";



const Home = () => {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
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
        title: "Летняя коллекция 2025",
        subtitle: "Откройте для себя свежие тренды сезона",
        image:
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1488&q=80",
        cta: "Купить сейчас",
        color: "#ff6b6b",
      },
      {
        id: 2,
        title: "Техника и гаджеты",
        subtitle: "Обновите свои устройства с новейшими технологиями",
        image:
          "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
        cta: "Исследовать",
        color: "#4dabf7",
      },
      {
        id: 3,
        title: "Специальные предложения",
        subtitle: "Ограниченные по времени предложения на избранные товары",
        image:
          "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        cta: "Посмотреть предложения",
        color: "#51cf66",
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
      message: "Товар добавлен в корзину",
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
    setIsLoading(true)
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
  }, [getProducts,promos.length]);

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
            {loadingMore ? "Загрузка..." : "Загрузить больше товаров"}
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
              Фильтры
            </Typography>
            <IconButton onClick={() => setFilterOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Диапазон цен
          </Typography>
        </Box>
      </Drawer>

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
