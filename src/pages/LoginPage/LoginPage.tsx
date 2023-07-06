import { Box } from "@mui/material";
import LoginForm from "../../modules/login/components/LoginForm/LoginForm";

const LoginPage = () => {
  return (
    <Box style={{
      height: "106%",
      paddingTop: "5%" ,
      background: "url(https://firebasestorage.googleapis.com/v0/b/nmcnpm-d177c.appspot.com/o/files%2FBG_LOGIN_Page.png?alt=media&token=7aefc7b1-9b15-43d0-9d75-650eb5060c98)"
    }}>
      <LoginForm />
    </Box>
  );
};

export default LoginPage;