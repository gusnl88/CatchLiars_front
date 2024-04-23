import LoginPage from "../pages/LoginPage";

const LoginUser = (loginUser, element) => {
    return loginUser.isAuthenticated ? element : <LoginPage />;
};

export default LoginUser;
