"use client";
import React, { useEffect, useState } from "react";
import CatalogHeader from "./catalogHeader/catalogHeader";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { mainColor } from "@/theme/main";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Container from "../container/container";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Image from "next/image";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if access_token exists in localStorage
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token); // If token exists, set isLoggedIn to true
    }
  }, []);

  return (
    <Container>
      <div className="p-[10px] gap-[40px] md:flex-nowrap flex-wrap flex justify-around">
        <Image
          priority
          width={200}
          height={200}
          src={"https://alifshop.tj/images/logo.png"}
          alt="logo nextraStore"
          className="m-auto"
        />
        <CatalogHeader  />
        <Box
          sx={{
            maxWidth: "480px",
            order: { xs: "1", md: "0" },
            width: "100%",
            position: "relative",
            display:"flex",
            justifyContent:"center"
          }}
        >
          <TextField
            variant="outlined"
            aria-label="Название товара или артикул"
            placeholder="Название товара или артикул"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                "& fieldset": {
                  borderColor: mainColor,
                  borderWidth: "2px",
                },
                "&:hover fieldset": {
                  borderColor: mainColor,
                },
                "&.Mui-focused fieldset": {
                  borderColor: mainColor,
                },
                backgroundColor: "white",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                width: "100%",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    sx={{
                      backgroundColor: mainColor,
                      color: "white",
                      borderRadius: "10px",
                      padding: "8px",
                      marginRight: "4px",
                      "&:hover": {
                        backgroundColor: mainColor,
                        color: "black",
                      },
                    }}
                  >
                    <SearchIcon aria-label="search" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <div className="flex gap-[20px]">
          {isLoggedIn ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <IconButton
                sx={{
                  color: "black",
                  "&:hover": { color: mainColor },
                }}
              >
                <ShoppingCartOutlinedIcon aria-label="cart" />
              </IconButton>
              <IconButton
                sx={{
                  color: "black",
                  "&:hover": { color: mainColor },
                }}
              >
                <AccountCircleOutlinedIcon aria-label="profile" />
              </IconButton>
            </Box>
          ) : (
            <Button
              sx={{
                backgroundColor: mainColor,
                color: "black",
                padding: "15px 20px",
                fontSize: "14px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "bold",
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: mainColor,
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  display: "flex",
                  gap: "6px",
                  alignItems: "center",
                }}
              >
                Войти
              </Typography>
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Header;
