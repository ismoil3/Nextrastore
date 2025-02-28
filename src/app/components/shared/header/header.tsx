"use client";
import React, { useEffect, useState } from "react";
import CatalogHeader from "./catalogHeader/catalogHeader";
import { jwtDecode } from "jwt-decode";
import { useCartStore } from "@/app/store/cart/cart";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Headroom from "react-headroom";
import Container from "../container/container";
import { motion } from "framer-motion";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

// MUI components
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
  Tooltip,
  Avatar,
  Drawer,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";

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

// Define theme colors
const themeColors = {
  primary: "#3b82f6", // Bright blue
  secondary: "#1e293b", // Dark slate
  accent: "#f59e0b", // Amber
  background: "#ffffff",
  text: "#0f172a",
  lightGray: "#f1f5f9",
};

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { productsFromCart, getProductsFromCart } = useCartStore();
  const path = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");

      if (token) {
        try {
          const decoded = jwtDecode<UserToken>(token);
          if (decoded.sid) {
            setIsLoggedIn(true);
            setUserName(decoded.name || decoded.email.split("@")[0]);
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
  }, [getProductsFromCart]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigationLinks = [
    { label: "Home", path: "/", icon: <HomeOutlinedIcon /> },
    {
      label: "Catalog",
      path: "/pages/catalog",
      icon: <CategoryOutlinedIcon />,
    },
    {
      label: "Wishlist",
      path: "/pages/wishlist",
      icon: <FavoriteBorderOutlinedIcon />,
    },
    {
      label: "Notifications",
      path: "/pages/notifications",
      icon: <NotificationsOutlinedIcon />,
    },
  ];

  console.log(path);
  return (
    <div
      className={`z-[500] ${
        path == "/login" || path == "/registration" ? "hidden" : ""
      }`}
    >
      <Headroom
        className={`relative z-[500] shadow-sm ${
          path == "login" || path == "registration" ? "hidden" : ""
        }`}
      >
        <Box
          sx={{
            bgcolor: themeColors.background,
            borderBottom: `1px solid ${themeColors.lightGray}`,
          }}
        >
          <Container>
            <Box
              className="py-3 px-4"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              {/* Logo Area */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => router.push("/")}
              >
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(90deg, ${themeColors.primary} 0%, ${themeColors.accent} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontFamily: "'Poppins', sans-serif",
                    mr: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  NOVA SHOP
                </Typography>
              </Box>

              {/* Search Box - Animated */}
              <motion.div
                initial={{ width: isMobile ? "100%" : "40%" }}
                animate={{
                  width: searchFocused
                    ? isMobile
                      ? "100%"
                      : "50%"
                    : isMobile
                    ? "100%"
                    : "40%",
                }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "relative",
                  display: isMobile ? "none" : "block",
                }}
              >
                <TextField
                  variant="outlined"
                  placeholder="Search products..."
                  fullWidth
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      "& fieldset": {
                        borderColor: themeColors.lightGray,
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: themeColors.primary,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: themeColors.primary,
                      },
                      backgroundColor: themeColors.lightGray,
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: themeColors.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              {/* Desktop Navigation */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {navigationLinks.slice(0, 1).map((link) => (
                  <Button
                    key={link.path}
                    startIcon={React.cloneElement(link.icon, {
                      sx: {
                        color:
                          path === link.path
                            ? themeColors.primary
                            : themeColors.secondary,
                      },
                    })}
                    onClick={() => router.push(link.path)}
                    sx={{
                      color:
                        path === link.path
                          ? themeColors.primary
                          : themeColors.secondary,
                      fontWeight: 500,
                      textTransform: "none",
                      borderRadius: "10px",
                      py: 1,
                      px: 2,
                      "&:hover": {
                        backgroundColor: themeColors.lightGray,
                        color: themeColors.primary,
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
                <CatalogHeader />

                {/* Profile and Cart Section */}
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 1.5, height: "28px", my: "auto" }}
                />

                {isLoggedIn ? (
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <Tooltip title="Cart">
                      <IconButton
                        onClick={() => router.push("/pages/cart")}
                        sx={{
                          color: themeColors.secondary,
                          backgroundColor:
                            path === "/pages/cart"
                              ? themeColors.lightGray
                              : "transparent",
                          "&:hover": {
                            backgroundColor: themeColors.lightGray,
                          },
                          padding: 1.5,
                          borderRadius: "12px",
                        }}
                      >
                        <Badge
                          badgeContent={productsFromCart.length}
                          color="error"
                          sx={{
                            "& .MuiBadge-badge": {
                              backgroundColor: themeColors.accent,
                              color: "white",
                              fontWeight: "bold",
                            },
                          }}
                        >
                          <ShoppingCartOutlinedIcon aria-label="cart" />
                        </Badge>
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Profile">
                      <Box
                        onClick={() => router.push("/pages/profile")}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          cursor: "pointer",
                          backgroundColor:
                            path === "/pages/profile"
                              ? themeColors.lightGray
                              : "transparent",
                          borderRadius: "12px",
                          padding: "6px 12px",
                          transition: "all 0.2s",
                          "&:hover": {
                            backgroundColor: themeColors.lightGray,
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: themeColors.primary,
                            fontWeight: "bold",
                            fontSize: "0.875rem",
                          }}
                        >
                          {userName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            color: themeColors.text,
                            display: { xs: "none", lg: "block" },
                          }}
                        >
                          {userName}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                ) : (
                  <Button
                    onClick={() => router.push("/login")}
                    variant="contained"
                    sx={{
                      backgroundColor: themeColors.primary,
                      color: "white",
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "12px",
                      padding: "8px 20px",
                      "&:hover": {
                        backgroundColor: themeColors.primary,
                        opacity: 0.9,
                      },
                      boxShadow: "0px 4px 10px rgba(59, 130, 246, 0.25)",
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </Box>
            </Box>
          </Container>
        </Box>
      </Headroom>

      {/* Mobile Bottom Navigation */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            borderRadius: "16px 16px 0 0",
            overflow: "hidden",
            boxShadow: "0px -4px 10px rgba(0, 0, 0, 0.05)",
          }}
          elevation={0}
        >
          <BottomNavigation
            value={path}
            onChange={(event, newValue) => router.push(newValue)}
            sx={{
              height: "70px",
              backgroundColor: themeColors.background,
              "& .MuiBottomNavigationAction-root": {
                minWidth: "auto",
                padding: "8px 0",
              },
              "& .Mui-selected": {
                color: themeColors.primary,
              },
            }}
          >
            <BottomNavigationAction
              label="Home"
              value="/"
              icon={
                <HomeOutlinedIcon
                  sx={{
                    fontSize: "24px",
                    color:
                      path === "/"
                        ? themeColors.primary
                        : themeColors.secondary,
                  }}
                />
              }
            />

            <BottomNavigationAction
              label="Catalog"
              value="/pages/catalog"
              icon={
                <CategoryOutlinedIcon
                  sx={{
                    fontSize: "24px",
                    color:
                      path === "/pages/catalog"
                        ? themeColors.primary
                        : themeColors.secondary,
                  }}
                />
              }
            />

            <BottomNavigationAction
              label="Search"
              onClick={() => toggleDrawer()}
              icon={
                <SearchIcon
                  sx={{ fontSize: "24px", color: themeColors.secondary }}
                />
              }
            />

            <BottomNavigationAction
              label="Cart"
              value="/pages/cart"
              icon={
                <Badge
                  badgeContent={productsFromCart.length}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: themeColors.accent,
                      color: "white",
                      fontWeight: "bold",
                    },
                  }}
                >
                  <ShoppingCartOutlinedIcon
                    sx={{
                      fontSize: "24px",
                      color:
                        path === "/pages/cart"
                          ? themeColors.primary
                          : themeColors.secondary,
                    }}
                  />
                </Badge>
              }
            />

            <BottomNavigationAction
              label="Profile"
              value="/pages/profile"
              icon={
                isLoggedIn ? (
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor:
                        path === "/pages/profile"
                          ? themeColors.primary
                          : themeColors.secondary,
                      fontSize: "0.75rem",
                    }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </Avatar>
                ) : (
                  <AccountCircleOutlinedIcon
                    sx={{
                      fontSize: "24px",
                      color:
                        path === "/pages/profile"
                          ? themeColors.primary
                          : themeColors.secondary,
                    }}
                  />
                )
              }
            />
          </BottomNavigation>
        </Paper>
      </Box>

      {/* Mobile Search Drawer */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            pt: 2,
            pb: 4,
            px: 2,
            borderRadius: "0 0 16px 16px",
          },
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search products..."
          fullWidth
          autoFocus
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              "& fieldset": {
                borderColor: themeColors.lightGray,
                borderWidth: "1px",
              },
              "&:hover fieldset": {
                borderColor: themeColors.primary,
              },
              "&.Mui-focused fieldset": {
                borderColor: themeColors.primary,
              },
              backgroundColor: themeColors.lightGray,
              fontWeight: 500,
              fontSize: "0.95rem",
            },
            "& .MuiInputBase-input": {
              padding: "12px 14px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: themeColors.secondary }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  onClick={toggleDrawer}
                  variant="contained"
                  sx={{
                    backgroundColor: themeColors.primary,
                    minWidth: "auto",
                    p: "6px",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: themeColors.primary,
                      opacity: 0.9,
                    },
                  }}
                >
                  Search
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Drawer>
    </div>
  );
};

export default Header;
