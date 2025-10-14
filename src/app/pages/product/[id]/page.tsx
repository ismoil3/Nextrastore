"use client";

import { apiUrl } from "@/config/config";
import axiosRequest from "@/utils/axiosRequest";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Button,
  ThemeProvider,
  createTheme,
  Modal,
  Snackbar,
  IconButton,
  Divider,
  Skeleton,
  Fade,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
  Tooltip,
  Stack,
  Card,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";

// Icons
import {
  Share,
  Facebook,
  Twitter,
  WhatsApp,
  ContentCopy,
  Check,
  ChevronLeft,
  ChevronRight,
  Home,
  Category,
  NavigateNext,
  ShoppingBag,
  Favorite,
  FavoriteBorder,
  ZoomIn,
} from "@mui/icons-material";
import { useCartStore } from "@/app/store/cart/cart";
import { mainColor } from "@/theme/main";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Container from "@/app/components/shared/container/container";

// Interfaces
interface Image {
  id: string;
  images: string;
}

interface Product {
  id: string;
  productName: string;
  description: string;
  price: number;
  discountPrice: number;
  hasDiscount: boolean;
  rating: number;
  images: Image[];
  brand: string;
  color: string;
  size: string;
  quantity: number;
  productInMyCart: boolean;
}

// Modern theme with glass morphism and gradients
const modernTheme = createTheme({
  palette: {
    primary: {
      main: "#000000",
      light: "#333333",
      dark: "#000000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#667eea",
      light: "#a3bffa",
      dark: "#5a67d8",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a202c",
      secondary: "#718096",
    },
  },
  typography: {
    fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
    h1: {
      fontWeight: 800,
      fontSize: "2.75rem",
      letterSpacing: "-0.02em",
      lineHeight: 1.1,
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.75rem",
      letterSpacing: "0em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      letterSpacing: "0.00735em",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.95rem",
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "12px 28px",
          fontWeight: 600,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #000000 0%, #333333 100%)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          "&:hover": {
            boxShadow: "0 12px 35px rgba(0,0,0,0.2)",
            background: "linear-gradient(135deg, #333333 0%, #000000 100%)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
          border: "1px solid rgba(0,0,0,0.03)",
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
          border: "1px solid rgba(0,0,0,0.03)",
        },
        rounded: {
          borderRadius: 20,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
          backdropFilter: "blur(10px)",
        },
      },
    },
  },
});

const ProductPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);
  const { addProductToCart } = useCartStore();
  const { id } = useParams<{ id: string }>();
  const theme = modernTheme;
  const muiTheme = useTheme();

  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const getById = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axiosRequest(
        `${apiUrl}/Product/get-product-by-id?id=${id}`
      );
      setProduct(data.data);
      setImageLoaded(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const colorOptions = [
    {
      name: product?.color ? product?.color : "по умолчанию",
      code: product?.color ? product.color : "default",
    },
  ];

  useEffect(() => {
    if (id) {
      getById(id as string);
    }
  }, [id]);

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleShareClose = () => {
    setIsShareModalOpen(false);
  };

  const handleCopyLink = async () => {
    if (!product) return;
    try {
      const productUrl = `${window.location.origin}/product/${product.id}`;
      await navigator.clipboard.writeText(productUrl);
      setSnackbarMessage("✓ Ссылка скопирована");
      setOpenSnackbar(true);
      handleShareClose();
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setSnackbarMessage(
      product.productInMyCart ? "✓ Корзина обновлена" : "✓ Добавлено в корзину"
    );
    await addProductToCart(product.id);
    await getById(id as string);
    setOpenSnackbar(true);
  };

  const handleNextImage = () => {
    if (!product) return;
    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    if (!product) return;
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color === selectedColor ? "" : color);
  };

  const calculateDiscountPercentage = () => {
    if (!product || !product.hasDiscount) return 0;
    return Math.round(
      ((product.price - product.discountPrice) / product.price) * 100
    );
  };

  const arrDesc = JSON.parse(product?.description || "[]");
  const mainDesc = arrDesc[0]?.description || arrDesc[0]?.value;
  const characteristics = arrDesc.slice(1);

  if (loading) {
    return (
      <Container >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton
              variant="rounded"
              height={600}
              width="100%"
              sx={{ borderRadius: 4 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={80} width="80%" sx={{ mb: 2 }} />
            <Skeleton variant="text" height={40} width="60%" sx={{ mb: 3 }} />
            <Skeleton
              variant="rounded"
              height={120}
              sx={{ mb: 3, borderRadius: 3 }}
            />
            <Skeleton
              variant="rounded"
              height={56}
              sx={{ mb: 2, borderRadius: 3 }}
            />
            <Skeleton variant="rounded" height={56} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          Товар не найден
        </Typography>
        <Button variant="contained" color="primary" href="/" sx={{ mt: 2 }}>
          Вернуться на главную
        </Button>
      </Container>
    );
  }

  const productUrl = `${window.location.origin}/product/${product.id}`;
  const discountPercentage = calculateDiscountPercentage();

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, mb: 8 }}>
        {/* Breadcrumbs */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
            <MuiLink
              href="/"
              underline="hover"
              color="inherit"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Home sx={{ mr: 0.5 }} fontSize="small" />
              Главная
            </MuiLink>
            <MuiLink
              href="/collections"
              underline="hover"
              color="inherit"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Category sx={{ mr: 0.5 }} fontSize="small" />
              Коллекции
            </MuiLink>
            <Typography color="text.primary" sx={{ fontWeight: 600 }}>
              {product.productName}
            </Typography>
          </Breadcrumbs>
        </Box>

        <Grid container spacing={6}>
          {/* Product Images */}
          <Grid item xs={12} lg={7}>
            <Card sx={{ p: 3, borderRadius: 4, position: "relative" }}>
              {product.hasDiscount && (
                <Chip
                  label={`-${discountPercentage}%`}
                  sx={{
                    position: "absolute",
                    top: 24,
                    left: 24,
                    zIndex: 10,
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    py: 1,
                    px: 2,
                    background:
                      "linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(255,107,107,0.3)",
                  }}
                />
              )}

              <Box sx={{ position: "relative", mb: 3 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "#f8fafc",
                    cursor: zoomImage ? "zoom-out" : "zoom-in",
                    transition: "all 0.3s ease",
                    transform: zoomImage ? "scale(1.05)" : "scale(1)",
                  }}
                  onClick={() => setZoomImage(!zoomImage)}
                >
                  {!imageLoaded && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress
                        sx={{ color: mainColor }}
                        size={60}
                        thickness={4}
                      />
                    </Box>
                  )}
                  <Fade in={imageLoaded} timeout={500}>
                    <Box
                      component="img"
                      src={`${apiUrl}/images/${product.images[currentImage].images}`}
                      alt={`${product.productName}`}
                      sx={{
                        width: "100%",
                        height: "auto",
                        maxHeight: zoomImage ? "80vh" : "600px",
                        objectFit: "contain",
                        transition: "all 0.5s ease",
                        display: imageLoaded ? "block" : "none",
                      }}
                      onLoad={() => setImageLoaded(true)}
                    />
                  </Fade>

                  {/* Image Navigation */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 3,
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      "&:hover": {
                        opacity: 1,
                      },
                    }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.95)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                        "&:hover": {
                          bgcolor: "white",
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <ChevronLeft />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.95)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                        "&:hover": {
                          bgcolor: "white",
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <ChevronRight />
                    </IconButton>
                  </Box>

                  {/* Zoom Indicator */}
                  <Tooltip title={zoomImage ? "Уменьшить" : "Увеличить"}>
                    <IconButton
                      sx={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                        bgcolor: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        "&:hover": {
                          bgcolor: "black",
                        },
                      }}
                    >
                      <ZoomIn />
                    </IconButton>
                  </Tooltip>

                  {/* Image Counter */}
                  <Chip
                    label={`${currentImage + 1} / ${product.images.length}`}
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      left: 16,
                      bgcolor: "rgba(0, 0, 0, 0.7)",
                      color: "white",
                      fontWeight: "medium",
                      backdropFilter: "blur(4px)",
                    }}
                    size="small"
                  />
                </Box>
              </Box>

              {/* Thumbnail Gallery */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  overflowX: "auto",
                  pb: 1,
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {product.images.map((item, index) => (
                  <Box
                    key={item.id}
                    onClick={() => setCurrentImage(index)}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      flexShrink: 0,
                      border:
                        index === currentImage
                          ? `2px solid ${theme.palette.primary.main}`
                          : "2px solid transparent",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <img
                      src={`${apiUrl}/images/${item.images}`}
                      alt={`Миниатюра ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} lg={5}>
            <Box sx={{ position: "sticky", top: 24 }}>
              <Card sx={{ p: 4, borderRadius: 4, mb: 3 }}>
                {/* Header with Actions */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: 800,
                        lineHeight: 1.1,
                        mb: 2,
                        background:
                          "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {product.productName}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      onClick={handleShareClick}
                      sx={{
                        bgcolor: "grey.50",
                        "&:hover": {
                          bgcolor: "grey.100",
                        },
                      }}
                    >
                      <Share />
                    </IconButton>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Color Selector */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Цвет
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {colorOptions.map((color) => (
                      <Tooltip key={color.name} title={color.name} arrow>
                        <Box
                          onClick={() => handleColorSelect(color.code)}
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "12px",
                            bgcolor: color.code,
                            cursor: "pointer",
                            border:
                              selectedColor === color.code
                                ? `3px solid ${theme.palette.primary.main}`
                                : "2px solid rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease",
                            boxShadow:
                              selectedColor === color.code
                                ? "0 4px 12px rgba(0,0,0,0.15)"
                                : "none",
                            "&:hover": {
                              transform: "scale(1.05)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            },
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </Box>

                {/* Add to Cart Button */}
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<ShoppingBag />}
                  onClick={handleAddToCart}
                  sx={{
                    py: 1.75,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    mb: 2,
                  }}
                >
                  {product.productInMyCart
                    ? "Обновить корзину"
                    : "Добавить в корзину"}
                </Button>
              </Card>
            </Box>
          </Grid>
        </Grid>
        {/* Description Card */}
        <Card
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: { xs: 2, sm: 3, md: 4 },
            mt: { xs: 3, sm: 4 },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
            <InfoOutlinedIcon
              color="primary"
              fontSize={isMobile ? "small" : "medium"}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontSize: { xs: "1rem", sm: "1.125rem" } }}
            >
              Описание и характеристики
            </Typography>
          </Stack>

          {mainDesc && (
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: "text.secondary",
                lineHeight: 1.7,
                fontSize: { xs: 14, sm: 16 },
              }}
            >
              {mainDesc}
            </Typography>
          )}

          <Divider sx={{ mb: 3 }} />

          {/* Characteristics */}
          <Stack spacing={1.5}>
            {characteristics.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1.5, sm: 2 },
                  borderRadius: { xs: 2, sm: 3 },
                  bgcolor: idx % 2 === 0 ? "transparent" : "grey.50",
                  border: "1px solid",
                  borderColor: idx % 2 === 0 ? "transparent" : "transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "primary.50",
                    transform: { xs: "none", sm: "translateX(4px)" },
                  },
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: { xs: 1, sm: 0 },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.primary",
                    fontWeight: 500,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Card>
        {/* Share Modal */}
        <Modal
          open={isShareModalOpen}
          onClose={handleShareClose}
          closeAfterTransition
        >
          <Fade in={isShareModalOpen}>
            <Card
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                borderRadius: 4,
                p: 4,
                width: { xs: "90%", sm: 400 },
                textAlign: "center",
                border: "none",
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Поделиться товаром
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                {[
                  { icon: <Facebook />, color: "#1877F2", label: "Facebook" },
                  { icon: <Twitter />, color: "#1DA1F2", label: "Twitter" },
                  { icon: <WhatsApp />, color: "#25D366", label: "WhatsApp" },
                  { icon: <ContentCopy />, color: "#6B7280", label: "Copy" },
                ].map((social) => (
                  <Tooltip key={social.label} title={social.label} arrow>
                    <IconButton
                      onClick={
                        social.label === "Copy"
                          ? handleCopyLink
                          : () =>
                              window.open(
                                social.label === "Facebook"
                                  ? `https://www.facebook.com/sharer/sharer.php?u=${productUrl}`
                                  : social.label === "Twitter"
                                  ? `https://twitter.com/intent/tweet?url=${productUrl}`
                                  : `https://api.whatsapp.com/send?text=${productUrl}`,
                                "_blank"
                              )
                      }
                      sx={{
                        bgcolor: social.color,
                        color: "white",
                        width: 56,
                        height: 56,
                        "&:hover": {
                          bgcolor: social.color,
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
            </Card>
          </Fade>
        </Modal>

        {/* Snackbar for Notifications */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Card
            sx={{
              p: 3,
              bgcolor: "success.main",
              color: "white",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
              boxShadow: "0 8px 25px rgba(76,175,80,0.3)",
            }}
          >
            <Check fontSize="small" />
            <Typography variant="body1" fontWeight={600}>
              {snackbarMessage}
            </Typography>
          </Card>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default ProductPage;
