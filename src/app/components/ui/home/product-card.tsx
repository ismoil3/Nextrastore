"use client";
import { Product } from "@/types/home";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import { Box, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { memo } from "react";

interface ProductCardProps {
  product: Product;
  index: number;
  imgUrl: string;
  mainColor: string;
  onAddToCart: (id: string | number) => void;
}

const ProductCard = memo(
  ({ product, index, imgUrl, mainColor, onAddToCart }: ProductCardProps) => {
    const router = useRouter();

    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };

    const handleCardClick = () => {
      router.push(`/pages/product/${product.id}`);
    };

    const handleAddToCartClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onAddToCart(product.id);
    };

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
              src={`${imgUrl}${product.image}`}
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
                <IconButton
                  onClick={handleAddToCartClick}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: product.productInMyCart ? "#e9ecef" : mainColor,
                    color: product.productInMyCart ? "#495057" : "white",
                    "&:hover": {
                      bgcolor: product.productInMyCart ? "#dee2e6" : "#2c7be5",
                    },
                    width: "100%",
                    height: 40,
                    px: 2.5,
                    borderRadius: "10px",
                    fontSize: 14,
                    textTransform: "none",
                    transition: "all 0.25s ease",
                  }}
                >
                  {product.productInMyCart ? (
                    <>In Cart</>
                  ) : (
                    <>
                      <AddIcon fontSize="small" />
                      Add to Cart
                    </>
                  )}
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </motion.div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
