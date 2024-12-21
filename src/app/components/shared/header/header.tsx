"use client";
import React, { useEffect, useState } from "react";
import CatalogHeader from "./catalogHeader/catalogHeader";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { mainColor } from "@/theme/main";
import Image from "next/image";
import Container from "../container/container";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Headroom from "react-headroom"
const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
    }
  }, []);

  return (
<div>
<Headroom>
     <Container>
      <div className="p-[10px] gap-[40px] md:flex-nowrap flex-wrap flex justify-around">
        {/* Logo */}
        <Box onClick={() => router.push("/")}>
          <Image
            priority
            width={200}
            height={200}
            src={"https://alifshop.tj/images/logo.png"}
            alt="NextraStore Online Shop Logo"
            className="m-auto cursor-pointer"
          />
        </Box>

        {/* Catalog Header */}
        <CatalogHeader />

        {/* Search Input */}
        <Box
          sx={{
            maxWidth: "480px",
            order: { xs: "1", md: "0" },
            width: "100%",
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextField
            variant="outlined"
            aria-label="Search for products or articles"
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

        {/* Profile / Login Section */}
        <div className="flex gap-[20px]">
          {isLoggedIn ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <IconButton
                onClick={() => router.push("/pages/cart")}
                sx={{
                  color: path === "/pages/cart" ? mainColor : "black",
                  "&:hover": { color: mainColor },
                }}
              >
                <ShoppingCartOutlinedIcon aria-label="cart" />
              </IconButton>
              <IconButton
                onClick={() => router.push("/pages/profile")}
                sx={{
                  color: path === "/pages/profile" ? mainColor : "black",
                  "&:hover": { color: mainColor },
                }}
              >
                <AccountCircleOutlinedIcon aria-label="profile" />
              </IconButton>
            </Box>
          ) : (
            <Button
              onClick={() => router.push("/login")}
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

      {/* Bottom Navigation */}
    
    </Container>

   </Headroom> 
   <Box sx={{ display: { md: "none" } }}>
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            boxShadow: "0px -2px 8px rgba(0, 0, 0, 0.1)",
          }}
          elevation={3}
        >
          <BottomNavigation
            value={path}
            onChange={(event, newValue) => router.push(newValue)}
            sx={{
              backgroundColor: "white",
              "& .Mui-selected": {
                color: mainColor,
              },
            }}
          >
            <BottomNavigationAction
              label="Главная"
              value="/"
              icon={
                <HomeOutlinedIcon
                  sx={{ color: path === "/" ? mainColor : "black" }}
                />
              }
              sx={{
                color: path === "/" ? mainColor : "black",
                "&:hover": { color: mainColor },
              }}
            />

            <BottomNavigationAction
              label="Каталог"
              value="/pages/catalog"
              icon={
                <CategoryOutlinedIcon
                  sx={{
                    color: path === "/pages/catalog" ? mainColor : "black",
                  }}
                />
              }
              sx={{
                color: path === "/pages/catalog" ? mainColor : "black",
                "&:hover": { color: mainColor },
              }}
            />
            <BottomNavigationAction
              label="Корзина"
              value="/pages/cart"
              icon={
                <ShoppingCartOutlinedIcon
                  sx={{ color: path === "/pages/cart" ? mainColor : "black" }}
                />
              }
              sx={{
                color: path === "/pages/cart" ? mainColor : "black",
                "&:hover": { color: mainColor },
              }}
            />
            <BottomNavigationAction
              label="Профиль"
              value="/pages/profile"
              icon={
                <AccountCircleOutlinedIcon
                  sx={{
                    color: path === "/pages/profile" ? mainColor : "black",
                  }}
                />
              }
              sx={{
                color: path === "/pages/profile" ? mainColor : "black",
                "&:hover": { color: mainColor },
              }}
            />
          </BottomNavigation>
        </Paper>
      </Box>
</div> );
};

export default Header;
