"use client";

import React, { useState } from "react";
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
  Paper,
  Avatar,
  useTheme,
  useMediaQuery,
  Container,
  Stepper,
  Step,
  StepLabel,
  Stack
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  PersonAdd, 
  Email, 
  Phone, 
  Lock, 
  LockOpen,
  CheckCircle,
  ArrowBack,
  ChevronRight
} from "@mui/icons-material";
import { useAuth } from "@/app/store/auth/useAuth";
import { mainColor } from "@/theme/main";

export default function RegistrationPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('1000'));
  
  //  color scheme
  const secondaryColor = "#22C55E"; // Green accent for success elements
  const tertiaryColor = "#F97316"; // Orange for accents
  const darkText = "#1E293B"; // Slate-800
  const lightText = "#64748B"; // Slate-500
  const subtleBg = "#F8FAFC"; // Slate-50
  const cardBg = "white";
  
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
  const [currentStep, setCurrentStep] = useState(1);

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
    
    if (currentStep === 1) {
      if (!formData.userName || !formData.email || !formData.phoneNumber) {
        setErrors(prev => ({ ...prev, form: "Пожалуйста, заполните все поля" }));
        return;
      }
      setCurrentStep(2);
      return;
    }
    
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

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  // Password strength indicators
  const hasMinLength = formData.password.length >= 6;
  const hasDigit = /\d/.test(formData.password);
  const hasUppercase = /[A-Z]/.test(formData.password);
  
  const getPasswordStrength = () => {
    let strength = 0;
    if (hasMinLength) strength++;
    if (hasDigit) strength++;
    if (hasUppercase) strength++;
    return strength;
  };
  
  const passwordStrength = getPasswordStrength();
  
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return "#EF4444"; // Red
      case 1: return "#F97316"; // Orange
      case 2: return "#FACC15"; // Yellow
      case 3: return "#22C55E"; // Green
      default: return "#CBD5E1"; // Slate-300
    }
  };
  
  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return "Слабый";
      case 1: return "Средний";
      case 2: return "Хороший";
      case 3: return "Надежный";
      default: return "";
    }
  };

  const PasswordStrengthMeter = () => (
    <Box sx={{ mb: 3, mt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Надежность пароля
        </Typography>
        <Typography variant="body2" fontWeight="medium" sx={{ color: getPasswordStrengthColor() }}>
          {getPasswordStrengthText()}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              height: 4,
              flex: 1,
              borderRadius: 2,
              bgcolor: index < passwordStrength ? getPasswordStrengthColor() : '#E2E8F0',
              transition: 'background-color 0.3s ease'
            }}
          />
        ))}
      </Box>
      
      <Stack spacing={1}>
        <PasswordRequirement met={hasMinLength} text="Минимум 6 символов" />
        <PasswordRequirement met={hasDigit} text="Хотя бы одна цифра" />
        <PasswordRequirement met={hasUppercase} text="Хотя бы одна заглавная буква" />
      </Stack>
    </Box>
  );
  
  const PasswordRequirement = ({ met, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <CheckCircle fontSize="small" sx={{ 
        mr: 1, 
        color: met ? secondaryColor : 'text.disabled',
        transition: 'color 0.3s ease' 
      }} />
      <Typography 
        variant="body2" 
        sx={{ 
          color: met ? darkText : lightText,
          transition: 'color 0.3s ease'
        }}
      >
        {text}
      </Typography>
    </Box>
  );



  const commonTextFieldProps = {
    variant: "outlined",
    required: true,
    fullWidth: true,
    size: "medium",
    sx: {
      "& .MuiInputLabel-root": {
        fontSize: "0.95rem",
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: mainColor,
      },
      "& .MuiOutlinedInput-root": {
        borderRadius: 3,
        height: 56,
        "&:hover fieldset": {
          borderColor: mainColor,
        },
        "&.Mui-focused fieldset": {
          borderColor: mainColor,
        },
      },
      mb: 3,
    },
  };

  const inputIcons = {
    userName: <PersonAdd fontSize="small" sx={{ color: mainColor }} />,
    email: <Email fontSize="small" sx={{ color: mainColor }} />,
    phoneNumber: <Phone fontSize="small" sx={{ color: mainColor }} />,
    password: <Lock fontSize="small" sx={{ color: mainColor }} />,
    confirmPassword: <LockOpen fontSize="small" sx={{ color: mainColor }} />,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: subtleBg,
        p: 0,
      }}
    >
      {!isMobile && (
        <Box
          sx={{
            flex: { md: 1, lg: 1.3 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(125deg, ${mainColor} 0%, #A5B4FC 50%, ${mainColor} 100%)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
            opacity: 0.2,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          
          <Box
            sx={{
              width: "80%",
              maxWidth: 550,
              zIndex: 1,
              position: "relative",
              py: 4,
              px: 6,
              color: "white",
            }}
          >
            <Box sx={{ mb: 6 }}>
              <Typography variant="h3" fontWeight="bold" mb={2}>
                Создайте аккаунт
              </Typography>
              
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, lineHeight: 1.5 }}>
                Получите доступ ко всем функциям нашей платформы и присоединяйтесь к нашему сообществу
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                mb: 6, 
                p: 4, 
                bgcolor: 'rgba(255, 255, 255, 0.15)', 
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar 
                  src="/avatar-1.jpg" 
                  sx={{ width: 56, height: 56, border: "2px solid white" }}
                />
                <Box sx={{ ml: 2.5 }}>
                  <Typography variant="body1" fontWeight="medium">
                    `Это платформа полностью изменила мой рабочий процесс. Настоятельно рекомендую!`
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                    Анна С., Дизайнер UX/UI
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFF" />
                    </svg>
                  ))}
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  4.8/5 на основе более 3000 отзывов
                </Typography>
              </Box>
            </Box>
            
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <CheckCircle sx={{ mr: 2, color: tertiaryColor }} />
                <Typography variant="body1" fontWeight="medium">
                  Быстрая регистрация за несколько шагов
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <CheckCircle sx={{ mr: 2, color: tertiaryColor }} />
                <Typography variant="body1" fontWeight="medium">
                  Персонализированный интерфейс для каждого пользователя
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <CheckCircle sx={{ mr: 2, color: tertiaryColor }} />
                <Typography variant="body1" fontWeight="medium">
                  Высокий уровень безопасности и защиты данных
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CheckCircle sx={{ mr: 2, color: tertiaryColor }} />
                <Typography variant="body1" fontWeight="medium">
                  Круглосуточная поддержка пользователей
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={isMobile ? 1 : 2}
            sx={{
              width: "100%",
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              overflow: "hidden",
              backgroundColor: cardBg,
              border: '1px solid rgba(203, 213, 225, 0.5)'
            }}
          >
            {/* Header with stepper */}
            <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              {currentStep === 2 && (
                <Button 
                  onClick={handleBackToStep1}
                  startIcon={<ArrowBack />}
                  sx={{ 
                    color: lightText, 
                    mb: 2,
                    textTransform: 'none',
                    fontWeight: 'normal',
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: darkText
                    }
                  }}
                >
                  Вернуться к личным данным
                </Button>
              )}
            
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                color={darkText}
                gutterBottom
              >
                {currentStep === 1 ? "Регистрация аккаунта" : "Настройка безопасности"}
              </Typography>
              <Typography variant="body1" color={lightText} mb={2}>
                {currentStep === 1 
                  ? "Введите ваши данные для создания нового аккаунта" 
                  : "Создайте надежный пароль для защиты вашего аккаунта"}
              </Typography>
              
              <Box sx={{ width: '100%', mt: 1 }}>
                <Stepper 
                  activeStep={currentStep - 1} 
                  alternativeLabel
                  sx={{
                    '& .MuiStepLabel-root .Mui-active': {
                      color: mainColor,
                    },
                    '& .MuiStepLabel-root .Mui-completed': {
                      color: secondaryColor,
                    }
                  }}
                >
                  <Step>
                    <StepLabel>Личная информация</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Безопасность</StepLabel>
                  </Step>
                </Stepper>
              </Box>
            </Box>
            
            {errors.form && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  "& .MuiAlert-icon": { color: "#EF4444" } 
                }}
                variant="filled"
              >
                {errors.form}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {currentStep === 1 ? (
                // Step 1: Personal information
                <>
                  <TextField
                    {...commonTextFieldProps}
                    label="Имя пользователя"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder="Иван Иванов"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {inputIcons.userName}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    {...commonTextFieldProps}
                    label="Электронная почта"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@mail.ru"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {inputIcons.email}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    {...commonTextFieldProps}
                    label="Номер телефона"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+7 (999) 123-45-67"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {inputIcons.phoneNumber}
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    variant="contained"
                    fullWidth
                    endIcon={<ChevronRight />}
                    sx={{
                      bgcolor: mainColor,
                      height: 56,
                      borderRadius: 3,
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 500,
                      boxShadow: `0 4px 16px ${mainColor}40`,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: `${mainColor}E6`,
                        boxShadow: `0 6px 20px ${mainColor}50`,
                        transform: "translateY(-2px)",
                      },
                    }}
                    type="submit"
                  >
                    Продолжить
                  </Button>

                

                
                </>
              ) : (
                // Step 2: Password setup
                <>
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
                      startAdornment: (
                        <InputAdornment position="start">
                          {inputIcons.password}
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: "text.secondary" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <PasswordStrengthMeter />
                  
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
                      startAdornment: (
                        <InputAdornment position="start">
                          {inputIcons.confirmPassword}
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: "text.secondary" }}
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
                      <Typography variant="body2">
                        Я принимаю{" "}
                        <Link href="#" sx={{ color: mainColor, fontWeight: 500 }} underline="hover">
                          пользовательское соглашение
                        </Link>{" "}
                        и{" "}
                        <Link href="#" sx={{ color: mainColor, fontWeight: 500 }} underline="hover">
                          политику конфиденциальности
                        </Link>
                      </Typography>
                    }
                    sx={{ mt: 1, mb: 3 }}
                  />

                  {error && (
                    <Alert 
                      severity="error" 
                      variant="filled" 
                      sx={{ mt: 1, mb: 2.5, borderRadius: 2 }}
                    >
                      {error}
                    </Alert>
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: mainColor,
                      height: 56,
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: "1rem",
                      boxShadow: `0 4px 16px ${mainColor}40`,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: `${mainColor}E6`,
                        boxShadow: `0 6px 20px ${mainColor}50`,
                        transform: "translateY(-2px)",
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
                </>
              )}
            </form>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2" color={lightText}>
                Уже есть аккаунт?{" "}
                <Link 
                  href="/login" 
                  sx={{ 
                    color: mainColor, 
                    fontWeight: 500,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline"
                    }
                  }}
                >
                  Войти
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}