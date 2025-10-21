"use client";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StarIcon from "@mui/icons-material/Star";
import { Box, Typography } from "@mui/material";
import { memo } from "react";

interface ServicesSectionProps {
  mainColor: string;
}

const ServicesSection = memo(({ mainColor }: ServicesSectionProps) => {
  const services = [
    {
      icon: <LocalShippingIcon />,
      title: "Free delivery",
      desc: "For orders from 5000₽",
    },
    {
      icon: <StarIcon />,
      title: "Quality guarantee",
      desc: "Verified quality products",
    },
    {
      icon: <ShoppingBagIcon />,
      title: "Easy return",
      desc: "30-day return policy",
    },
    {
      icon: <LocalOfferIcon />,
      title: "Special offers",
      desc: "New promotions every week",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr 1fr",
        },
        gap: 2,
        mb: 5,
      }}
    >
      {services.map((service, idx) => (
        <Box
          key={idx}
          sx={{
            bgcolor: "#fff",
            p: 2,
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
            display: "flex",
            alignItems: "center",
            gap: 2,
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
            },
          }}
        >
          <Box sx={{ color: mainColor, fontSize: "2rem" }}>{service.icon}</Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {service.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#6c757d" }}>
              {service.desc}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
});

ServicesSection.displayName = "ServicesSection";

export default ServicesSection;
