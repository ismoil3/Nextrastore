"use client";
import type * as React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
  InputAdornment,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  EmailOutlined,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";
import { useAuth } from "@/app/store/auth/useAuth";
import { mainColor } from "@/theme/main";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { error, setError, logIn, loading } = useAuth();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");

    const loginUser = {
      userName: email,
      password: password,
    };
    logIn(loginUser);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: `linear-gradient(135deg, ${mainColor}15 0%, #f5f5f5 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <Box
        sx={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: `${mainColor}10`,
          top: "-100px",
          right: "-100px",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: `${mainColor}15`,
          bottom: "50px",
          left: "-50px",
        }}
      />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: 2, sm: 4 },
          zIndex: 1,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: "900px",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            overflow: "hidden",
            borderRadius: 3,
          }}
        >
          {/* Brand section */}
          <Box
            sx={{
              flex: 1,
              background: `linear-gradient(135deg, ${mainColor} 0%, ${mainColor}dd 100%)`,
              padding: 4,
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              textAlign: "center",
            }}
          >
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
              SAREZ
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>
              Welcome Back!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Get access to a personalized experience and exclusive content
              created especially for you.
            </Typography>
          </Box>

          {/* Form section */}
          <Box
            sx={{
              flex: 1,
              padding: { xs: 3, sm: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: mainColor,
                  width: 56,
                  height: 56,
                  mb: 2,
                }}
              >
                <LockOutlined />
              </Avatar>
              <Typography variant="h5" fontWeight="500">
                Sign In to EXCLUSIVE
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your credentials to access your account
              </Typography>
            </Box>

            <form onSubmit={handleLogIn}>
              <TextField
                label="Username"
                variant="outlined"
                required
                fullWidth
                sx={{
                  mb: 2,
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: mainColor,
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: mainColor,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: mainColor,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                label="Password"
                variant="outlined"
                required
                type={showPassword ? "text" : "password"}
                fullWidth
                sx={{
                  mb: 2,
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: mainColor,
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: mainColor,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: mainColor,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mb: 3,
                }}
              >
                <Link
                  href="#"
                  color={mainColor}
                  variant="body2"
                  underline="hover"
                  sx={{ fontWeight: 500 }}
                >
                  Forgot password?
                </Link>
              </Box>

              {error && (
                <Typography
                  color="error"
                  align="center"
                  variant="body2"
                  sx={{ mb: 2 }}
                >
                  {error}
                </Typography>
              )}

              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: mainColor,
                  height: 48,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: `0 4px 12px ${mainColor}40`,
                  "&:hover": {
                    bgcolor: `${mainColor}e0`,
                    boxShadow: `0 6px 16px ${mainColor}60`,
                  },
                }}
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <Box sx={{ mt: 3, mb: 3 }}>
              <Divider>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 1 }}
                >
                  Or sign in with
                </Typography>
              </Divider>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mb: 3,
              }}
            >
              {[GoogleIcon, FacebookIcon, GitHubIcon].map((Icon, index) => (
                <IconButton
                  key={index}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    p: 1,
                    color: "text.secondary",
                    "&:hover": {
                      bgcolor: "#f5f5f5",
                    },
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account?{" "}
                <Link
                  href="/registration"
                  color={mainColor}
                  underline="hover"
                  sx={{ fontWeight: 500 }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
