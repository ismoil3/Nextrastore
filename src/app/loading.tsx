"use client";
import { mainColor } from "@/theme/main";
import { Box, keyframes, useTheme, alpha } from "@mui/material";

// Modern keyframe animations
const pulseWave = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.7;
    box-shadow: 0 0 0 0 ${alpha(mainColor, 0.7)};
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
    box-shadow: 0 0 0 10px ${alpha(mainColor, 0)};
  }
  100% {
    transform: scale(0.8);
    opacity: 0.7;
    box-shadow: 0 0 0 0 ${alpha(mainColor, 0)};
  }
`;

const orbit = keyframes`
  0% {
    transform: rotate(0deg) translateX(20px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(20px) rotate(-360deg);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const floating = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(5deg);
  }
  66% {
    transform: translateY(5px) rotate(-5deg);
  }
`;

function Loading() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "300px",
        flexDirection: "column",
        gap: 4,
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.background.default,
          0.8
        )} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
        borderRadius: 4,
        p: 4,
        mx: "auto",
        maxWidth: "400px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Modern Orbital Animation */}
      <Box
        sx={{
          position: "relative",
          width: 100,
          height: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            bgcolor: mainColor,
            animation: `${pulseWave} 2s ease-in-out infinite`,
            position: "relative",
            zIndex: 2,
            boxShadow: `0 0 20px ${alpha(mainColor, 0.5)}`,
          }}
        />
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: alpha(mainColor, 0.7),
              position: "absolute",
              animation: `${orbit} 1.5s linear infinite`,
              animationDelay: `${i * 0.5}s`,
              boxShadow: `0 0 10px ${alpha(mainColor, 0.3)}`,
            }}
          />
        ))}
      </Box>

      {/* Shimmer Text Placeholder */}
      <Box
        sx={{
          width: 120,
          height: 16,
          borderRadius: 1,
          background: `linear-gradient(90deg, ${theme.palette.grey[200]} 0%, ${theme.palette.grey[100]} 50%, ${theme.palette.grey[200]} 100%)`,
          backgroundSize: "200px 100%",
          animation: `${shimmer} 1.5s infinite linear`,
          mb: 1,
        }}
      />

      <Box
        sx={{
          width: 80,
          height: 12,
          borderRadius: 1,
          background: `linear-gradient(90deg, ${theme.palette.grey[200]} 0%, ${theme.palette.grey[100]} 50%, ${theme.palette.grey[200]} 100%)`,
          backgroundSize: "200px 100%",
          animation: `${shimmer} 1.5s infinite linear`,
          animationDelay: "0.3s",
        }}
      />

      {/* Floating Elements */}
      <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 30,
              borderRadius: 4,
              bgcolor: alpha(mainColor, 0.8),
              animation: `${floating} 2s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
              transformOrigin: "bottom center",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default Loading;
