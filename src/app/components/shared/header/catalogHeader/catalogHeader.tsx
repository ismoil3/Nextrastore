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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useCatalogHeader } from "@/app/store/catalogHeader/catalogHeader";
import { mainColor } from "@/theme/main";
import { Subcategories } from "@/types/catalogTypes";
import { CloseOutlined } from "@mui/icons-material";

const CatalogHeader: FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [idx, setIdx] = useState<number | null>(null);
  const { getCatalog, catalog } = useCatalogHeader();

  useEffect(() => {
    getCatalog();
  }, []);

  const toggleDrawer = (newOpen: boolean) => () => {
    setIsDrawerOpen(newOpen);
  };

  const subcategory: Subcategories | undefined = catalog.find(
    (el: { id: number }) => el.id === idx
  );
  console.log(catalog.length);

  return (
    <Box sx={{ display: { xs: "none", md: "block" } }}>
      {/* Button to open drawer */}
      <Button
        onClick={toggleDrawer(true)}
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
        <MenuIcon sx={{ fontSize: "16px", fontWeight: "400" }} />
        <Typography
          sx={{
            fontSize: "14px",
            display: "flex",
            gap: "6px",
            alignItems: "center",
          }}
        >
          Каталог{" "}
          <Typography
            component="span"
            sx={{ display: { xs: "none", md: "block" } }}
          >
            товаров
          </Typography>
        </Typography>
      </Button>

      {/* Drawer for categories and subcategories */}
      <Drawer
        anchor="top"
        onMouseLeave={() => setIdx(null)}
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#f4f4f4",
            padding: "20px",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "90vh",
            display: "flex",
            flexDirection: "row",
            gap: "20px",
          }}
        >
          {/* Categories section */}
          <Box
            sx={{
              flex: "1",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              overflow: "auto",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                padding: "15px",
                fontWeight: "bold",
                backgroundColor: mainColor,
                color: "#fff",
                position: "sticky",
                top: "0",
                zIndex: "100",
              }}
            >
              Категории
            </Typography>
            <List>
              {catalog.length > 0 &&
                catalog.map((el: any) => (
                  <ListItem
                    className="duration-300"
                    key={el.id}
                    onMouseEnter={() => setIdx(el.id)}
                    sx={{
                      padding: "10px 20px",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: mainColor,
                        color: "#fff",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: idx === el.id ? "bold" : "normal",
                      }}
                    >
                      {el.categoryName}
                    </Typography>
                    <ChevronRightIcon />
                  </ListItem>
                ))}
            </List>
          </Box>

          {/* Subcategories section */}
          <Box
            sx={{
              flex: "2",
              backgroundColor: "#fff",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              padding: "15px",
              overflow: "auto",
            }}
            className="subList"
          >
            <Box
              sx={{
                textAlign: "center",
                paddingBottom: "15px",
                fontWeight: "bold",
                borderBottom: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              className="subList"
            >
              <Typography variant="h6">Подкатегории</Typography>
              <IconButton
                sx={{ cursor: "pointer" }}
                onClick={() => setIsDrawerOpen(false)}
              >
                <CloseOutlined />
              </IconButton>
            </Box>
            {subcategory ? (
              <List>
                {subcategory.subCategories.length > 0 ? (
                  subcategory.subCategories.map((el) => (
                    <ListItem
                      className="subList"
                      key={el.id}
                      sx={{
                        padding: "10px 15px",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                        cursor: "pointer",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                        }}
                      >
                        {el.subCategoryName}
                      </Typography>
                    </ListItem>
                  ))
                ) : (
                  <Typography
                    sx={{
                      textAlign: "center",
                      marginTop: "20px",
                      color: "#999",
                    }}
                  >
                    Нет подкатегории
                  </Typography>
                )}
              </List>
            ) : (
              <Typography
                sx={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#999",
                }}
              >
                Выберите категорию, чтобы увидеть подкатегории
              </Typography>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CatalogHeader;
