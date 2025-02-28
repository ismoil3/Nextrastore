"use client";

import { apiUrl } from "@/config/config";
import axiosRequest from "@/utils/axiosRequest";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Container,
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
  Rating,
  Skeleton,
  Fade,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
  Tooltip,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  StarBorder,
  NavigateNext,
  ShoppingBag,
} from "@mui/icons-material";
import { useCartStore } from "@/app/store/cart/cart";

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

// Create a premium custom theme
const premiumTheme = createTheme({
  palette: {
    primary: {
      main: "#2a2a2a",
      light: "#555555",
      dark: "#000000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ff6b6b",
      light: "#ff9e9e",
      dark: "#c73a3a",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#2a2a2a",
      secondary: "#6c757d",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 800,
      fontSize: "2.5rem",
      letterSpacing: "-0.01562em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.25rem",
      letterSpacing: "-0.00833em",
    },
    h3: {
      fontWeight: 700,
      fontSize: "2rem",
      letterSpacing: "0em",
    },
    h4: {
      fontWeight: 700,
      fontSize: "1.5rem",
      letterSpacing: "0.00735em",
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      letterSpacing: "0em",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.1rem",
      letterSpacing: "0.0075em",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          padding: "10px 24px",
          fontWeight: 600,
          textTransform: "none",
          transition: "all 0.3s ease",
        },
        containedPrimary: {
          boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 100,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
        },
        rounded: {
          borderRadius: 16,
        },
      },
    },
  },
});

// Product features
const productFeatures = [
  "Premium quality materials",
  "Ethically sourced",
  "Sustainably manufactured",
  "Durable construction",
  "Easy care instructions",
];

const ProductPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addProductToCart } = useCartStore();
  const { id } = useParams<{ id: string }>();
  const theme = premiumTheme;

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
      name: product?.color ? product?.color : "default",
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
      setSnackbarMessage("✓ Link copied to clipboard");
      setOpenSnackbar(true);
      handleShareClose();
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleAddToCart = () => {
    if (!product) return;
    setSnackbarMessage(
      product.productInMyCart
        ? " Cart updated successfully"
        : " Added to your shopping bag"
    );
    setOpenSnackbar(true);
    addProductToCart(product.id);
    getById(id as string);
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

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size === selectedSize ? "" : size);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color === selectedColor ? "" : color);
  };

  const handleToggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const calculateDiscountPercentage = () => {
    if (!product || !product.hasDiscount) return 0;
    return Math.round((product.discountPrice / product.price) * 100);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Skeleton
                variant="rounded"
                height={450}
                width="100%"
                sx={{ borderRadius: 4 }}
              />
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 2,
                  justifyContent: "center",
                }}
              >
                {[1, 2, 3, 4].map((item) => (
                  <Skeleton
                    key={item}
                    variant="rounded"
                    width={60}
                    height={60}
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" height={60} width="80%" sx={{ mb: 1 }} />
              <Skeleton variant="text" height={30} width="50%" sx={{ mb: 2 }} />
              <Skeleton variant="text" height={40} width="40%" sx={{ mb: 2 }} />
              <Skeleton
                variant="rounded"
                height={56}
                width="100%"
                sx={{ mb: 2, borderRadius: 2 }}
              />
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <Skeleton variant="rounded" height={56} width="100%" />
                <Skeleton variant="rounded" height={56} width="100%" />
              </Box>
              <Skeleton
                variant="text"
                height={100}
                width="100%"
                sx={{ mb: 2 }}
              />
              <Skeleton
                variant="rounded"
                height={200}
                width="100%"
                sx={{ mb: 2, borderRadius: 2 }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          Product not found
        </Typography>
        <Button variant="contained" color="primary" href="/">
          Back to Homepage
        </Button>
      </Container>
    );
  }

  const productUrl = `${window.location.origin}/product/${product.id}`;
  const discountPercentage = calculateDiscountPercentage();

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: 6 }}>
        {/* Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
            <MuiLink href="/" underline="hover" color="inherit">
              <Home fontSize="small" sx={{ mr: 0.5 }} />
              Home
            </MuiLink>
            <MuiLink href="/collections" underline="hover" color="inherit">
              <Category fontSize="small" sx={{ mr: 0.5 }} />
              Collections
            </MuiLink>
            <Typography color="text.primary">{product.productName}</Typography>
          </Breadcrumbs>
        </Box>

        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
          <Grid container spacing={{ xs: 2, md: 6 }}>
            {/* Product Images */}
            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative" }}>
                {product.hasDiscount && (
                  <Chip
                    label={`${discountPercentage}% OFF`}
                    color="secondary"
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      zIndex: 10,
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                      py: 1,
                      px: 1.5,
                      transform: "rotate(-2deg)",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                )}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    minHeight: { xs: "300px", sm: "400px", md: "550px" },
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "#f8f8f8",
                    cursor: "zoom-in",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
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
                        color="primary"
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
                        height: "100%",
                        objectFit: "contain",
                        transition: "all 0.5s ease",
                        display: imageLoaded ? "block" : "none",
                      }}
                      onLoad={() => setImageLoaded(true)}
                    />
                  </Fade>
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
                      padding: 2,
                      opacity: 0,
                      transition: "opacity 0.2s ease",
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
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        "&:hover": {
                          bgcolor: "white",
                          transform: "scale(1.1) translateX(-4px)",
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
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        "&:hover": {
                          bgcolor: "white",
                          transform: "scale(1.1) translateX(4px)",
                        },
                      }}
                    >
                      <ChevronRight />
                    </IconButton>
                  </Box>
                  <Chip
                    label={`${currentImage + 1} / ${product.images.length}`}
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      right: 16,
                      bgcolor: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                      fontWeight: "medium",
                      backdropFilter: "blur(4px)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                    size="small"
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                    overflowX: "auto",
                    pb: 1,
                    gap: 1.5,
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
                        marginY: 2,
                        opacity: index === currentImage ? 1 : 0.6,
                        transform:
                          index === currentImage ? "scale(1.05)" : "scale(1)",
                        transition: "all 0.3s ease",
                        outline:
                          index === currentImage
                            ? `2px solid ${theme.palette.primary.main}`
                            : "none",
                        outlineOffset: 2,
                        "&:hover": {
                          opacity: 1,
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      <img
                        src={`${apiUrl}/images/${item.images}`}
                        alt={`Thumbnail ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Product Details */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.2,
                      mb: 1,
                    }}
                  >
                    {product.productName}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Rating
                      value={product.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                      emptyIcon={<StarBorder fontSize="inherit" />}
                    />
                    <Typography
                      variant="body2"
                      sx={{ ml: 1, color: "text.secondary" }}
                    >
                      ({product.rating}) •{" "}
                      {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </Typography>
                    <Box sx={{ ml: "auto" }}>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<Share fontSize="small" />}
                        onClick={handleShareClick}
                        sx={{ color: "text.secondary" }}
                      >
                        Share
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {/* Pricing */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      color: product.hasDiscount
                        ? "secondary.main"
                        : "text.primary",
                    }}
                  >
                    $
                    {product.hasDiscount
                      ? (product.price - product.discountPrice).toFixed(2)
                      : product.price.toFixed(2)}
                  </Typography>
                  {product.hasDiscount && (
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                        ml: 2,
                        opacity: 0.8,
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                  )}
                  {product.hasDiscount && (
                    <Chip
                      label={`Save $${product.discountPrice.toFixed(2)}`}
                      color="secondary"
                      size="small"
                      sx={{ ml: 2, fontWeight: "bold" }}
                    />
                  )}
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Size Selector */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                    Size
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                    {Array.isArray(JSON.parse(product.size))
                      ? JSON.parse(product.size).map((size: string) => (
                          <Chip
                            key={size}
                            label={size}
                            onClick={() => handleSizeSelect(size)}
                            variant={
                              selectedSize === size ? "filled" : "outlined"
                            }
                            color="primary"
                            sx={{
                              minWidth: 60,
                              fontWeight: 600,
                              borderRadius: 1,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                          />
                        ))
                      : ""}
                  </Box>
                </Box>

                {/* Color Selector */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                    Color
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                    {colorOptions.map((color) => (
                      <Tooltip key={color.name} title={color.name} arrow>
                        <Box
                          onClick={() => handleColorSelect(color.code)}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            bgcolor: color.code,
                            cursor: "pointer",
                            border:
                              selectedColor === color.code
                                ? `3px solid ${theme.palette.primary.main}`
                                : "3px solid transparent",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </Box>

                {/* Add to Cart Button */}
                <Box sx={{ mb: 3 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<ShoppingBag />}
                    onClick={handleAddToCart}
                    disabled={product.productInMyCart}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: "1rem",
                      textTransform: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    {product.productInMyCart ? "Update Cart" : "Add to Cart"}
                  </Button>
                </Box>

                {/* Product Features */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                    Product Features
                  </Typography>
                  <List dense>
                    {productFeatures.map((feature, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check
                            sx={{
                              color: theme.palette.success.main,
                              fontSize: 18,
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                    Description
                  </Typography>
                  <Collapse in={isDescriptionExpanded} collapsedSize={100}>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary" }}
                    >
                      {product.description}
                    </Typography>
                  </Collapse>
                  <Button
                    onClick={handleToggleDescription}
                    variant="text"
                    size="small"
                    sx={{ mt: 1, fontWeight: 600 }}
                  >
                    {isDescriptionExpanded ? "Show Less" : "Show More"}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Share Modal */}
        <Modal
          open={isShareModalOpen}
          onClose={handleShareClose}
          closeAfterTransition
        >
          <Fade in={isShareModalOpen}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                borderRadius: 3,
                boxShadow: 24,
                p: 4,
                width: { xs: "90%", sm: 400 },
                textAlign: "center",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Share this product
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <IconButton
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${productUrl}`,
                      "_blank"
                    )
                  }
                  sx={{ bgcolor: "#1877F2", color: "white" }}
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${productUrl}`,
                      "_blank"
                    )
                  }
                  sx={{ bgcolor: "#1DA1F2", color: "white" }}
                >
                  <Twitter />
                </IconButton>
                <IconButton
                  onClick={() =>
                    window.open(
                      `https://api.whatsapp.com/send?text=${productUrl}`,
                      "_blank"
                    )
                  }
                  sx={{ bgcolor: "#25D366", color: "white" }}
                >
                  <WhatsApp />
                </IconButton>
                <IconButton
                  onClick={handleCopyLink}
                  sx={{ bgcolor: "grey.800", color: "white" }}
                >
                  <ContentCopy />
                </IconButton>
              </Box>
            </Box>
          </Fade>
        </Modal>

        {/* Snackbar for Notifications */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 2,
              bgcolor: "success.main",
              color: "white",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Check fontSize="small" />
            <Typography variant="body1">{snackbarMessage}</Typography>
          </Paper>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default ProductPage;
