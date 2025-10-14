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
      "@media (max-width: 900px)": {
        fontSize: "2.25rem",
      },
      "@media (max-width: 600px)": {
        fontSize: "1.75rem",
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      letterSpacing: "-0.01em",
      "@media (max-width: 600px)": {
        fontSize: "1.5rem",
      },
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.75rem",
      letterSpacing: "0em",
      "@media (max-width: 600px)": {
        fontSize: "1.25rem",
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      letterSpacing: "0.00735em",
      "@media (max-width: 600px)": {
        fontSize: "1.125rem",
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      "@media (max-width: 600px)": {
        fontSize: "1rem",
      },
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
      "@media (max-width: 600px)": {
        fontSize: "0.875rem",
      },
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.95rem",
      "@media (max-width: 600px)": {
        fontSize: "0.875rem",
      },
    },
    body1: {
      "@media (max-width: 600px)": {
        fontSize: "0.875rem",
      },
    },
    body2: {
      "@media (max-width: 600px)": {
        fontSize: "0.8125rem",
      },
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
          "@media (max-width: 600px)": {
            padding: "10px 20px",
            fontSize: "0.875rem",
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
          "@media (max-width: 600px)": {
            borderRadius: 12,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
          border: "1px solid rgba(0,0,0,0.03)",
          "@media (max-width: 600px)": {
            borderRadius: 12,
          },
        },
        rounded: {
          borderRadius: 20,
          "@media (max-width: 600px)": {
            borderRadius: 12,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
          backdropFilter: "blur(10px)",
          "@media (max-width: 600px)": {
            fontSize: "0.75rem",
            height: "28px",
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          "@media (max-width: 600px)": {
            paddingLeft: 12,
            paddingRight: 12,
          },
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
  const isTablet = useMediaQuery(muiTheme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("lg"));

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
      <Container>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={6}>
            <Skeleton
              variant="rounded"
              height={{ xs: 300, sm: 400, md: 500, lg: 600 }}
              width="100%"
              sx={{ borderRadius: { xs: 2, md: 4 } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton
              variant="text"
              height={{ xs: 40, md: 80 }}
              width={{ xs: "100%", md: "80%" }}
              sx={{ mb: 2 }}
            />
            <Skeleton
              variant="text"
              height={{ xs: 30, md: 40 }}
              width={{ xs: "80%", md: "60%" }}
              sx={{ mb: 3 }}
            />
            <Skeleton
              variant="rounded"
              height={{ xs: 80, md: 120 }}
              sx={{ mb: 3, borderRadius: { xs: 2, md: 3 } }}
            />
            <Skeleton
              variant="rounded"
              height={{ xs: 48, md: 56 }}
              sx={{ mb: 2, borderRadius: { xs: 2, md: 3 } }}
            />
            <Skeleton
              variant="rounded"
              height={{ xs: 48, md: 56 }}
              sx={{ borderRadius: { xs: 2, md: 3 } }}
            />
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
      <Container maxWidth="xl" sx={{ mt: { xs: 1, sm: 2, md: 4 }, mb: { xs: 4, md: 8 } }}>
        {/* Breadcrumbs */}
        <Box sx={{ mb: { xs: 2, md: 4 }, px: { xs: 1, sm: 0 } }}>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{
              '& .MuiBreadcrumbs-ol': {
                flexWrap: 'nowrap',
                overflow: 'hidden',
              },
              '& .MuiBreadcrumbs-li': {
                whiteSpace: 'nowrap',
              }
            }}
          >
            <MuiLink
              href="/"
              underline="hover"
              color="inherit"
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: { xs: "0.75rem", sm: "0.875rem" }
              }}
            >
              <Home sx={{ mr: 0.5, fontSize: { xs: "small", sm: "inherit" } }} />
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                Главная
              </Box>
            </MuiLink>
            <MuiLink
              href="/collections"
              underline="hover"
              color="inherit"
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: { xs: "0.75rem", sm: "0.875rem" }
              }}
            >
              <Category sx={{ mr: 0.5, fontSize: { xs: "small", sm: "inherit" } }} />
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                Коллекции
              </Box>
            </MuiLink>
            <Typography
              color="text.primary"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {isMobile ? `${product.productName.substring(0, 20)}...` : product.productName}
            </Typography>
          </Breadcrumbs>
        </Box>

        <Grid container spacing={{ xs: 2, md: 4, lg: 6 }}>
          {/* Product Images */}
          <Grid item xs={12} lg={7}>
            <Card sx={{
              p: { xs: 1.5, sm: 2, md: 3 },
              borderRadius: { xs: 2, sm: 3, md: 4 },
              position: "relative"
            }}>
              {product.hasDiscount && (
                <Chip
                  label={`-${discountPercentage}%`}
                  sx={{
                    position: "absolute",
                    top: { xs: 12, md: 24 },
                    left: { xs: 12, md: 24 },
                    zIndex: 10,
                    fontWeight: "bold",
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                    py: { xs: 0.5, md: 1 },
                    px: { xs: 1.5, md: 2 },
                    background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(255,107,107,0.3)",
                  }}
                />
              )}

              <Box sx={{ position: "relative", mb: { xs: 2, md: 3 } }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    borderRadius: { xs: 2, md: 3 },
                    overflow: "hidden",
                    bgcolor: "#f8fafc",
                    cursor: zoomImage ? "zoom-out" : "zoom-in",
                    transition: "all 0.3s ease",
                    transform: zoomImage ? "scale(1.05)" : "scale(1)",
                    minHeight: { xs: 300, sm: 400, md: 500 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
                        size={isMobile ? 40 : 60}
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
                        maxHeight: zoomImage ? "80vh" : { xs: 300, sm: 400, md: 500, lg: 600 },
                        objectFit: "contain",
                        transition: "all 0.5s ease",
                        display: imageLoaded ? "block" : "none",
                      }}
                      onLoad={() => setImageLoaded(true)}
                    />
                  </Fade>

                  {/* Image Navigation - Always visible on mobile */}
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
                      padding: { xs: 1, sm: 2, md: 3 },
                      opacity: isMobile ? 1 : 0,
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
                        width: { xs: 36, md: 48 },
                        height: { xs: 36, md: 48 },
                      }}
                    >
                      <ChevronLeft fontSize={isMobile ? "small" : "medium"} />
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
                        width: { xs: 36, md: 48 },
                        height: { xs: 36, md: 48 },
                      }}
                    >
                      <ChevronRight fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                  </Box>

                  {/* Zoom Indicator */}
                  {!isMobile && (
                    <Tooltip title={zoomImage ? "Уменьшить" : "Увеличить"}>
                      <IconButton
                        sx={{
                          position: "absolute",
                          bottom: { xs: 8, md: 16 },
                          right: { xs: 8, md: 16 },
                          bgcolor: "rgba(0, 0, 0, 0.7)",
                          color: "white",
                          "&:hover": {
                            bgcolor: "black",
                          },
                          width: { xs: 32, md: 40 },
                          height: { xs: 32, md: 40 },
                        }}
                      >
                        <ZoomIn fontSize={isMobile ? "small" : "medium"} />
                      </IconButton>
                    </Tooltip>
                  )}

                  {/* Image Counter */}
                  {product.images.length > 1 && (
                    <Chip
                      label={`${currentImage + 1} / ${product.images.length}`}
                      sx={{
                        position: "absolute",
                        bottom: { xs: 8, md: 16 },
                        left: { xs: 8, md: 16 },
                        bgcolor: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        fontWeight: "medium",
                        backdropFilter: "blur(4px)",
                        fontSize: { xs: "0.7rem", md: "0.8125rem" },
                        height: { xs: 24, md: 32 },
                      }}
                      size="small"
                    />
                  )}
                </Box>
              </Box>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 1, md: 2 },
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
                        width: { xs: 60, sm: 70, md: 80 },
                        height: { xs: 60, sm: 70, md: 80 },
                        borderRadius: { xs: 1.5, md: 2 },
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden",
                        flexShrink: 0,
                        border: index === currentImage
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
              )}
            </Card>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} lg={5}>
            <Box sx={{ position: { lg: "sticky" }, top: { lg: 24 } }}>
              <Card sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: { xs: 2, sm: 3, md: 4 },
                mb: { xs: 2, md: 3 }
              }}>
                {/* Header with Actions */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: { xs: 2, md: 3 },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1, sm: 0 },
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: 800,
                        lineHeight: 1.1,
                        mb: 2,
                        fontSize: {
                          xs: "15px",
                          sm: "20px",
                          md: "25px",
                          lg: "30px",
                        },
                      }}
                    >
                      {product.productName}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{
                    display: "flex",
                    gap: 1,
                    alignSelf: { xs: "flex-end", sm: "flex-start" }
                  }}>
                    <IconButton
                      onClick={handleShareClick}
                      sx={{
                        bgcolor: "grey.50",
                        "&:hover": {
                          bgcolor: "grey.100",
                        },
                        width: { xs: 36, md: 40 },
                        height: { xs: 36, md: 40 },
                      }}
                    >
                      <Share fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                  </Box>
                </Box>

                {/* Price Display */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: product.hasDiscount ? "error.main" : "text.primary",
                      }}
                    >
                      {product.hasDiscount ? product.discountPrice : product.price} ₽
                    </Typography>
                    {product.hasDiscount && (
                      <Typography
                        variant="h6"
                        sx={{
                          color: "text.secondary",
                          textDecoration: "line-through",
                          fontWeight: 500,
                        }}
                      >
                        {product.price} ₽
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: { xs: 2, md: 3 } }} />

                {/* Color Selector */}
                <Box sx={{ mb: { xs: 3, md: 4 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Цвет
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {colorOptions.map((color) => (
                      <Tooltip key={color.name} title={color.name} arrow>
                        <Box
                          onClick={() => handleColorSelect(color.code)}
                          sx={{
                            width: { xs: 40, md: 48 },
                            height: { xs: 40, md: 48 },
                            borderRadius: { xs: "10px", md: "12px" },
                            bgcolor: color.code,
                            cursor: "pointer",
                            border: selectedColor === color.code
                              ? `3px solid ${theme.palette.primary.main}`
                              : "2px solid rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease",
                            boxShadow: selectedColor === color.code
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
                  size={isMobile ? "medium" : "large"}
                  startIcon={<ShoppingBag />}
                  onClick={handleAddToCart}
                  sx={{
                    py: { xs: 1.25, md: 1.75 },
                    borderRadius: { xs: 2, md: 3 },
                    fontWeight: 700,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    mb: 2,
                  }}
                >
                  {product.productInMyCart
                    ? "Обновить корзину"
                    : "Добавить в корзину"}
                </Button>

                {/* Additional Info */}
                <Box sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                  mt: 2
                }}>
                  <Typography variant="body2" color="text.secondary">
                    🚚 Бесплатная доставка
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ⭐ {product.rating || "Нет оценок"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📦 В наличии
                  </Typography>
                </Box>
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
              sx={{
                fontWeight: 600,
                fontSize: {
                  xs: "1rem",
                  sm: "1.125rem",
                  md: "1.25rem"
                }
              }}
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
                  sx={{
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    textAlign: { xs: "left", sm: "right" }
                  }}
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
                borderRadius: { xs: 3, md: 4 },
                p: { xs: 3, md: 4 },
                width: { xs: "95%", sm: 400 },
                maxWidth: "90vw",
                textAlign: "center",
                border: "none",
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Поделиться товаром
              </Typography>
              <Box sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                flexWrap: "wrap"
              }}>
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
                        width: { xs: 48, md: 56 },
                        height: { xs: 48, md: 56 },
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
          sx={{
            bottom: { xs: 70, sm: 80 }, // Account for mobile navigation bars
          }}
        >
          <Card
            sx={{
              p: { xs: 2, md: 3 },
              bgcolor: "success.main",
              color: "white",
              borderRadius: { xs: 2, md: 3 },
              display: "flex",
              alignItems: "center",
              gap: 2,
              boxShadow: "0 8px 25px rgba(76,175,80,0.3)",
              minWidth: { xs: 250, md: 300 },
            }}
          >
            <Check fontSize={isMobile ? "small" : "medium"} />
            <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
              {snackbarMessage}
            </Typography>
          </Card>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default ProductPage;
