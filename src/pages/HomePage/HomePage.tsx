import React from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import APP_LOGO from "../../modules/layout/constants/app-logo";
import { useLocation, useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      style={{
        width: "100%",
        height: "100vh",
        background:
          "linear-gradient(90deg, rgba(0,212,255,1) 49%, rgba(7,255,255,1) 100%, rgba(2,0,36,1) 100%)",
      }}
    >
      <Tooltip title="nmcnpm-group24.vercel.app">
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            width: 260,
            paddingTop: 4,
            paddingLeft: 16,
            position: "absolute",
          }}
          onClick={() =>
            !location.pathname.includes("/home") && navigate("/home")
          }
        >
          <img
            style={{ width: 60, height: 60 }}
            src={APP_LOGO}
            alt="web logo"
          />

          <Typography
            style={{
              fontFamily: "cursive",
              color: "white",
              fontStyle: "italic",
              fontSize: 40,
            }}
          >
            Taskment
          </Typography>
        </Box>
      </Tooltip>

      <Box style={{ display: "flex", flexDirection: "row-reverse" }}>
        <Button
          variant="contained"
          color="primary"
          style={{ textTransform: "none", margin: "16px 4px" }}
          onClick={() => navigate("/register")}
        >
          <Typography style={{ fontWeight: 600 }}>Đăng ký</Typography>
        </Button>

        <Button
          variant="text"
          color="inherit"
          style={{ textTransform: "none", margin: "16px 4px" }}
          onClick={() => navigate("/login")}
        >
          <Typography style={{ fontWeight: 600, color: "white" }}>
            Đăng nhập
          </Typography>
        </Button>
      </Box>

      <Box style={{ display: "flex", height: "calc(100vh - 68px)" }}>
        <Box
          style={{
            flex: 1,
            position: "relative",
            top: "28%",
          }}
        >
          <Typography variant="h2" align="center" style={{ color: "white" }}>
            Taskment
          </Typography>
          <Typography align="center" style={{ color: "white" }}>
            Ứng dụng giúp quản lý công việc hiệu quả
          </Typography>
        </Box>
        <Box
          style={{
            flex: 2,
          }}
        >
          {/*  */}
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
