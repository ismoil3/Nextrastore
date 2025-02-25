"use client";
import * as React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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

  const handleLogIn = async (event:React.FormEvent<HTMLFormElement>) => {
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Log in to Exclusive
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
        Enter your details below
      </Typography>

      <Box sx={{ width: "100%", maxWidth: 400 }}>
        <form onSubmit={handleLogIn}>
          <TextField
            label="user name"
            variant="outlined"
            required
            fullWidth
            sx={{
              "& .MuiInputLabel-root.Mui-focused": {
                color: mainColor,
              },
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: mainColor,
                },
                "&.Mui-focused fieldset": {
                  borderColor: mainColor,
                },
              },
            }}
            margin="normal"
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
              "& .MuiInputLabel-root.Mui-focused": {
                color: mainColor,
              },
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: mainColor,
                },
                "&.Mui-focused fieldset": {
                  borderColor: mainColor,
                },
              },
            }}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Box sx={{ textAlign: "center", mt: 1, mb: 2 }}>
            <Typography color={mainColor} gutterBottom>
              {error}
            </Typography>
            <Link href="#" color={mainColor} variant="body2" underline="hover">
              Forgot Password?
            </Link>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{ bgcolor: mainColor, height: 48 }}
            type="submit"
            disabled={loading}
          >
            Log In
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: "center",}}>
          <Typography variant="body2" color="textSecondary">
            Already have account? 
            <Link href="/registration" style={{marginLeft:"10px"}} color={mainColor} underline="hover">
               registration
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
