import { mainColor } from "@/theme/main";
import { Box, Button, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 3,
        px: 2,
        background: `linear-gradient(135deg, ${alpha(
          mainColor,
          0.05
        )} 0%, ${alpha(mainColor, 0.15)} 100%)`,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "4rem", md: "6rem" },
          fontWeight: 800,
          color: mainColor,
          textShadow: `0 0 20px ${alpha(mainColor, 0.4)}`,
        }}
      >
        404
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
        Page not found
      </Typography>

      <Typography
        variant="body1"
        sx={{ color: "text.secondary", maxWidth: 400 }}
      >
        It looks like you&apos;ve followed an incorrect link or the page has been
        removed.
      </Typography>

      <Link href={"/"}>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            borderRadius: 3,
            px: 4,
            py: 1.2,
            textTransform: "none",
            fontSize: "1rem",
            backgroundColor: mainColor,
            boxShadow: `0 4px 14px ${alpha(mainColor, 0.3)}`,
            "&:hover": {
              backgroundColor: alpha(mainColor, 0.9),
              boxShadow: `0 6px 20px ${alpha(mainColor, 0.4)}`,
            },
          }}
        >
          Go to Home
        </Button>
      </Link>
    </Box>
  );
}
