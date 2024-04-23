import LoginPage from "../pages/LoginPage";
import Layout from "../components/Layout";

const LoginUser = (loginUser, element) => {
    return loginUser.isAuthenticated ? <Layout>{element}</Layout> : <LoginPage />;
};

export default LoginUser;
