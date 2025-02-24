"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { useHomeStore } from "./store/home/useHomeStore";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Container from "./components/shared/container/container";
import Image from "next/image";
import { imgUrl } from "@/config/config";
import { Button } from "@mui/material";
import { mainColor } from "@/theme/main";
import { useCartStore } from "@/app/store/cart/cart";
import { useRouter } from "next/navigation";
const Home = () => {
  const router = useRouter();
  const { addProductToCart } = useCartStore();
  const progressCircle = useRef<null | SVGSVGElement>(null);
  const progressContent = useRef<null | HTMLSpanElement>(null);
  const { products, getProducts, setPageSize, setProducts } = useHomeStore();
  const [isLoading, setIsLoading] = useState(false);
  const onAutoplayTimeLeft = (
    swiper: SwiperType,
    timeLeft: number,
    percentage: number
  ) => {
    if (progressCircle.current) {
      progressCircle.current.style.setProperty(
        "--progress",
        String(1 - percentage)
      );
    }
    if (progressContent.current) {
      progressContent.current.textContent = `${Math.ceil(timeLeft / 1000)}s`;
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleLoadMore = async () => {
    setIsLoading(true);
    setPageSize();
    await getProducts();
    setIsLoading(false);
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
  }

  return (
    <div>
      <Container>
        {/* Swiper Section */}
        <Box sx={{ display: { md: "block", xs: "none" }, mt: "30px" }}>
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination, Navigation]}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
            className="mySwiper"
          >
            <SwiperSlide
              style={{
                backgroundImage:
                  "url('https://alifshop.tj/_next/image?url=https%3A%2F%2Fs3.eu-central-1.amazonaws.com%2Falifcore.storage%2Fmedia%2Fimages%2Fsettings%2F41%2Fbanner-1734685837266.jpg&w=1200&q=85')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "full",
              }}
            ></SwiperSlide>
            <SwiperSlide
              style={{
                backgroundImage:
                  "url('https://alifshop.tj/_next/image?url=https%3A%2F%2Fs3.eu-central-1.amazonaws.com%2Falifcore.storage%2Fmedia%2Fimages%2Fsettings%2F41%2Fbanner-1734685837266.jpg&w=1200&q=85')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "full",
              }}
            ></SwiperSlide>
            <SwiperSlide
              style={{
                backgroundImage:
                  "url('https://alifshop.tj/_next/image?url=https%3A%2F%2Fs3.eu-central-1.amazonaws.com%2Falifcore.storage%2Fmedia%2Fimages%2Fsettings%2F41%2Fbanner-1734685837266.jpg&w=1200&q=85')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "full",
              }}
            ></SwiperSlide>
            <SwiperSlide
              style={{
                backgroundImage:
                  "url('https://alifshop.tj/_next/image?url=https%3A%2F%2Fs3.eu-central-1.amazonaws.com%2Falifcore.storage%2Fmedia%2Fimages%2Fsettings%2F41%2Fbanner-1734685837266.jpg&w=1200&q=85')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "full",
              }}
            ></SwiperSlide>
          </Swiper>
        </Box>
        <br />
        <br />

        {/* Products Grid */}
        <Box>
          <Grid container gap={1} sx={{ justifyContent: "space-between" }}>
            {products.map((el) => (
              <Grid
                key={el.id}
                size={{
                  xs: 5,
                  sm: 5,
                  md: 4,
                  lg: 3,
                }}
                maxWidth={"250px"}
                minWidth={"170px"}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  position: "relative",
                  mb: "20px",
                }}
                onClick={() => router.push("/pages/product/" + el.id)}
              >
                <Image
                  width={200}
                  height={200}
                  alt={el.productName}
                  src={`${imgUrl}/${el.image}`}
                  className="w-[100%] h-[180px] mb-[10px] rounded-lg"
                />
                <h2
                  style={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {el.productName}
                </h2>
                <p
                  style={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    fontSize: "14px",
                    color: "#555",
                  }}
                >
                  {el.description}
                </p>
                <div className="flex items-center mb-2">
                  {el.hasDiscount ? (
                    <>
                      <span className="text-lg font-bold text-green-600 mr-2">
                        {el.discountPrice} ₽
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {el.price} ₽
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-[black]">
                      {el.price} ₽
                    </span>
                  )}
                </div>
                <div className="flex items-center mb-2 text-sm text-gray-600">
                  <span className="mr-1">⭐ {26}</span>
                  <span>({5} оценок)</span>
                </div>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: mainColor,
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: mainColor,
                    },
                    fontSize: { xs: "10px", sm: "12px", md: "16" },
                    "&.Mui-disabled": {
                      backgroundColor: mainColor,
                      color: "white",
                      cursor: "not-allowed",
                    },
                  }}
                  onClick={() => handleAddToCart(el.id)}
                  disabled={el.productInMyCart}
                >
                  {el.productInMyCart ? "в корзинe" : "Добавить в корзину"}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Load More Button */}
        <Box sx={{ textAlign: "center", mt: 4, mb: 4 }}>
          <Button
            variant="contained"
            onClick={handleLoadMore}
            disabled={isLoading}
            sx={{
              backgroundColor: mainColor,
              color: "#fff",
              "&:hover": {
                backgroundColor: "#6a1b9a",
              },
              "&:disabled": {
                backgroundColor: "#ccc",
              },
            }}
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </Box>
      </Container>
      <br />
      <br />
    </div>
  );
};

export default Home;
