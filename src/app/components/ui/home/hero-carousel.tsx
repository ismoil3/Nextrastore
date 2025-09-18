"use client";
import { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Promo {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  color: string;
}

interface HeroCarouselProps {
  promos: Promo[];
  currentPromoIndex: number;
  onPrevPromo: () => void;
  onNextPromo: () => void;
  onPromoSelect: (index: number) => void;
  mainColor: string;
}

const HeroCarousel = memo(
  ({
    promos,
    currentPromoIndex,
    onPrevPromo,
    onNextPromo,
    onPromoSelect,
    mainColor,
  }: HeroCarouselProps) => {
    const currentPromo = promos[currentPromoIndex];

    const handleDotClick = useCallback(
      (index: number) => {
        onPromoSelect(index);
      },
      [onPromoSelect]
    );

    return (
      <Box sx={{ mb: 4, position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPromoIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ position: "relative" }}
          >
            <Box
              sx={{
                height: { xs: "220px", sm: "300px", md: "400px" },
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${currentPromo.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "brightness(0.85)",
                  zIndex: 1,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)`,
                  zIndex: 2,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  p: { xs: 3, md: 5 },
                  zIndex: 3,
                  width: { xs: "100%", md: "50%" },
                  color: "white",
                }}
              >
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                    mb: 1,
                  }}
                >
                  {currentPromo.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    opacity: 0.9,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                  }}
                >
                  {currentPromo.subtitle}
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: currentPromo.color,
                    "&:hover": {
                      bgcolor: currentPromo.color,
                      filter: "brightness(0.9)",
                    },
                    textTransform: "none",
                    borderRadius: "50px",
                    px: 3,
                    py: { xs: 1, md: 1.5 },
                  }}
                >
                  {currentPromo.cta}
                </Button>
              </Box>
            </Box>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <Box sx={{ position: "absolute", bottom: "50%", left: 16, zIndex: 10 }}>
          <IconButton
            onClick={onPrevPromo}
            sx={{
              bgcolor: "rgba(255,255,255,0.7)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Box
          sx={{ position: "absolute", bottom: "50%", right: 16, zIndex: 10 }}
        >
          <IconButton
            onClick={onNextPromo}
            sx={{
              bgcolor: "rgba(255,255,255,0.7)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>

        {/* Indicator dots */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
            gap: 1,
          }}
        >
          {promos.map((_, index) => (
            <Box
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: index === currentPromoIndex ? mainColor : "#dee2e6",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            />
          ))}
        </Box>
      </Box>
    );
  }
);

HeroCarousel.displayName = "HeroCarousel";

export default HeroCarousel;
