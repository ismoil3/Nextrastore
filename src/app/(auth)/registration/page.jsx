"use client";

import React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@/app/store/auth/useAuth";
import { mainColor } from "@/theme/main";

export default function RegistrationPage() {
  const { loading, registration, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    form: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password" || name === "confirmPassword") {
      setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Пароль должен содержать не менее 6 символов";
    }
    if (!/\d/.test(password)) {
      return "Пароль должен содержать хотя бы одну цифру";
    }
    if (!/[A-Z]/.test(password)) {
      return "Пароль должен содержать хотя бы одну заглавную букву";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrors((prev) => ({ ...prev, password: passwordError }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Пароли не совпадают",
      }));
      return;
    }

    if (!acceptTerms) {
      setErrors((prev) => ({
        ...prev,
        form: "Пожалуйста, примите условия и положения",
      }));
      return;
    }

    await registration(formData);
  };

  const commonTextFieldProps = {
    variant: "outlined",
    required: true,
    fullWidth: true,
    sx: {
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
    },
    margin: "normal",
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
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          boxShadow: 1,
        }}
      >
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          Создать аккаунт
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ mb: 3 }}
          align="center"
        >
          Введите свои данные ниже
        </Typography>

        {errors.form && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.form}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            {...commonTextFieldProps}
            label="Имя пользователя"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
          />
          <TextField
            {...commonTextFieldProps}
            label="Номер телефона"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <TextField
            {...commonTextFieldProps}
            label="Электронная почта"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            {...commonTextFieldProps}
            label="Пароль"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            {...commonTextFieldProps}
            label="Подтвердите пароль"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                sx={{
                  color: mainColor,
                  "&.Mui-checked": {
                    color: mainColor,
                  },
                }}
              />
            }
            label={
              <Typography color={mainColor} variant="body2">
                Я согласен с{" "}
                <Link href="#" color={mainColor} underline="hover">
                  условиями и положениями
                </Link>
              </Typography>
            }
            sx={{ mt: 1 }}
          />

          <Typography color={mainColor} sx={{ mt: 2 }}>
            {error}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: mainColor,
              height: 48,
              mt: 2,
              "&:hover": {
                bgcolor: mainColor,
              },
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Создать аккаунт"
            )}
          </Button>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary">
              Уже есть аккаунт?{" "}
              <Link href="/login" color={mainColor} underline="hover">
                Войти
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
