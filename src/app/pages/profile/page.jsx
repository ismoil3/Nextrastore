"use client";
import { imgUrl } from "@/config/config";
import axiosRequest from "@/utils/axiosRequest";
import { AnimatePresence, motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

// MUI imports
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Fade,
  IconButton,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

// MUI Icons
import { mainColor } from "@/theme/main";
import {
  ArrowBack as ArrowBackIcon,
  Badge as BadgeIcon,
  PhotoCamera as CameraIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Fingerprint as FingerprintIcon,
  Key as KeyIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";

const ProfileCard = ({ title, icon, value, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Box
        sx={{
          p: 3,
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              mr: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "12px",
              backgroundColor: "rgba(25, 118, 210, 0.1)",
              color: "primary.main",
            }}
          >
            {icon}
          </Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography
          variant="body1"
          fontWeight="medium"
          sx={{
            mt: "auto",
            wordBreak: title === "User ID" ? "break-all" : "normal",
            fontFamily: title === "User ID" ? "monospace" : "inherit",
            fontSize: title === "User ID" ? "0.8rem" : "inherit",
            color: "black",
          }}
        >
          {value || "Not specified"}
        </Typography>
      </Box>
    </motion.div>
  );
};

const RoleChip = ({ label, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
    >
      <Box
        sx={{
          px: 2,
          py: 1,
          borderRadius: "30px",
          background: `linear-gradient(135deg, ${mainColor} 0%, #3f51b5 100%)`,
          color: "white",
          fontWeight: "medium",
          fontSize: "0.875rem",
          boxShadow: "0 4px 12px rgba(63, 81, 181, 0.3)",
          display: "inline-block",
          m: 0.5,
        }}
      >
        {label}
      </Box>
    </motion.div>
  );
};

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dob: "0001-01-01",
  });
  const [imagePreview] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const getProfile = async () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.log("Token not found!");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setUserId(decoded?.sid);

        if (!decoded?.sid) {
          console.log("User ID not found in token");
          return;
        }

        setLoading(true);
        const { data } = await axiosRequest.get(
          `UserProfile/get-user-profile-by-id?id=${decoded.sid}`
        );
        setUser(data.data);
        setFormData({
          firstName: data.data.firstName || "",
          lastName: data.data.lastName || "",
          email: data.data.email || "",
          phoneNumber: data.data.phoneNumber || "",
          dob: data.data.dob === "0001-01-01" ? "" : data.data.dob,
        });
        setLoading(false);
        setInitialLoad(false);
      } catch (error) {
        setLoading(false);
        setInitialLoad(false);
        console.log("Token decoding error:", error);
      }
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const getUserDisplayName = () => {
    if (user.firstName || user.lastName) {
      return `${user.firstName} ${user.lastName}`.trim();
    }
    return user.userName;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create preview URL for the selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      // Create form data for the request
      const submitData = new FormData();
      submitData.append("FirstName", formData.firstName);
      submitData.append("LastName", formData.lastName);
      submitData.append("Email", formData.email);
      submitData.append("PhoneNumber", formData.phoneNumber);
      submitData.append("Dob", formData.dob || "0001-01-01");

      if (file) {
        submitData.append("Image", file);
      }

      // Send the request
      const response = await axiosRequest.put(
        `UserProfile/update-user-profile?id=${userId}`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.statusCode == "200") {
        setSuccess("Profile successfully updated!");
        setOpenModal(false);
        // Refresh the user data
        getProfile();
        // Reset file and preview
        setFile(null);
        setImagePreview(null);
      } else {
        setError(response.data.message || "Failed to update profile");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Profile update error: " + (error.message || "Unknown error"));
      console.log("Profile update error:", error);
    }
  };

  // Background animation variants
  const bgVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5 } },
  };

  // Profile card variants
  const profileCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  // Profile header variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.6 } },
  };

  // Avatar animation
  const avatarVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  if (initialLoad) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        pt: 3,
        pb: 6,
      }}
    >
      {/* Animated background elements */}
      <AnimatePresence>
        <motion.div
          variants={bgVariants}
          initial="hidden"
          animate="visible"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            zIndex: -2,
          }}
        />
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.8, x: "30%", y: "10%" }}
          animate={{ opacity: 0.6, scale: 1, x: "30%", y: "10%" }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          sx={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,77,255,0.2) 0%, rgba(124,77,255,0) 70%)",
            zIndex: -1,
            filter: "blur(40px)",
          }}
        />
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.8, x: "-20%", y: "60%" }}
          animate={{ opacity: 0.5, scale: 1, x: "-20%", y: "60%" }}
          transition={{
            duration: 3,
            delay: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          sx={{
            position: "absolute",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(66,165,245,0.2) 0%, rgba(66,165,245,0) 70%)",
            zIndex: -1,
            filter: "blur(40px)",
          }}
        />
      </AnimatePresence>

      <Container maxWidth="lg">
        {/* Main content */}
        <Box
          component={motion.div}
          variants={profileCardVariants}
          initial="hidden"
          animate="visible"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            position: "relative",
          }}
        >
          {/* Success message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    p: 2,
                    m: 3,
                    borderRadius: "12px",
                    backgroundColor: "rgba(76, 175, 80, 0.1)",
                    color: "success.dark",
                    border: "1px solid rgba(76, 175, 80, 0.3)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      mr: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "success.main",
                      color: "white",
                    }}
                  >
                    <KeyIcon fontSize="small" />
                  </Box>
                  <Typography color={"black"} variant="body2">
                    {success}
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Profile header section */}
          <Box
            component={motion.div}
            variants={headerVariants}
            sx={{
              p: 3,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "center" : "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "center" : "center",
                gap: 3,
              }}
            >
              <motion.div variants={avatarVariants}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={user.image ? imgUrl + user.image : undefined}
                    alt={getUserDisplayName()}
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: "18px",
                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    {!user.image && user.userName?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Tooltip title="Edit Profile">
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: -10,
                        right: -10,
                        backgroundColor: "primary.main",
                        color: "white",
                        boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      }}
                      onClick={() => setOpenModal(true)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </motion.div>

              <Box sx={{ textAlign: isMobile ? "center" : "left" }}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <Typography
                    variant="h4"
                    component="h1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {getUserDisplayName()}
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    @{user.userName}
                  </Typography>
                </motion.div>
              </Box>
            </Box>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setOpenModal(true)}
                sx={{
                  mt: isMobile ? 3 : 0,
                  borderRadius: "12px",
                  textTransform: "none",
                  py: 1.2,
                  px: 3,
                  background: `linear-gradient(135deg, ${mainColor} 0%, #3f51b5 100%)`,
                  boxShadow: "0 6px 15px rgba(66, 165, 245, 0.3)",
                  "&:hover": {
                    boxShadow: "0 8px 20px rgba(66, 165, 245, 0.4)",
                  },
                }}
              >
                Edit Profile
              </Button>
            </motion.div>
          </Box>

          <Divider sx={{ mx: 3 }} />

          {/* Personal information */}
          <Box sx={{ p: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 3, display: "flex", alignItems: "center" }}
              >
                <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                Personal Information
              </Typography>
            </motion.div>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
            >
              <ProfileCard
                title="First Name"
                icon={<BadgeIcon />}
                value={user.firstName}
                delay={0.9}
              />
              <ProfileCard
                title="Last Name"
                icon={<BadgeIcon />}
                value={user.lastName}
                delay={1.0}
              />
              <ProfileCard
                title="Email"
                icon={<EmailIcon />}
                value={user.email}
                delay={1.1}
              />
              <ProfileCard
                title="Phone"
                icon={<PhoneIcon />}
                value={user.phoneNumber}
                delay={1.2}
              />
              <ProfileCard
                title="Username"
                icon={<PersonIcon />}
                value={user.userName}
                delay={1.3}
              />
              <ProfileCard
                title="User ID"
                icon={<FingerprintIcon />}
                value={user.userId}
                delay={1.4}
              />
            </Box>
          </Box>

          {/* Roles section */}
          <Box sx={{ p: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 3, display: "flex", alignItems: "center" }}
              >
                <KeyIcon sx={{ mr: 1, color: "primary.main" }} />
                Roles and Permissions
              </Typography>
            </motion.div>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {user?.userRoles?.map((role, index) => (
                <RoleChip key={index} label={role.name} index={index} />
              ))}
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Edit Profile Modal */}
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setError("");
          setFile(null);
          setImagePreview(null);
        }}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isMobile ? "90%" : 600,
              bgcolor: "background.paper",
              borderRadius: "24px",
              boxShadow: 24,
              p: 4,
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Typography variant="h5" component="h2" fontWeight="bold">
                Edit Profile
              </Typography>
              <IconButton
                onClick={() => {
                  setOpenModal(false);
                  setError("");
                  setFile(null);
                  setImagePreview(null);
                }}
                size="small"
                sx={{
                  bgcolor: "rgba(0,0,0,0.05)",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Box>

            {/* Error message */}
            {error && (
              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: "12px",
                  backgroundColor: "rgba(244, 67, 54, 0.1)",
                  color: "error.dark",
                  border: "1px solid rgba(244, 67, 54, 0.3)",
                }}
              >
                {error}
              </Box>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              {/* Profile Image Section */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 4,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={
                      imagePreview ||
                      (user.image ? imgUrl + user.image : undefined)
                    }
                    alt={getUserDisplayName()}
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "24px",
                      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {!user.image &&
                      !imagePreview &&
                      user.userName?.charAt(0).toUpperCase()}
                  </Avatar>

                  <IconButton
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: -10,
                      right: -10,
                      backgroundColor: "primary.main",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                  >
                    <CameraIcon />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </IconButton>
                </Box>
              </Box>

              <Stack spacing={3}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                    gap: 2,
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />

                  <TextField
                    fullWidth
                    required
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Box>

                <TextField
                  fullWidth
                  required
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 2 } }}
                />

                <TextField
                  fullWidth
                  required
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 2 } }}
                />

                <TextField
                  fullWidth
                  required
                  id="dob"
                  name="dob"
                  label="Date of Birth"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 2 } }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>

              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    setOpenModal(false);
                    setError("");
                    setFile(null);
                    setImagePreview(null);
                  }}
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    py: 1.2,
                    px: 3,
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    py: 1.2,
                    px: 3,
                    background: loading
                      ? ""
                      : `linear-gradient(135deg, ${mainColor} 0%, #3f51b5 100%)`,
                    boxShadow: "0 4px 10px rgba(66, 165, 245, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 15px rgba(66, 165, 245, 0.4)",
                    },
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <span>Saving...</span>
                    </Box>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Profile;
