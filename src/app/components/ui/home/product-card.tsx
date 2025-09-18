"use client"
import type React from "react"
import { memo } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Box, Typography, IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import StarIcon from "@mui/icons-material/Star"
import { Product } from "@/types/home"



interface ProductCardProps {
  product: Product
  index: number
  imgUrl: string
  mainColor: string
  onAddToCart: (id: string | number) => void
}

const ProductCard = memo(({ product, index, imgUrl, mainColor, onAddToCart }: ProductCardProps) => {
  const router = useRouter()

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const handleCardClick = () => {
    router.push(`/pages/product/${product.id}`)
  }

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product.id)
  }

  return (
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
        onClick={handleCardClick}
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
              mixBlendMode: "multiply",
            }}
          />

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
              <StarIcon sx={{ color: "#fcc419", fontSize: "0.8rem" }} />
              <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 500 }}>
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
            {product.categoryName || "Категория"}
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
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: mainColor,
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                      }}
                    >
                      {product.price} ₽
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
                      {product.discountPrice} ₽
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
                onClick={handleAddToCartClick}
                sx={{
                  bgcolor: product.productInMyCart ? "#e9ecef" : mainColor,
                  color: product.productInMyCart ? "#adb5bd" : "white",
                  "&:hover": {
                    bgcolor: product.productInMyCart ? "#e9ecef" : "#6741d9",
                  },
                  width: 36,
                  height: 36,
                }}
                disabled={product.productInMyCart}
              >
                {product.productInMyCart ? <RemoveIcon /> : <AddIcon />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
})

ProductCard.displayName = "ProductCard"

export default ProductCard
