"use client";
import React, { useEffect, useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { useHomeStore } from "./store/home/useHomeStore";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Container from "./components/shared/container/container";
import Image from "next/image";
import { imgUrl } from "@/config/config";
import { Button } from "@mui/material";
import { mainColor } from "@/theme/main";
const Home = () => {
  const progressCircle = useRef<null | SVGSVGElement>(null);
  const progressContent = useRef<null | HTMLSpanElement>(null);

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

  const { products, getProducts } = useHomeStore();

  useEffect(() => {
    getProducts();
  }, []);


  return (
    <div>
      <Container>
        <Box sx={{ display: { md: "block", xs: "none" } }}>
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

            {/* Progress indicator */}
            {/* <div className="autoplay-progress" slot="container-end">
              <svg viewBox="0 0 48 48" ref={progressCircle}>
                <circle cx="24" cy="24" r="20"></circle>
              </svg>
              <span ref={progressContent}></span>
            </div> */}
          </Swiper>
        </Box>
        <br />
        <br />

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
                  // padding: "px",
                  borderRadius: "8px",
                  // border: "1px solid #eaeaea",
                  // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                  position: "relative",
                  mb: "20px",
                }}
              >
                {/* Бадҷи 'Лучший подарок' */}
                {/* <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "#FFD700",
              color: "#000",
              fontSize: "12px",
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            Лучший подарок
          </div> */}

                {/* Тасвир */}
                <Image
                  width={200}
                  height={200}
                  alt={el.productName}
                  // unoptimized
                  src={`${imgUrl}/${el.image}`}
                  className="w-[100%] h-[180px] mb-[10px] rounded-lg"
                />

                {/* Номи маҳсулот */}
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

                {/* Тавсифи маҳсулот */}
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

                {/* Нарх */}
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

                {/* Рейтинг */}
                <div className="flex items-center mb-2 text-sm text-gray-600">
                  <span className="mr-1">⭐ {26}</span>
                  <span>({5} оценок)</span>
                </div>

                {/* Тугма */}
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: mainColor,
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#6a1b9a",
                    },
                    fontSize: { xs: "10px", sm: "12px", md: "16" },
                  }}
                >
                  Добавить в корзину
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>{" "}
      <br />
      <br />
    </div>
  );
};

export default Home;
