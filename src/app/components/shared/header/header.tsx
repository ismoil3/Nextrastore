"use client";
import React, { useEffect, useState } from "react";
import CatalogHeader from "./catalogHeader/catalogHeader";
import {
  Badge,
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
import Container from "../container/container";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Headroom from "react-headroom";
import { jwtDecode } from "jwt-decode";
import { useCartStore } from "@/app/store/cart/cart";
interface UserToken {
  sid: string;
  name: string;
  email: string;
  sub: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
  iss: string;
  aud: string;
}

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { productsFromCart, getProductsFromCart } = useCartStore();
  const path = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");

      if (token) {
        try {
          const decoded = jwtDecode<UserToken>(token);
          if (decoded.sid) {
            setIsLoggedIn(true);
            getProductsFromCart();
          }
        } catch (error) {
          console.log("Invalid token:", error);
          setIsLoggedIn(false);
        }
      } else {
        console.warn("No token found in localStorage");
        setIsLoggedIn(false);
      }
    }
  }, []);

  return (
    <div className="">
      <Headroom className="relative z-[1000]  bg-[white]">
        <div className="header">
          <Container>
            <div className="p-[10px] gap-[40px] md:flex-nowrap bg-transparent flex justify-around">
              {/* Logo */}
              <Box
                sx={{ display: { md: "block", xs: "none" } }}
                onClick={() => router.push("/")}
              >
                <p className="text-[25px]">Nextrastore</p>
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
              <Box sx={{ display: { md: "flex", xs: "none" }, gap: "20px" }}>
                {isLoggedIn ? (
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <Badge color="success" badgeContent={productsFromCart.length}>
                      <IconButton
                        onClick={() => router.push("/pages/cart")}
                        sx={{
                          color: path === "/pages/cart" ? "#f9f9f9" : "white",
                          "&:hover": { color: mainColor },
                        }}
                      >
                        <ShoppingCartOutlinedIcon aria-label="cart" />
                      </IconButton>
                    </Badge>
                    <IconButton
                      onClick={() => router.push("/pages/profile")}
                      sx={{
                        color: path === "/pages/profile" ? "#f9f9f9" : "white",
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
              </Box>
            </div>

            {/* Bottom Navigation */}
          </Container>
        </div>
      </Headroom>
      <Box sx={{ display: { md: "none" }, color: "black" }}>
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
    </div>
  );
};

export default Header;
