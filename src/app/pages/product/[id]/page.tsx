"use client"

import type React from "react"

import { apiUrl } from "@/config/config"
import axiosRequest from "@/utils/axiosRequest"
import {
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  Chip,
  Button,
  Rating,
  TextField,
  Card,
  useMediaQuery,
  useTheme,
  ThemeProvider,
} from "@mui/material"
import { useParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { ShoppingCart, Favorite, Share } from "@mui/icons-material"

// Interfaces remain the same
interface Image {
  id: string
  images: string
}

interface User {
  id: string
  fullName: string
  userName: string
}

interface Product {
  id: string
  productName: string
  description: string
  price: number
  discountPrice: number
  hasDiscount: boolean
  rating: number
  images: Image[]
  brand: string
  color: string
  weight: string
  size: string
  code: string
  quantity: number
  productInMyCart: boolean
  users: User[]
}

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#3498db",
//     },
//     secondary: {
//       main: "#e74c3c",
//     },
//   },
//   typography: {
//     fontFamily: "Arial, sans-serif",
//     h4: {
//       fontWeight: 700,
//     },
//     h6: {
//       fontWeight: 600,
//     },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           textTransform: "none",
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//           boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//         },
//       },
//     },
//   },
// })

const ProductPage = () => {
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)
  const { id } = useParams<{ id: string }>()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const getById = useCallback(async (id: string) => {
    try {
      const { data } = await axiosRequest(`${apiUrl}/Product/get-product-by-id?id=${id}`)
      setProduct(data.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    getById(id)
  }, [getById, id])

  if (!product) {
    return <Typography>Loading...</Typography>
  }

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    beforeChange: (current: number, next: number) => setCurrentImage(next),
  }

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Math.max(1, Number.parseInt(event.target.value) || 1))
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: "#f8f9fa" }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card>
                <Slider  initialSlide={currentImage} {...sliderSettings}>
                  {product.images.map((item, index) => (
                    <div key={item.id}>
                      <img
                        src={`${apiUrl}/images/${item.images}`}
                        alt={`${product.productName} - Image ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "contain",
                          maxHeight: "450px",
                          transition: "transform 0.3s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                    </div>
                  ))}
                </Slider>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  {product.images.map((item, index) => (
                    <Box
                      key={item.id}
                      component="img"
                      src={`${apiUrl}/images/${item.images}`}
                      alt={`Thumbnail ${index + 1}`}
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: 1,
                        mr: 1,
                        cursor: "pointer",
                        border: index === currentImage ? "2px solid #3498db" : "none",
                      }}
                      onClick={() => setCurrentImage(index)}
                    />
                  ))}
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom sx={{ color: "primary.main" }}>
                {product.productName}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {product.brand}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Rating value={product.rating} readOnly precision={0.5} sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  ({product.rating?.toFixed(1)})
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" color="secondary.main" sx={{ mr: 2, fontWeight: "bold" }}>
                  ${product.hasDiscount ? (product.price - product.discountPrice)?.toFixed(2) : product.price?.toFixed(2)}
                </Typography>
                {product.hasDiscount && (
                  <Typography variant="body1" sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                    ${product.price?.toFixed(2)}
                  </Typography>
                )}
              </Box>
              {product.hasDiscount && (
                <Chip label={`Save $${product.discountPrice?.toFixed(2)}`} color="error" sx={{ mb: 2 }} />
              )}
              <Typography variant="body1" paragraph sx={{ color: "text.primary" }}>
                {product.description}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: "text.primary" }}>
                  Color: <Chip label={product.color} size="small" sx={{ ml: 1 }} />
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "text.primary" }}>
                  Weight: {product.weight}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "text.primary" }}>
                  Size: {product.size}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "text.primary" }}>
                  Code: {product.code}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mr: 1, color: "text.primary" }}>
                  Availability:
                </Typography>
                <Chip
                  label={product.quantity > 0 ? "In Stock" : "Out of Stock"}
                  color={product.quantity > 0 ? "success" : "error"}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2, flexDirection: isMobile ? "column" : "row" }}>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  InputProps={{ inputProps: { min: 1, max: product.quantity } }}
                  sx={{ width: isMobile ? "100%" : "100px", mr: isMobile ? 0 : 2, mb: isMobile ? 2 : 0 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={product.quantity === 0}
                  startIcon={<ShoppingCart />}
                  sx={{
                    flex: 1,
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  {product.productInMyCart ? "Update Cart" : "Add to Cart"}
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<Favorite />}
                  sx={{ flex: 1, mr: isMobile ? 0 : 1, mb: isMobile ? 2 : 0, width: isMobile ? "100%" : "auto" }}
                >
                  Add to Wishlist
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  sx={{ flex: 1, ml: isMobile ? 0 : 1, width: isMobile ? "100%" : "auto" }}
                >
                  Share
                </Button>
              </Box>
              {product.users.length > 0 && (
              <Box sx={{ mt: 4, p: 2, bgcolor: "#ecf0f1", borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                  Seller Information:
                </Typography>
                <Typography sx={{ color: "#34495e" }}>{product.users[0].fullName}</Typography>
                <Typography color="text.secondary">{product.users[0].userName}</Typography>
              </Box>
            )}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  )
}

export default ProductPage

