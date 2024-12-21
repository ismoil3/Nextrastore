"use client";
import React, { useRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";

const Home = () => {
  const progressCircle = useRef<null | HTMLDivElement>(null);
  const progressContent = useRef<null | HTMLSpanElement>(null);

  const onAutoplayTimeLeft = (s: number, time: number, progress: number) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  return (
    <div>
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
        <SwiperSlide>
          <Image width={"100"} height={"100"} src={"https://alifshop.tj/_next/image?url=https%3A%2F%2Fs3.eu-central-1.amazonaws.com%2Falifcore.storage%2Fmedia%2Fimages%2Fsettings%2F41%2Fbanner-1734685837266.jpg&w=1200&q=85"} alt="my active" />
        </SwiperSlide>
        <SwiperSlide>
          <Image width={"100"} height={"100"} src={"https://alifshop.tj/_next/image?url=https%3A%2F%2Fs3.eu-central-1.amazonaws.com%2Falifcore.storage%2Fmedia%2Fimages%2Fsettings%2F41%2Fbanner-1734685837266.jpg&w=1200&q=85"} alt="my active" />
        </SwiperSlide>
        <SwiperSlide>
          <Image width={"100"} height={"100"} src={"https://alifshop.tj/_next/image?url=https%3A%2F%2Fs3.eu-central-1.amazonaws.com%2Falifcore.storage%2Fmedia%2Fimages%2Fsettings%2F41%2Fbanner-1734685837266.jpg&w=1200&q=85"} alt="my active" />
        </SwiperSlide>
        <SwiperSlide>
          <Image width={"100"} height={"100"} src={"https://alifshop.tj/_next/image?url=https%3A%2F%2Fs3.eu-central-1.amazonaws.com%2Falifcore.storage%2Fmedia%2Fimages%2Fsettings%2F41%2Fbanner-1734685837266.jpg&w=1200&q=85"} alt="my active" />
        </SwiperSlide>

        <div className="autoplay-progress" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
    </div>
  );
};

export default Home;
