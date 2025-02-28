"use client";

import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  IconButton,
  Grid,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useCatalogHeader } from "@/app/store/catalogHeader/catalogHeader";
import { Subcategories } from "@/types/catalogTypes";

// Icons
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import NewReleasesOutlinedIcon from "@mui/icons-material/NewReleasesOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { mainColor } from "@/theme/main";

// Define theme colors
const themeColors = {
  primary: "#3b82f6", // Bright blue
  secondary: "#1e293b", // Dark slate
  accent: "#f59e0b", // Amber
  background: "#ffffff",
  text: "#0f172a",
  lightGray: "#f1f5f9",
  mediumGray: "#e2e8f0",
  darkGray: "#64748b",
  success: "#10b981",
  warning: "#f97316",
  lightBlue: "#e0f2fe",
};

const CatalogHeader: FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { getCatalog, catalog } = useCatalogHeader();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    getCatalog();
  }, [getCatalog]);

  const toggleDrawer = (newOpen: boolean) => () => {
    setIsDrawerOpen(newOpen);
    if (!newOpen) {
      // Reset selections when closing drawer
      setSelectedCategory(null);
    }
  };

  const selectedCategoryData: Subcategories | undefined = catalog.find(
    (category) => category.id === selectedCategory
  );

  // Featured sections for the catalog menu
  const featuredSections = [
    {
      title: "New Arrivals",
      icon: <NewReleasesOutlinedIcon sx={{ color: themeColors.warning }} />,
      items: ["Just Added", "This Week's Launches", "Coming Soon"],
      color: themeColors.warning,
    },
    {
      title: "Special Offers",
      icon: <LocalOfferOutlinedIcon sx={{ color: themeColors.accent }} />,
      items: ["Clearance", "Bundle Deals", "Season Specials"],
      color: themeColors.accent,
    },
    {
      title: "Trending Now",
      icon: <TrendingUpOutlinedIcon sx={{ color: themeColors.success }} />,
      items: ["Most Viewed", "Best Sellers", "Featured Products"],
      color: themeColors.success,
    },
  ];

  return (
    <>
      {/* Catalog Button */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Button
          variant="text"
          startIcon={
            <CategoryIcon
              sx={{
                color: themeColors.secondary,
                fontSize: "1.2rem",
              }}
            />
          }
          endIcon={
            <KeyboardArrowDownIcon
              sx={{
                color: themeColors.secondary,
                transition: "transform 0.3s ease",
                transform: isDrawerOpen ? "rotate(180deg)" : "rotate(0)",
              }}
            />
          }
          onClick={toggleDrawer(true)}
          sx={{
            color: isDrawerOpen ? mainColor : themeColors.secondary,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "10px",
            py: 1,
            px: 2,
            "&:hover": {
              backgroundColor: themeColors.lightGray,
              color: mainColor,
            },
            transition: "all 0.2s ease",
          }}
        >
          Catalog
        </Button>

        {/* Desktop Catalog Drawer */}
        <Drawer
          anchor="top"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
          slotProps={{
            backdrop: {
              sx: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          }}
          sx={{
            "& .MuiDrawer-paper": {
              backgroundColor: themeColors.background,
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
              borderRadius: "0 0 16px 16px",
              overflowY: "auto",
              padding: 0,
              maxHeight: "85vh",
              color: "black",
            },
          }}
        >
          <Box
            sx={{
              maxWidth: 1400,
              width: "100%",
              mx: "auto",
              position: "relative",
            }}
          >
            {/* Close button */}
            <IconButton
              onClick={toggleDrawer(false)}
              sx={{
                position: "absolute",
                top: 12,
                right: 16,
                color: themeColors.darkGray,
                backgroundColor: themeColors.lightGray,
                "&:hover": {
                  backgroundColor: themeColors.mediumGray,
                },
                zIndex: 5,
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Main content grid */}
            <Grid container sx={{ p: 3, position: "relative" }}>
              {/* Categories column */}
              <Grid
                item
                xs={12}
                md={3}
                sx={{
                  borderRight: { md: `1px solid ${themeColors.lightGray}` },
                  pr: { md: 2 },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: themeColors.secondary,
                    mb: 2,
                    py: 1,
                    borderBottom: `1px solid ${themeColors.lightGray}`,
                  }}
                >
                  Categories
                </Typography>

                <List
                  sx={{
                    py: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  {catalog.length > 0 ? (
                    catalog.map((category) => (
                      <ListItem
                        key={category.id}
                        component={motion.div}
                        initial={{ x: -5, opacity: 0.8 }}
                        animate={{ x: 0, opacity: 1 }}
                        onClick={() => setSelectedCategory(category.id)}
                        onMouseEnter={() =>
                          !isMobile && setSelectedCategory(category.id)
                        }
                        disablePadding
                        sx={{
                          borderRadius: "8px",
                          overflow: "hidden",
                          mb: 0.5,
                          color: "black",
                        }}
                      >
                        <Button
                          fullWidth
                          sx={{
                            justifyContent: "space-between",
                            textAlign: "left",
                            py: 1.5,
                            px: 2,
                            borderRadius: "8px",
                            backgroundColor:
                              selectedCategory === category.id
                                ? themeColors.lightBlue
                                : "transparent",
                            color:
                              selectedCategory === category.id
                                ? mainColor
                                : themeColors.text,
                            fontWeight:
                              selectedCategory === category.id ? 600 : 400,
                            "&:hover": {
                              backgroundColor: themeColors.lightBlue,
                              color: mainColor,
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.95rem",
                              textTransform: "none",
                              fontWeight: "inherit",
                              color: themeColors.text,
                              "&:hover": {
                                color: mainColor,
                              },
                            }}
                          >
                            {category.categoryName}
                          </Typography>
                          <KeyboardArrowRightIcon
                            sx={{
                              fontSize: "1.2rem",
                              color:
                                selectedCategory === category.id
                                  ? mainColor
                                  : themeColors.darkGray,
                              opacity:
                                selectedCategory === category.id ? 1 : 0.7,
                            }}
                          />
                        </Button>
                      </ListItem>
                    ))
                  ) : (
                    <Typography
                      sx={{ color: themeColors.darkGray, px: 2, py: 1 }}
                    >
                      Loading categories...
                    </Typography>
                  )}
                </List>
              </Grid>

              {/* Subcategories column */}
              <Grid
                item
                xs={12}
                md={5}
                sx={{ px: { md: 3 }, mt: { xs: 3, md: 0 } }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: themeColors.secondary,
                    mb: 2,
                    py: 1,
                    borderBottom: `1px solid ${themeColors.lightGray}`,
                  }}
                >
                  {selectedCategoryData
                    ? selectedCategoryData.categoryName
                    : "Select a Category"}
                </Typography>

                <Box sx={{ minHeight: "200px" }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedCategory || "empty"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      {selectedCategoryData ? (
                        selectedCategoryData.subCategories.length > 0 ? (
                          <Grid container spacing={1}>
                            {selectedCategoryData.subCategories.map(
                              (subCategory) => (
                                <Grid item xs={12} sm={6} key={subCategory.id}>
                                  <Button
                                    fullWidth
                                    sx={{
                                      justifyContent: "flex-start",
                                      textAlign: "left",
                                      py: 1,
                                      px: 2,
                                      borderRadius: "8px",
                                      color: themeColors.secondary,
                                      "&:hover": {
                                        backgroundColor: themeColors.lightGray,
                                        color: mainColor,
                                      },
                                      transition: "all 0.2s ease",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "0.9rem",
                                        textTransform: "none",
                                        color: themeColors.text,
                                      }}
                                    >
                                      {subCategory.subCategoryName}
                                    </Typography>
                                  </Button>
                                </Grid>
                              )
                            )}
                          </Grid>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "180px",
                              borderRadius: "8px",
                              backgroundColor: themeColors.lightGray,
                            }}
                          >
                            <Typography sx={{ color: themeColors.darkGray }}>
                              No subcategories available
                            </Typography>
                          </Box>
                        )
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "180px",
                            borderRadius: "8px",
                            backgroundColor: themeColors.lightGray,
                          }}
                        >
                          <Typography sx={{ color: themeColors.darkGray }}>
                            Select a category to see subcategories
                          </Typography>
                        </Box>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Box>
              </Grid>

              {/* Featured sections column */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  mt: { xs: 3, md: 0 },
                  pl: { md: 2 },
                  borderLeft: { md: `1px solid ${themeColors.lightGray}` },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: themeColors.secondary,
                    mb: 2,
                    py: 1,
                    borderBottom: `1px solid ${themeColors.lightGray}`,
                  }}
                >
                  Featured
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {featuredSections.map((section, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        borderRadius: "10px",
                        backgroundColor: `${section.color}10`,
                        border: `1px solid ${section.color}30`,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: `${section.color}20`,
                            mr: 1.5,
                            width: 36,
                            height: 36,
                          }}
                        >
                          {section.icon}
                        </Avatar>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: themeColors.secondary,
                          }}
                        >
                          {section.title}
                        </Typography>
                      </Box>
                      <Box sx={{ pl: 0.5 }}>
                        {section.items.map((item, idx) => (
                          <Button
                            key={idx}
                            fullWidth
                            sx={{
                              justifyContent: "flex-start",
                              py: 0.7,
                              px: 1,
                              mb: 0.5,
                              color: themeColors.darkGray,
                              textTransform: "none",
                              "&:hover": {
                                backgroundColor: `${section.color}20`,
                                color: themeColors.text,
                              },
                              borderRadius: "6px",
                              fontSize: "0.875rem",
                            }}
                          >
                            {item}
                          </Button>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>

            {/* Bottom banner */}
            <Box
              sx={{
                p: 3,
                backgroundColor: themeColors.lightBlue,
                borderTop: `1px solid ${themeColors.mediumGray}`,
                borderRadius: "0 0 16px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: mainColor }}
                >
                  Exclusive Collections
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: themeColors.darkGray }}
                >
                  Discover curated products selected by our experts
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<FavoriteBorderOutlinedIcon />}
                sx={{
                  backgroundColor: mainColor,
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: mainColor,
                    opacity: 0.9,
                  },
                  boxShadow: "none",
                }}
              >
                View Collections
              </Button>
            </Box>
          </Box>
        </Drawer>
      </Box>

      {/* Mobile Catalog Drawer (Simplified) */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Button
          variant="text"
          startIcon={<CategoryIcon />}
          onClick={toggleDrawer(true)}
          sx={{
            color: themeColors.secondary,
            fontWeight: 500,
            textTransform: "none",
            "&:hover": {
              backgroundColor: themeColors.lightGray,
            },
          }}
        >
          Catalog
        </Button>
      </Box>
    </>
  );
};

export default CatalogHeader;
