"use client";
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { mainColor } from "@/theme/main";
import Container from "../container/container";
import { usePathname } from "next/navigation";
import Link from "next/link";
const themeColors = {
  primary: "#62B75A", // Bright blue
  secondary: "#1e293b", // Dark slate
  accent: "#f59e0b", // Amber
  background: "#ffffff",
  text: "#0f172a",
  lightGray: "#f1f5f9",
};
const Footer = () => {
  const path = usePathname();

  return (
    <Box
      sx={{
        backgroundColor: mainColor,
        color: "white",
        padding: "20px 0",
        display: path == "/login" || path == "/registration" ? "none" : "block",
      }}
    >
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Logo or Title */}
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(150deg, #1e293b 0%, ${themeColors.accent} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "'Poppins', sans-serif",
              mr: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            SAREZ MOBILE
          </Typography>

          {/* Navigation Links */}
          <Box
            sx={{
              display: "flex",
              gap: "20px",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => window.scrollTo(0, 0)}
            >
              Главная
            </Typography>
            <Typography
              variant="body2"
              sx={{
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => window.open("/pages/catalog", "_self")}
            >
              Каталог
            </Typography>
            <Typography
              variant="body2"
              sx={{
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => window.open("/about", "_self")}
            >
              О нас
            </Typography>
            <Typography
              variant="body2"
              sx={{
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => window.open("/contact", "_self")}
            >
              Контакты
            </Typography>
          </Box>

          {/* Social Media Icons */}
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <IconButton
              sx={{ color: "white", "&:hover": { color: "black" } }}
              onClick={() => window.open("https://facebook.com", "_blank")}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              sx={{ color: "white", "&:hover": { color: "black" } }}
              onClick={() => window.open("https://instagram.com", "_blank")}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              sx={{ color: "white", "&:hover": { color: "black" } }}
              onClick={() => window.open("https://twitter.com", "_blank")}
            >
              <TwitterIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Copyright */}
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "14px",
          }}
        >
          © {new Date().getFullYear()}{" "}
          <Link href={"https://softclub.tj"} target="_blank">
            SOFTCLUB.TJ
          </Link>
          . Все права защищены.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
