"use client";
import { useCartStore } from "@/app/store/cart/cart";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Headroom from "react-headroom";
import Container from "../container/container";
import CatalogHeader from "./catalogHeader/catalogHeader";

// Icons
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

// MUI components
import { useProductsStore } from "@/app/store/product/product";
import { mainColor } from "@/theme/main";
import {
  Avatar,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Tooltip,
  Typography,
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
  primary: "#62B75A", // Bright blue
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
  const router = useRouter();
  const { searchResults, setSearchProducts, isLoadingSearch } =
    useProductsStore();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setSearchQuery(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setSearchProducts(value);
    }, 500);
  };

  const path = usePathname();
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
        console.warn("Token not found in localStorage");
        setIsLoggedIn(false);
      }
    }
  }, [getProductsFromCart]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigationLinks = [
    {
      label: "Products",
      path: "/pages/product",
      icon: <CategoryOutlinedIcon />,
    },
    {
      label: "Catalog",
      path: "/pages/catalog",
      icon: <CategoryOutlinedIcon />,
    },
    {
      label: "Favorites",
      path: "/pages/wishlist",
      icon: <FavoriteBorderOutlinedIcon />,
    },
    {
      label: "Notifications",
      path: "/pages/notifications",
      icon: <NotificationsOutlinedIcon />,
    },
  ];

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
                <img className="w-[130px] " src="/logo.png" alt="" />
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (searchQuery.trim() !== "") {
                        router.push(
                          `/pages/product?query=${searchQuery.trim()}`
                        );
                        setSearchFocused(false);
                      }
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      "& fieldset": {
                        borderColor: themeColors.lightGray,
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: mainColor,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: mainColor,
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
                            ? mainColor
                            : themeColors.secondary,
                      },
                    })}
                    onClick={() => router.push(link.path)}
                    sx={{
                      color:
                        path === link.path ? mainColor : themeColors.secondary,
                      fontWeight: 500,
                      textTransform: "none",
                      borderRadius: "10px",
                      py: 1,
                      px: 2,
                      "&:hover": {
                        backgroundColor: themeColors.lightGray,
                        color: mainColor,
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
                          badgeContent={
                            productsFromCart?.productsFromCart?.length
                          }
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
                            bgcolor: mainColor,
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
                      backgroundColor: mainColor,
                      color: "white",
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "12px",
                      padding: "8px 20px",
                      "&:hover": {
                        backgroundColor: mainColor,
                        opacity: 0.9,
                      },
                      boxShadow: "0px 4px 10px rgba(59, 130, 246, 0.25)",
                    }}
                  >
                    Login
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
                color: mainColor,
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
                    color: path === "/" ? mainColor : themeColors.secondary,
                  }}
                />
              }
            />

            <BottomNavigationAction
              label="Products"
              value="/pages/product"
              icon={
                <CategoryOutlinedIcon
                  sx={{
                    fontSize: "24px",
                    color:
                      path === "/pages/product"
                        ? mainColor
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
                  badgeContent={productsFromCart?.productsFromCart?.length}
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
                          ? mainColor
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
                          ? mainColor
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
                          ? mainColor
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
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (searchQuery.trim() !== "") {
                router.push(`/pages/product?query=${searchQuery.trim()}`);
                setDrawerOpen(false);
              }
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              "& fieldset": {
                borderColor: themeColors.lightGray,
                borderWidth: "1px",
              },
              "&:hover fieldset": {
                borderColor: mainColor,
              },
              "&.Mui-focused fieldset": {
                borderColor: mainColor,
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
                  onClick={() => {
                    if (searchQuery.trim() !== "") {
                      router.push(`/pages/product?query=${searchQuery}`);
                      toggleDrawer();
                    }
                  }}
                  variant="contained"
                  sx={{
                    backgroundColor: mainColor,
                    minWidth: "auto",
                    p: "6px",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: mainColor,
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

        {isLoadingSearch ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <CircularProgress size={24} />
          </div>
        ) : searchResults.length > 0 ? (
          <List>
            {searchResults.map((result) => (
              <ListItem
                key={result.id}
                disablePadding
                onClick={() => {
                  router.push(`/pages/product/${result.id}`);
                  toggleDrawer();
                }}
              >
                <ListItemButton>
                  <ListItemText primary={result.productName} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography
            variant="body2"
            sx={{ mt: 2, color: themeColors.secondary }}
          >
            Ничего не найдено
          </Typography>
        )}
      </Drawer>
    </div>
  );
};

export default Header;
