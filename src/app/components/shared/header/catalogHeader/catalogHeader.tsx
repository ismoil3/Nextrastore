"use client";

import { useCatalogHeader } from "@/app/store/catalogHeader/catalogHeader";
import { Subcategories } from "@/types/catalogTypes";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { FC, useEffect, useState } from "react";

// Icons
import { mainColor } from "@/theme/main";
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import NewReleasesOutlinedIcon from "@mui/icons-material/NewReleasesOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { useRouter, useSearchParams } from "next/navigation";

// Define theme colors
const themeColors = {
  primary: "#62B75A", // Bright blue
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
  const router = useRouter();
  const searchParams = useSearchParams();
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
      title: "Новинки",
      icon: <NewReleasesOutlinedIcon sx={{ color: themeColors.warning }} />,
      items: ["Только что добавлено", "Новые поступления", "Скоро в продаже"],
      color: themeColors.warning,
    },
    {
      title: "Спецпредложения",
      icon: <LocalOfferOutlinedIcon sx={{ color: themeColors.accent }} />,
      items: ["Распродажа", "Комплекты со скидкой", "Сезонные акции"],
      color: themeColors.accent,
    },
    {
      title: "Популярное",
      icon: <TrendingUpOutlinedIcon sx={{ color: themeColors.success }} />,
      items: ["Самые просматриваемые", "Бестселлеры", "Рекомендуемые товары"],
      color: themeColors.success,
    },
  ];

  const handleCategoryClick = (categoryId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", String(categoryId));
    router.push(`/pages/product?${params.toString()}`);
    setIsDrawerOpen(false);
  };

  const handleSubcategoryClick = (subcategoryId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("subcategory", String(subcategoryId));
    router.push(`/pages/product?${params.toString()}`);
    setIsDrawerOpen(false);
  };

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
          Каталог
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
              maxHeight: "97vh",
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
                  Категории
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
                        onClick={() => {
                          setSelectedCategory(category.id);
                          handleCategoryClick(category.id);
                        }}
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
                      Загрузка категорий...
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
                    : "Выберите категорию"}
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
                                    onClick={() =>
                                      handleSubcategoryClick(subCategory.id)
                                    }
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
                              Нет подкатегорий
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
                            Выберите категорию, чтобы увидеть подкатегории
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
                  Рекомендуем
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
          Каталог
        </Button>
      </Box>
    </>
  );
};

export default CatalogHeader;
