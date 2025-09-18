"use client";
import { memo } from "react";
import { AnimatePresence } from "framer-motion";
import { Box, Grid, CircularProgress } from "@mui/material";
import ProductCard from "./product-card";
import { Products } from "@/types/home";


interface ProductsGridProps {
  products: Products["products"];
  isLoading: boolean;
  imgUrl: string;
  mainColor: string;
  onAddToCart: (id: string | number) => void;
}

const ProductsGrid = memo(
  ({
    products,
    isLoading,
    imgUrl,
    mainColor,
    onAddToCart,
  }: ProductsGridProps) => {
    if (isLoading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: mainColor }} />
        </Box>
      );
    }

    return (
      <AnimatePresence>
        <Grid container spacing={2}>
          {products.map((product, index) => (
            <Grid item xs={6} sm={4} md={3} key={product.id}>
              <ProductCard
                product={product}
                index={index}
                imgUrl={imgUrl}
                mainColor={mainColor}
                onAddToCart={onAddToCart}
              />
            </Grid>
          ))}
        </Grid>
      </AnimatePresence>
    );
  }
);

ProductsGrid.displayName = "ProductsGrid";

export default ProductsGrid;
