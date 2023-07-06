import React from "react";
import { Box } from "@mui/material";
import RegisterForm from "../../modules/register/components/RegisterForm/RegisterForm";

const RegisterPage = () => {
  return <Box style={{
    height: "106%",
    paddingTop: "5%" ,
    background: "url(https://firebasestorage.googleapis.com/v0/b/nmcnpm-d177c.appspot.com/o/files%2FBG_LOGIN_Page.png?alt=media&token=7aefc7b1-9b15-43d0-9d75-650eb5060c98)"
  }}>
    <RegisterForm/>
  </Box>;
};

export default RegisterPage;
