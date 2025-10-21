"use client";
import Container from "@/app/components/shared/container/container";
import ProductsGrid from "@/app/components/ui/home/products-grid";
import { useProductsStore } from "@/app/store/product/product";
import { imgUrl } from "@/config/config";
import { mainColor } from "@/theme/main";
import {
  Clear as ClearIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Tune as TuneIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  Drawer,
  Fab,
  IconButton,
  Paper,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ProductsPage = () => {
  const {
    products,
    getProducts,
    loadMore,
    resetPage,
    hasMore,
    isLoadingProducts,
    isLoadingLoadMore,
    brands,
    getBrands,
    getCategories,
    categories,
    subCategories,
    getSubCategories,
  } = useProductsStore();

  const searchParams = useSearchParams();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const category = searchParams.get("category") ?? "";
  const subCategory = searchParams.get("subcategory") ?? "";
  const query = searchParams.get("query") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const brand = searchParams.get("brand") ?? "";

  // State for mobile filter drawer
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    categories: true,
    subcategories: true,
    price: true,
  });

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (category) count++;
    if (subCategory) count++;
    if (brand) count++;
    if (minPrice) count++;
    if (maxPrice) count++;
    setActiveFiltersCount(count);
  }, [category, subCategory, brand, minPrice, maxPrice]);

  // ✅ helper
  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // ✅ Load products on filter change
  useEffect(() => {
    resetPage();
    getProducts(query, brand, category, subCategory, minPrice, maxPrice);
  }, [
    query,
    brand,
    category,
    subCategory,
    minPrice,
    maxPrice,
    getProducts,
    resetPage,
  ]);

  // ✅ Load brands/categories/subCategories
  useEffect(() => {
    getBrands();
    getCategories();
    getSubCategories();
  }, [getBrands, getCategories, getSubCategories]);

  // ✅ Load more
  function loadMoreProducts() {
    if (!hasMore) return;
    loadMore();
    getProducts(query, brand, category, subCategory, minPrice, maxPrice, true);
  }

  // ✅ Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          !isLoadingProducts &&
          !isLoadingLoadMore &&
          hasMore
        ) {
          loadMoreProducts();
        }
      },
      { threshold: 1 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [
    loaderRef,
    isLoadingProducts,
    isLoadingLoadMore,
    hasMore,
    query,
    brand,
    category,
    subCategory,
    minPrice,
    maxPrice,
  ]);

  // Clear all filters
  const clearAllFilters = () => {
    router.push(pathname);
  };

  // Filter content component
  const FilterContent = () => (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "text.primary", fontWeight: 700, fontSize: "1.25rem" }}
        >
          Filters
        </Typography>
        {activeFiltersCount > 0 && (
          <Button
            onClick={clearAllFilters}
            size="small"
            sx={{ color: "text.secondary", textTransform: "none" }}
          >
            Clear all
          </Button>
        )}
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* Brands */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            mb: 1,
          }}
          onClick={() => toggleSection("brands")}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Brands
          </Typography>
          <ExpandMoreIcon
            sx={{
              transform: expandedSections.brands
                ? "rotate(0deg)"
                : "rotate(-90deg)",
              transition: "transform 0.3s",
              color: "text.secondary",
            }}
          />
        </Box>

        <Collapse in={expandedSections.brands}>
          <Box sx={{ maxHeight: 200, overflow: "auto", pl: 0.5 }}>
            {brands.map((b) => (
              <Box
                key={b.id}
                sx={{
                  mb: 1,
                  cursor: "pointer",
                  borderRadius: 1.5,
                  p: 1.5,
                  bgcolor:
                    brand === String(b.id) ? `${mainColor}08` : "transparent",
                  "&:hover": {
                    bgcolor:
                      brand === String(b.id) ? `${mainColor}08` : "grey.50",
                  },
                  transition: "background-color 0.2s",
                }}
                onClick={() => {
                  updateQueryParam(
                    "brand",
                    brand === String(b.id) ? "" : String(b.id)
                  );
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `2px solid ${
                        brand === String(b.id) ? mainColor : "grey.400"
                      }`,
                      mr: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        brand === String(b.id) ? mainColor : "transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    {brand === String(b.id) && (
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          bgcolor: "white",
                        }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    {b.brandName}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Collapse>
      </Box>

      {/* Categories */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            mb: 1,
          }}
          onClick={() => toggleSection("categories")}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Categories
          </Typography>
          <ExpandMoreIcon
            sx={{
              transform: expandedSections.categories
                ? "rotate(0deg)"
                : "rotate(-90deg)",
              transition: "transform 0.3s",
              color: "text.secondary",
            }}
          />
        </Box>

        <Collapse in={expandedSections.categories}>
          <Box sx={{ maxHeight: 200, overflow: "auto", pl: 0.5 }}>
            {categories.map((c) => (
              <Box
                key={c.id}
                sx={{
                  mb: 1,
                  cursor: "pointer",
                  borderRadius: 1.5,
                  p: 1.5,
                  bgcolor:
                    category === String(c.id)
                      ? `${mainColor}08`
                      : "transparent",
                  "&:hover": {
                    bgcolor:
                      category === String(c.id) ? `${mainColor}08` : "grey.50",
                  },
                  transition: "background-color 0.2s",
                }}
                onClick={() => {
                  updateQueryParam(
                    "category",
                    category === String(c.id) ? "" : String(c.id)
                  );
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `2px solid ${
                        category === String(c.id) ? mainColor : "grey.400"
                      }`,
                      mr: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        category === String(c.id) ? mainColor : "transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    {category === String(c.id) && (
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          bgcolor: "white",
                        }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    {c.categoryName}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Collapse>
      </Box>

      {/* Subcategories */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            mb: 1,
          }}
          onClick={() => toggleSection("subcategories")}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Subcategories
          </Typography>
          <ExpandMoreIcon
            sx={{
              transform: expandedSections.subcategories
                ? "rotate(0deg)"
                : "rotate(-90deg)",
              transition: "transform 0.3s",
              color: "text.secondary",
            }}
          />
        </Box>

        <Collapse in={expandedSections.subcategories}>
          <Box sx={{ maxHeight: 200, overflow: "auto", pl: 0.5 }}>
            {subCategories.map((sc) => (
              <Box
                key={sc.id}
                sx={{
                  mb: 1,
                  cursor: "pointer",
                  borderRadius: 1.5,
                  p: 1.5,
                  bgcolor:
                    subCategory === String(sc.id)
                      ? `${mainColor}08`
                      : "transparent",
                  "&:hover": {
                    bgcolor:
                      subCategory === String(sc.id)
                        ? `${mainColor}08`
                        : "grey.50",
                  },
                  transition: "background-color 0.2s",
                }}
                onClick={() => {
                  updateQueryParam(
                    "subcategory",
                    subCategory === String(sc.id) ? "" : String(sc.id)
                  );
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `2px solid ${
                        subCategory === String(sc.id) ? mainColor : "grey.400"
                      }`,
                      mr: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        subCategory === String(sc.id)
                          ? mainColor
                          : "transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    {subCategory === String(sc.id) && (
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          bgcolor: "white",
                        }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    {sc.subCategoryName}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Collapse>
      </Box>
    </>
  );

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
      <Container>
        {/* App Bar for mobile */}
        {isMobile && (
          <AppBar
            position="sticky"
            color="inherit"
            elevation={0}
            sx={{
              bgcolor: "background.paper",
              borderBottom: `1px solid ${theme.palette.divider}`,
              top: 0,
              zIndex: 1100,
            }}
          >
            <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                Catalog
              </Typography>
              <Badge badgeContent={activeFiltersCount} color="primary">
                <IconButton
                  onClick={() => setFilterOpen(true)}
                  sx={{
                    color: "text.primary",
                  }}
                >
                  <TuneIcon />
                </IconButton>
              </Badge>
            </Toolbar>
          </AppBar>
        )}

        <Box sx={{ display: "flex", gap: 3, pt: 3, pb: 6 }}>
          {/* Desktop filter */}
          {!isMobile && (
            <Paper
              elevation={0}
              sx={{
                maxWidth: 320,
                width: "100%",
                p: 3,
                borderRadius: 3,
                height: "fit-content",
                position: "sticky",
                top: "30px",
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: "background.paper",
              }}
            >
              <FilterContent />
            </Paper>
          )}

          {/* Mobile filter drawer */}
          <Drawer
            anchor="right"
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            PaperProps={{
              sx: {
                width: "100%",
                maxWidth: 400,
                p: 3,
                bgcolor: "background.paper",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Filters
              </Typography>
              <IconButton onClick={() => setFilterOpen(false)} size="large">
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ overflow: "auto", flex: 1 }}>
              <FilterContent />
            </Box>
            <Box
              sx={{
                pt: 2,
                mt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Button
                fullWidth
                variant="contained"
                onClick={() => setFilterOpen(false)}
                sx={{
                  bgcolor: mainColor,
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: mainColor,
                    opacity: 0.9,
                  },
                }}
              >
                Show results
              </Button>
            </Box>
          </Drawer>

          {/* Products */}
          <Box flex={1}>
            {/* Page title for desktop */}
            {!isMobile && (
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}
              >
                Catalog products
              </Typography>
            )}

            {/* Active filters chips */}
            {(category || subCategory || brand || minPrice || maxPrice) && (
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mr: 1 }}
                >
                  Active filters:
                </Typography>
                {category && (
                  <Chip
                    label={`Category: ${
                      categories.find((c) => String(c.id) === category)
                        ?.categoryName || category
                    }`}
                    onDelete={() => updateQueryParam("category", "")}
                    size="small"
                    sx={{
                      bgcolor: `${mainColor}08`,
                      color: mainColor,
                      fontWeight: 500,
                      "& .MuiChip-deleteIcon": {
                        color: `${mainColor}80`,
                        "&:hover": {
                          color: mainColor,
                        },
                      },
                    }}
                  />
                )}
                {subCategory && (
                  <Chip
                    label={`Subcategory: ${
                      subCategories.find((sc) => String(sc.id) === subCategory)
                        ?.subCategoryName || subCategory
                    }`}
                    onDelete={() => updateQueryParam("subcategory", "")}
                    size="small"
                    sx={{
                      bgcolor: `${mainColor}08`,
                      color: mainColor,
                      fontWeight: 500,
                      "& .MuiChip-deleteIcon": {
                        color: `${mainColor}80`,
                        "&:hover": {
                          color: mainColor,
                        },
                      },
                    }}
                  />
                )}
                {brand && (
                  <Chip
                    label={`Brand: ${
                      brands.find((b) => String(b.id) === brand)?.brandName ||
                      brand
                    }`}
                    onDelete={() => updateQueryParam("brand", "")}
                    size="small"
                    sx={{
                      bgcolor: `${mainColor}08`,
                      color: mainColor,
                      fontWeight: 500,
                      "& .MuiChip-deleteIcon": {
                        color: `${mainColor}80`,
                        "&:hover": {
                          color: mainColor,
                        },
                      },
                    }}
                  />
                )}
                {minPrice && (
                  <Chip
                    label={`From: ${minPrice} ₽`}
                    onDelete={() => updateQueryParam("minPrice", "")}
                    size="small"
                    sx={{
                      bgcolor: `${mainColor}08`,
                      color: mainColor,
                      fontWeight: 500,
                      "& .MuiChip-deleteIcon": {
                        color: `${mainColor}80`,
                        "&:hover": {
                          color: mainColor,
                        },
                      },
                    }}
                  />
                )}
                {maxPrice && (
                  <Chip
                    label={`To: ${maxPrice} ₽`}
                    onDelete={() => updateQueryParam("maxPrice", "")}
                    size="small"
                    sx={{
                      bgcolor: `${mainColor}08`,
                      color: mainColor,
                      fontWeight: 500,
                      "& .MuiChip-deleteIcon": {
                        color: `${mainColor}80`,
                        "&:hover": {
                          color: mainColor,
                        },
                      },
                    }}
                  />
                )}
                <Button
                  onClick={clearAllFilters}
                  size="small"
                  startIcon={<ClearIcon />}
                  sx={{
                    color: "text.secondary",
                    ml: "auto",
                    textTransform: "none",
                  }}
                >
                  Clear all
                </Button>
              </Box>
            )}

            {products.length === 0 && !isLoadingProducts ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  bgcolor: "background.paper",
                  borderRadius: 3,
                }}
              >
                <SearchIcon
                  sx={{
                    fontSize: 64,
                    color: "text.secondary",
                    mb: 2,
                    opacity: 0.5,
                  }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Products not found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try changing filter parameters
                </Typography>
              </Box>
            ) : (
              <ProductsGrid
                imgUrl={imgUrl}
                isLoading={isLoadingProducts}
                mainColor={mainColor}
                onAddToCart={() => {}}
                products={products}
              />
            )}

            {/* Loader */}
            <Box
              ref={loaderRef}
              sx={{ display: "flex", justifyContent: "center", py: 4 }}
            >
              {isLoadingLoadMore && (
                <CircularProgress size={32} sx={{ color: mainColor }} />
              )}
            </Box>

            {/* No more products */}
            {!hasMore && products.length > 0 && (
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  py: 3,
                  color: "text.secondary",
                }}
              >
                You have viewed all products
              </Typography>
            )}
          </Box>
        </Box>
      </Container>

      {/* Mobile filter FAB */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="filter"
          onClick={() => setFilterOpen(true)}
          sx={{
            position: "fixed",
            bottom: 74,
            right: 24,
            bgcolor: mainColor,
            "&:hover": {
              bgcolor: mainColor,
              opacity: 0.9,
            },
          }}
        >
          <Badge badgeContent={activeFiltersCount} color="error">
            <FilterIcon />
          </Badge>
        </Fab>
      )}
    </Box>
  );
};

export default ProductsPage;
